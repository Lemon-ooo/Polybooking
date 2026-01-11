<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

use App\Models\Booking;
use App\Models\Room;
use App\Models\AssignedRoom;

class AdminAssignedRoomController extends Controller
{
    /**
     * POST /api/bookings/{id}/assign-room
     * Assign a room to a paid booking (admin)
     */
    public function assign(Request $request, $bookingId)
    {
        $user = $request->user();
        if (!$user || $user->role !== 'admin') {
            return $this->error('FORBIDDEN', 'Bạn không có quyền thực hiện thao tác này', 403);
        }

        try {
            $validated = $request->validate([
                'room_id' => 'required|exists:rooms,room_id',
            ]);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return $this->validationError($e->errors());
        }

        $booking = Booking::with('items')->find($bookingId);
        if (!$booking) {
            return $this->error('BOOKING_NOT_FOUND', 'Không tìm thấy booking', 404);
        }

        if ($booking->status !== Booking::STATUS_PAID) {
            return $this->error('INVALID_BOOKING_STATUS', 'Booking chưa ở trạng thái đã thanh toán');
        }

        $requiredRooms = $booking->items->sum('quantity');
        if ($requiredRooms < 1) {
            return $this->error('ROOM_COUNT_MISMATCH', 'Booking này không phải đặt 1 phòng');
        }

        DB::beginTransaction();
        try {
            $room = Room::lockForUpdate()
                ->where('room_id', $validated['room_id'])
                ->first();

            if (!$room || $room->room_status !== \App\Models\Room::STATUS_AVAILABLE) {
                throw new \Exception('ROOM_NOT_AVAILABLE');
            }

            AssignedRoom::create([
                'booking_id'   => $booking->id,
                'room_id'      => $room->room_id,
                'room_type_id' => $room->room_type_id,
                'check_in'     => $booking->check_in,
                'check_out'    => $booking->check_out,
                'status'       => \App\Models\AssignedRoom::STATUS_ASSIGNED,
            ]);

            // Mark room as booked/reserved
            $room->update(['room_status' => Room::STATUS_BOOKED]);

            DB::commit();

            return $this->success([
                'booking_id' => $booking->id,
                'room_id'    => $room->room_id,
                'status'     => \App\Models\AssignedRoom::STATUS_ASSIGNED
            ]);
        } catch (\Exception $e) {
            DB::rollBack();
            return $this->error('ASSIGN_FAILED', $e->getMessage());
        }
    }

    private function success($data, $status = 200)
    {
        return response()->json(['success' => true, 'data' => $data, 'meta' => ['timestamp' => now()->toISOString()]], $status);
    }

    private function error($code, $message, $status = 400)
    {
        return response()->json(['success' => false, 'error' => ['code' => $code, 'message' => $message]], $status);
    }

    private function validationError($details)
    {
        return response()->json(['success' => false, 'error' => ['code' => 'VALIDATION_ERROR', 'message' => 'Dữ liệu không hợp lệ', 'details' => $details]], 422);
    }
}
