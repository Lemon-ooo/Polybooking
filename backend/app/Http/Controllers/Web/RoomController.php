<?php

namespace App\Http\Controllers\Web;

use App\Http\Controllers\Controller;
use App\Models\Room;
use App\Models\RoomType;
use App\Models\Amenity;
use Illuminate\Http\Request;

class RoomController extends Controller
{
    /**
     * Hiển thị danh sách phòng
     */
    public function index()
    {
        $rooms = Room::with(['roomType', 'amenities'])->latest()->paginate(10);
        return view('rooms.index', compact('rooms'));
    }

    /**
     * Hiển thị form tạo phòng mới
     */
    public function create()
    {
        $roomTypes = RoomType::all();
        $amenities = Amenity::all();
        return view('rooms.create', compact('roomTypes', 'amenities'));
    }

    /**
     * Lưu phòng mới vào database
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'room_number' => 'required|numeric|max:999',
            'room_type_id' => 'required|exists:room_types,id',
            'description' => 'nullable|string',
            'price' => 'required|numeric|min:0',
            'status' => 'required|string|in:trống',
            'amenities' => 'nullable|array',
            'amenities.*' => 'exists:amenities,amenity_id',


        ]);

        $room = Room::create($validated);

        if (!empty($request->amenities)) {
            $room->amenities()->sync($request->amenities);
        }

        return redirect()->route('rooms.index')->with('success', 'Thêm phòng thành công!');
    }

    /**
     * Hiển thị form sửa phòng
     */
    public function edit(Room $room)
    {
        $roomTypes = RoomType::all();
        $amenities = Amenity::all();
        $room->load('amenities');
        return view('rooms.edit', compact('room', 'roomTypes', 'amenities'));
    }

    /**
     * Cập nhật phòng
     */
    public function update(Request $request, Room $room)
    {
        $validated = $request->validate([
            'room_number' => 'required|numeric|max:999',
            'room_type_id' => 'required|exists:room_types,id',
            'description' => 'nullable|string',
            'price' => 'required|numeric|min:0',
            'status' => 'required|string|in:trống,đang sử dụng,bảo trì',
            'amenities' => 'nullable|array',
            'amenities.*' => 'exists:amenities,amenity_id',
        ]);

        $room->update($validated);
        $room->amenities()->sync($request->amenities ?? []);

        return redirect()->route('rooms.index')->with('success', 'Cập nhật phòng thành công!');
    }
        public function show(string $id)
    {
        $room = Room::findOrFail($id);
        return view('rooms.show', compact('room'));
    }

    /**
     * Xóa phòng
     */
    public function destroy(Room $room)
    {
        $room->delete();
        return redirect()->route('rooms.index')->with('success', 'Xóa phòng thành công!');
    }
}
