<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Room;
use App\Models\RoomType;
use Illuminate\Http\Request;

class RoomController extends Controller
{
    /**
     * Danh sách phòng (có phân trang).
     */
    public function index()
    {
        $rooms = Room::with('roomType')->paginate(15);

        return response()->json([
            "success" => true,
            "data"    => $rooms->items(),
            "message" => "Rooms retrieved successfully",
            "meta"    => [
                "total" => $rooms->total(),
                "per_page" => $rooms->perPage(),
                "current_page" => $rooms->currentPage(),
                "last_page" => $rooms->lastPage(),
            ]
        ]);
    }

    /**
     * Tạo phòng mới.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'room_number'  => 'required|integer|max:999|unique:rooms,room_number',
            'room_type_id' => 'required|exists:room_types,room_type_id',
            'room_status'  => 'required|string|in:available',
            'description'  => 'nullable|string',
        ]);

        $room = Room::create($validated);

        return response()->json([
            "success" => true,
            "data"    => $room,
            "message" => "Room created successfully",
        ], 201);
    }

    /**
     * Chi tiết phòng.
     */
    public function show($id)
    {
        $room = Room::with('roomType')->findOrFail($id);

        return response()->json([
            "success" => true,
            "data"    => $room,
            "message" => "Room retrieved successfully",
        ]);
    }

    /**
     * Cập nhật phòng.
     */
    public function update(Request $request, $id)
    {
        $room = Room::findOrFail($id);

        $validated = $request->validate([
            'room_number'  => 'required|integer|max:999|unique:rooms,room_number,' . $room->room_id . ',room_id',
            'room_type_id' => 'required|exists:room_types,room_type_id',
            'room_status'  => 'required|string|in:available,booked,maintenance,unavailable',
            'description'  => 'nullable|string',
        ]);

        $room->update($validated);

        return response()->json([
            "success" => true,
            "data"    => $room,
            "message" => "Room updated successfully",
        ]);
    }

    /**
     * Xóa phòng.
     */
    public function destroy($id)
    {
        $room = Room::findOrFail($id);
        $room->delete();

        return response()->json([
            "success" => true,
            "data"    => null,
            "message" => "Room deleted successfully",
        ]);
    }
}