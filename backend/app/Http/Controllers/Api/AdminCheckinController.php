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
     * Check-in + nhập thông tin guest + gán phòng
     */
    public function checkin(Request $request, $bookingId)
    {
        /* ================= AUTH (ADMIN) ================= */
        $user = $request->user();
        if (!$user || !$user->is_admin) {
            return $this->error(
                'FORBIDDEN',
                'Bạn không có quyền thực hiện thao tác này',
                403
            );
        }

        /* ================= VALIDATION ================= */
        try {
            $validated = $request->validate([
                'guests' => 'required|array|min:1',

                'guests.*.name' => 'required|string|max:255',
                'guests.*.age'       => 'required|integer|min:0',
                'guests.*.room_id'   => 'required|exists:rooms,room_id',
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
        $inputRooms    = collect($validated['guests'])
                            ->pluck('room_id')
                            ->unique()
                            ->count();

        if ($requiredRooms !== $inputRooms) {
            return $this->error(
                'ROOM_COUNT_MISMATCH',
                'Số phòng gán không khớp với booking'
            );
        }

        /* ================= TRANSACTION ================= */
        DB::beginTransaction();
        try {
            foreach ($validated['guests'] as $guest) {

                // 🔒 Lock phòng
                $room = Room::lockForUpdate()
                    ->where('room_id', $guest['room_id'])
                    ->first();

                if (!$room) {
                    throw new \Exception('ROOM_NOT_FOUND');
                }

                if ($room->status !== 'available') {
                    throw new \Exception('ROOM_NOT_AVAILABLE');
                }

                // ✅ Lưu guest
                BookingGuest::create([
                    'booking_id' => $booking->booking_id,
                    'room_id'    => $room->room_id,
                    'name'  => $guest['name'],
                    'age'        => $guest['age'],
                    'checked_in' => true,
                ]);

                // ✅ Gán phòng cho booking (1 lần / phòng)
                AssignedRoom::firstOrCreate(
                    [
                        'booking_id' => $booking->booking_id,
                        'room_id'    => $room->room_id,
                    ],
                    [
                        'check_in_at' => now(),
                    ]
                );

                // ✅ Đổi trạng thái phòng
                $room->update(['status' => 'occupied']);
            }

            // ✅ Đổi trạng thái booking
            $booking->update(['status' => 'checked_in']);

            DB::commit();

            return $this->success([
                'booking_id' => $booking->booking_id,
                'status'     => 'checked_in',
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
