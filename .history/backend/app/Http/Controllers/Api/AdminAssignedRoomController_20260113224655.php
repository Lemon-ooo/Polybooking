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
     * GET /api/bookings/{id}/assigned-rooms
     * Get assigned rooms for a booking
     */
    public function index($bookingId)
    {
        try {
            $booking = Booking::find($bookingId);
            if (!$booking) {
                return $this->error('BOOKING_NOT_FOUND', 'Không tìm thấy booking', 404);
            }

            $assignedRooms = AssignedRoom::where('booking_id', $bookingId)
                ->with(['room' => function($query) {
                    $query->select('room_id', 'room_number', 'room_type_id', 'floor');
                }])
                ->with(['room.roomType' => function($query) {
                    $query->select('room_type_id', 'room_type_name');
                }])
                ->get();

            // Format response
            $formattedRooms = $assignedRooms->map(function($assignedRoom) {
                return [
                    'assigned_room_id' => $assignedRoom->assigned_room_id,
                    'booking_id' => $assignedRoom->booking_id,
                    'room_id' => $assignedRoom->room_id,
                    'room_number' => $assignedRoom->room->room_number ?? 'N/A',
                    'room_type_id' => $assignedRoom->room_type_id,
                    'room_type_name' => $assignedRoom->room->roomType->room_type_name ?? 'N/A',
                    'check_in' => $assignedRoom->check_in,
                    'check_out' => $assignedRoom->check_out,
                    'status' => $assignedRoom->status,
                    'created_at' => $assignedRoom->created_at,
                    'updated_at' => $assignedRoom->updated_at,
                ];
            });

            return $this->success($formattedRooms);
        } catch (\Exception $e) {
            return $this->error('SERVER_ERROR', $e->getMessage(), 500);
        }
    }

    /**
     * GET /api/assigned-rooms
     * List all assigned rooms with filters
     */
    public function list(Request $request)
    {
        try {
            $query = AssignedRoom::query()
                ->with(['room' => function($query) {
                    $query->select('room_id', 'room_number', 'room_type_id', 'floor');
                }])
                ->with(['room.roomType' => function($query) {
                    $query->select('room_type_id', 'room_type_name');
                }]);

            // Filter by booking_id
            if ($request->has('booking_id')) {
                $query->where('booking_id', $request->booking_id);
            }

            // Filter by room_type_id
            if ($request->has('room_type_id')) {
                $query->where('room_type_id', $request->room_type_id);
            }

            $assignedRooms = $query->get();

            // Format response
            $formattedRooms = $assignedRooms->map(function($assignedRoom) {
                return [
                    'assigned_room_id' => $assignedRoom->assigned_room_id,
                    'booking_id' => $assignedRoom->booking_id,
                    'room_id' => $assignedRoom->room_id,
                    'room_number' => $assignedRoom->room->room_number ?? 'N/A',
                    'room_type_id' => $assignedRoom->room_type_id,
                    'room_type_name' => $assignedRoom->room->roomType->room_type_name ?? 'N/A',
                    'check_in' => $assignedRoom->check_in,
                    'check_out' => $assignedRoom->check_out,
                    'status' => $assignedRoom->status,
                    'created_at' => $assignedRoom->created_at,
                    'updated_at' => $assignedRoom->updated_at,
                ];
            });

            return $this->success($formattedRooms);
        } catch (\Exception $e) {
            return $this->error('SERVER_ERROR', $e->getMessage(), 500);
        }
    }

    /**
     * POST /api/bookings/{id}/assign-room
     * Assign a room to a paid booking (admin)
     */
public function assign(Request $request, $bookingId)
{
    $user = $request->user();
    if (!$user || $user->role !== 'admin') {
        return $this->error(
            'FORBIDDEN',
            'Bạn không có quyền thực hiện thao tác này',
            403
        );
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
        return $this->error(
            'BOOKING_NOT_FOUND',
            'Không tìm thấy booking',
            404
        );
    }

    // Chỉ cho gán phòng khi booking đã thanh toán
    if ($booking->status !== Booking::STATUS_PAID) {
        return $this->error(
            'INVALID_BOOKING_STATUS',
            'Booking chưa ở trạng thái đã thanh toán'
        );
    }

    // Tổng số phòng khách đã đặt
    $totalBookedRooms = $booking->items->sum('quantity');

    // Tổng số phòng đã được gán
    $totalAssignedRooms = AssignedRoom::where('booking_id', $booking->id)->count();

    // Nếu đã gán đủ thì chặn
    if ($totalAssignedRooms >= $totalBookedRooms) {
        return $this->error(
            'ROOM_ASSIGN_COMPLETED',
            'Booking này đã được gán đủ phòng'
        );
    }

    DB::beginTransaction();
    try {
        // Lock phòng để tránh gán trùng
        $room = Room::lockForUpdate()
            ->where('room_id', $validated['room_id'])
            ->first();

        if (!$room) {
            throw new \Exception('ROOM_NOT_FOUND');
        }

        if ($room->room_status !== Room::STATUS_AVAILABLE) {
            throw new \Exception('ROOM_NOT_AVAILABLE');
        }

        // Không cho gán trùng cùng 1 phòng cho 1 booking
        $exists = AssignedRoom::where('booking_id', $booking->id)
            ->where('room_id', $room->room_id)
            ->exists();

        if ($exists) {
            throw new \Exception('ROOM_ALREADY_ASSIGNED');
        }

        // Tạo bản ghi assigned_rooms
        $assignedRoom = AssignedRoom::create([
            'booking_id'   => $booking->id,
            'room_id'      => $room->room_id,
            'room_type_id' => $room->room_type_id,
            'check_in'     => $booking->check_in,
            'check_out'    => $booking->check_out,
            'status'       => AssignedRoom::STATUS_ASSIGNED,
        ]);

        // Cập nhật trạng thái phòng
        $room->update([
            'room_status' => Room::STATUS_BOOKED
        ]);

        DB::commit();

        return $this->success([
            'assigned_room' => [
                'assigned_room_id' => $assignedRoom->assigned_room_id,
                'booking_id' => $assignedRoom->booking_id,
                'room_id' => $room->room_id,
                'room_number' => $room->room_number,
                'room_type_id' => $room->room_type_id,
                'room_type_name' => $room->roomType->room_type_name ?? null,
                'check_in' => $assignedRoom->check_in,
                'check_out' => $assignedRoom->check_out,
                'status' => $assignedRoom->status,
            ],
            'progress' => [
                'total_booked' => $totalBookedRooms,
                'total_assigned' => $totalAssignedRooms + 1,
                'remaining' => $totalBookedRooms - ($totalAssignedRooms + 1),
            ]
        ]);

    } catch (\Exception $e) {
        DB::rollBack();

        return $this->error(
            'ASSIGN_FAILED',
            $e->getMessage()
        );
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