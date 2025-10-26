<?php

namespace App\Http\Controllers;
use App\Models\Room;
use App\Models\RoomType;
use Illuminate\Http\Request;

class RoomController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        
        $rooms = Room::with('roomType')->get();
        return view('rooms.index', compact('rooms'));
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
         $roomTypes = RoomType::all();
        return view('rooms.create', compact('roomTypes'));
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'room_number' => 'required|string|max:50',
            'room_type_id' => 'required|exists:room_types,id',
            'description' => 'nullable|string',
            'price' => 'nullable|numeric|min:0',
            'status' => 'required|string',
        ]);

         Room::create($validated);

        return redirect()->route('rooms.index')->with('success', 'Thêm phòng thành công!');
    }

    /**
     * Display the specified resource.
     */
    public function show(Room $room)
    {
          // Gọi luôn loại phòng liên quan để hiển thị đầy đủ thông tin
    $room->load('roomType');
    return view('rooms.show', compact('room'));
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Room $room)
    {
        $roomTypes = RoomType::all();
        return view('rooms.edit', compact('room', 'roomTypes'));
    }

    public function edit(Room $room)
{
    $amenities = Amenity::all();
    return view('rooms.edit', compact('room', 'amenities'));
}

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request,Room $room )
    {
         $validated = $request->validate([
            'room_number' => 'required|string|max:50',
            'room_type_id' => 'required|exists:room_types,id',
            'description' => 'nullable|string',
            'price' => 'nullable|numeric|min:0',
            'status' => 'required|string',
        ]);

        $room->update($validated);

        return redirect()->route('rooms.index')->with('success', 'Cập nhật phòng thành công!');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Room $room)
    {
        $room->delete();
        return redirect()->route('rooms.index')->with('success', 'Xóa phòng thành công!');
    }
}
