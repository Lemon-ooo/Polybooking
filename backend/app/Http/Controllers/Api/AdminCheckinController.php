<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

// Models
use App\Models\Booking;
use App\Models\Room;
use App\Models\AssignedRoom;

class AdminCheckinController extends Controller
{
    /* =========================================================
     * POST /api/admin/bookings/{id}/checkin
     * Admin thực hiện check-in
     * ========================================================= */
    public function checkin(Request $request, $id)
    {
        /**
         * 1. AUTH + ROLE CHECK (ADMIN)
         * Giả định User có field is_admin = true
         */
        $user = $request->user();
        if (!$user || !$user->is_admin) {
            return $this->error(
                'FORBIDDEN',
                'Bạn không có quyền thực hiện thao tác này',
                403
            );
        }

        /**
         * 2. VALIDATE INPUT
         */
        try {
            $validated = $request->validate([
                'rooms' => 'required|array|min:1',
                'rooms.*.room_id' => 'required|exists:rooms,id'
            ]);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return $this->validationError($e->errors());
        }

        /**
         * 3. LOAD BOOKING
         */
        $booking = Booking::with('items')->find($id);
        if (!$booking) {
            return $this->error(
                'BOOKING_NOT_FOUND',
                'Không tìm thấy booking',
                404
            );
        }

        if ($booking->status !== 'paid') {
            return $this->error(
                'INVALID_BOOKING_STATUS',
                'Booking chưa ở trạng thái đã thanh toán'
            );
        }

        /**
         * 4. CHECK SỐ LƯỢNG PHÒNG
         */
        $requiredRooms = $booking->items->sum('quantity');
        $inputRooms    = count($validated['rooms']);

        if ($requiredRooms !== $inputRooms) {
            return $this->error(
                'ROOM_COUNT_MISMATCH',
                'Số phòng gán không khớp với booking'
            );
        }

        /**
         * 5. TRANSACTION CHECK-IN
         */
        DB::beginTransaction();
        try {
            foreach ($validated['rooms'] as $item) {
                $room = Room::lockForUpdate()->find($item['room_id']);

                if (!$room) {
                    throw new \Exception('ROOM_NOT_FOUND');
                }

                if ($room->status !== 'available') {
                    throw new \Exception('ROOM_NOT_AVAILABLE');
                }

                AssignedRoom::create([
                    'booking_id' => $booking->id,
                    'room_id'    => $room->id,
                    'check_in_at'=> now()
                ]);

                $room->update(['status' => 'occupied']);
            }

            $booking->update(['status' => 'checked_in']);

            DB::commit();

            return $this->success([
                'booking_id' => $booking->id,
                'status'     => 'checked_in'
            ]);

        } catch (\Exception $e) {
            DB::rollBack();

            $code = match ($e->getMessage()) {
                'ROOM_NOT_AVAILABLE' => 'ROOM_NOT_AVAILABLE',
                'ROOM_NOT_FOUND'     => 'ROOM_NOT_FOUND',
                default              => 'CHECKIN_FAILED'
            };

            return $this->error(
                $code,
                'Không thể thực hiện check-in'
            );
        }
    }

    /* =========================================================
     * HELPER RESPONSES (Refile-safe)
     * ========================================================= */
    private function success($data, $status = 200)
    {
        return response()->json([
            'success' => true,
            'data'    => $data,
            'meta'    => [
                'timestamp' => now()->toISOString()
            ]
        ], $status);
    }

    private function error($code, $message, $status = 400)
    {
        return response()->json([
            'success' => false,
            'error' => [
                'code'    => $code,
                'message' => $message
            ]
        ], $status);
    }

    private function validationError($details)
    {
        return response()->json([
            'success' => false,
            'error' => [
                'code'    => 'VALIDATION_ERROR',
                'message' => 'Dữ liệu không hợp lệ',
                'details' => $details
            ]
        ], 422);
    }
}
