<?php

namespace App\Http\Controllers\Web;

use App\Http\Controllers\Controller;
use App\Models\Room;
use App\Models\RoomType;
use Illuminate\Http\Request;

class RoomController extends Controller
{
    /**
     * Danh sách phòng.
     */
    public function index()
    {
        $rooms = Room::with('roomType')->paginate(15);

        return view('admin.rooms.index', compact('rooms'));
    }

    /**
     * Form tạo phòng.
     */
    public function create()
    {
        $roomTypes = RoomType::all();

        return view('admin.rooms.create', compact('roomTypes'));
    }

    /**
     * Lưu phòng mới.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'room_number'  => 'required|string|max:50|unique:rooms,room_number',
            'room_type_id' => 'required|exists:room_types,room_type_id',
            'room_status'  => 'required|string|in:available',
            'description'  => 'nullable|string',
        ]);

        Room::create($validated);

        return redirect()
            ->route('admin.rooms.index')
            ->with('success', 'Tạo phòng thành công.');
    }

    /**
     * Xem chi tiết phòng.
     */
    public function show($id)
    {
        $room = Room::with('roomType')->findOrFail($id);

        return view('admin.rooms.show', compact('room'));
    }

    /**
     * Form sửa phòng.
     */
    public function edit($id)
    {
        $room      = Room::findOrFail($id);
        $roomTypes = RoomType::all();

        return view('admin.rooms.edit', compact('room', 'roomTypes'));
    }

    /**
     * Cập nhật phòng.
     */
    public function update(Request $request, $id)
    {
        $room = Room::findOrFail($id);

        $validated = $request->validate([
            'room_number'  => 'required|integer|max:50|unique:rooms,room_number,' . $room->room_id . ',room_id',
            'room_type_id' => 'required|exists:room_types,room_type_id',
            'room_status'  => 'required|string|in:available,booked,maintenance,unavailable',
            'description'  => 'nullable|string',
        ]);

        $room->update($validated);

        return redirect()
            ->route('admin.rooms.index')
            ->with('success', 'Cập nhật phòng thành công.');
    }

    /**
     * Xóa phòng.
     */
    public function destroy($id)
    {
        $room = Room::findOrFail($id);
        $room->delete();

        return redirect()
            ->route('admin.rooms.index')
            ->with('success', 'Xóa phòng thành công.');
    }
}
