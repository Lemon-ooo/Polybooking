<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

// Models
use App\Models\Booking;
use App\Models\Room;
use App\Models\AssignedRoom;
use App\Models\BookingGuest;

class AdminCheckinController extends Controller
{
    /**
     * POST /api/admin/bookings/{booking_id}/checkin
     */
    public function checkin(Request $request, $bookingId)
    {
        /* ================= AUTH (ADMIN) ================= */
        $user = $request->user();
        if (!$user || $user->role !== 'admin') {
            return $this->error(
                'FORBIDDEN',
                'Bạn không có quyền thực hiện thao tác này',
                403
            );
        }

        /* ================= VALIDATION ================= */
        try {
            $validated = $request->validate([
                'room_id' => 'required|exists:rooms,room_id',
                'guests' => 'required|array|min:1',
                'guests.*.name' => 'required|string|max:255',
                'guests.*.age'  => 'required|integer|min:0',
            ]);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return $this->validationError($e->errors());
        }

        /* ================= LOAD BOOKING ================= */
        $booking = Booking::with('items')->find($bookingId);
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

        /* ================= CHECK ROOM COUNT ================= */
        $requiredRooms = $booking->items->sum('quantity');
        if ($requiredRooms !== 1) {
            return $this->error(
                'ROOM_COUNT_MISMATCH',
                'Booking này phải đặt đúng 1 phòng'
            );
        }

        DB::beginTransaction();
        try {
            /* ================= LOCK ROOM ================= */
            $room = Room::lockForUpdate()
                ->where('room_id', $validated['room_id'])
                ->first();

            if (!$room || $room->room_status !== 'available') {
                throw new \Exception('ROOM_NOT_AVAILABLE');
            }

            /* ================= ASSIGN ROOM ================= */
            AssignedRoom::create([
                'booking_id'    => $booking->id,
                'room_id'       => $room->room_id,
                'room_type_id'  => $room->room_type_id,
                'check_in'      => $booking->check_in,
                'check_out'     => $booking->check_out,
                'status'        => 'check_in',
                'checked_in_at' => now(),
            ]);

            /* ================= SAVE GUESTS ================= */
            foreach ($validated['guests'] as $guest) {
                BookingGuest::create([
                    'booking_id' => $booking->id,
                    'name'       => $guest['name'],
                    'age'        => $guest['age'],
                    'verified'   => true,
                ]);
            }

            /* ================= UPDATE ROOM + BOOKING ================= */
            $room->update(['room_status' => 'occupied']);
            $booking->update(['status' => Booking::STATUS_CHECK_IN]);

            DB::commit();

            return $this->success([
                'booking_id' => $booking->id,
                'room_id'    => $room->room_id,
                'guests'     => count($validated['guests']),
                'status'     => 'checked_in'
            ]);
        } catch (\Exception $e) {
            DB::rollBack();

            return $this->error(
                'CHECKIN_FAILED',
                $e->getMessage()
            );
        }
    }

    /* ================= HELPERS ================= */

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