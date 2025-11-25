<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Room;
use App\Models\RoomImage;
use Illuminate\Support\Facades\Storage;

class RoomImageController extends Controller
{
    /**
     * Hiển thị album ảnh của phòng
     */
    public function index($room_id)
    {
        $room = Room::with('images')->findOrFail($room_id);

        return response()->json([
            "success" => true,
            "data"    => $room->images,
            "message" => "Room images retrieved successfully",
        ]);
    }

    /**
     * Upload ảnh mới
     */
    public function store(Request $request, $room_id)
    {
        $request->validate([
            'images'   => 'required|array',
            'images.*' => 'image|mimes:jpeg,png,jpg,gif|max:2048'
        ]);

        $room = Room::findOrFail($room_id);

        $uploadedImages = [];

        foreach ($request->file('images') as $image) {
            $path = $image->store('uploads/rooms', 'public');

            $roomImage = RoomImage::create([
                'room_id'    => $room->room_id,
                'image_path' => $path
            ]);

            $uploadedImages[] = $roomImage;
        }

        return response()->json([
            "success" => true,
            "data"    => $uploadedImages,
            "message" => "Room images uploaded successfully",
        ], 201);
    }

    /**
     * Xóa ảnh
     */
    public function destroy($id)
    {
        $image = RoomImage::findOrFail($id);

        if ($image->image_path && Storage::disk('public')->exists($image->image_path)) {
            Storage::disk('public')->delete($image->image_path);
        }

        $image->delete();

        return response()->json([
            "success" => true,
            "data"    => null,
            "message" => "Room image deleted successfully",
        ]);
    }
}
