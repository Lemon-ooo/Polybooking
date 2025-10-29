<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Room;
use App\Models\RoomImage;
use Illuminate\Support\Facades\Storage;

class RoomImageController extends Controller
{
    // Hiển thị album ảnh của phòng
    public function index($room_id)
    {
        $room = Room::with('images')->findOrFail($room_id);
        return view('rooms.images.index', compact('room')); // Đúng đường dẫn view
    }

    // Upload ảnh mới
    public function store(Request $request, $room_id)
    {
        $request->validate([
            'images' => 'required|array',
            'images.*' => 'image|mimes:jpeg,png,jpg,gif|max:2048'
        ]);

        $room = Room::findOrFail($room_id);

        foreach ($request->file('images') as $image) {
            $path = $image->store('uploads/rooms', 'public');

            RoomImage::create([
                'room_id' => $room->room_id,
                'image_path' => $path
            ]);
        }

        return redirect()->back()->with('success', 'Ảnh đã được tải lên thành công!');
    }

    // Xóa ảnh
    public function destroy($id)
    {
        $image = RoomImage::findOrFail($id);

        // Xóa file khỏi storage
        if (Storage::disk('public')->exists($image->image_path)) {
            Storage::disk('public')->delete($image->image_path);
        }

        $image->delete();

        return redirect()->back()->with('success', 'Đã xóa ảnh thành công!');
    }
}