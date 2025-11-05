<?php

namespace App\Http\Controllers\Web;
use App\Http\Controllers\Controller;
use App\Models\RoomType;
use Illuminate\Http\Request;

class RoomTypeController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $roomTypes = RoomType::all();
        return view('room_types.index', compact('roomTypes'));
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return view('room_types.create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'base_price' => 'required|numeric|min:0',
        ]);

        RoomType::create($validated);
        return redirect()->route('web.room-types.index')->with('success', 'Loại phòng đã được thêm!');
    
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $roomType = RoomType::findOrFail($id);
        return view('room_types.show', compact('roomType'));
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        $roomType = RoomType::findOrFail($id);
        return view('room_types.edit', compact('roomType'));
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, RoomType $roomType)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'base_price' => 'required|numeric|min:0',
        ]);

        $roomType->update($validated);
        return redirect()->route('web.room-types.index')->with('success', 'Loại phòng đã được cập nhật!');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(RoomType $roomType)
    {
        $roomType->delete();
        return redirect()->route('web.room-types.index')->with('success', 'Loại phòng đã được xóa!');
    }
}
