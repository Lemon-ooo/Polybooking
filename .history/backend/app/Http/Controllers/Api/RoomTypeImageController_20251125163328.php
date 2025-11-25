<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\RoomType;
use App\Models\RoomTypeImage;
use Illuminate\Support\Facades\Storage;

class RoomTypeImageController extends Controller
{
    /**
     * Danh sách ảnh của một room_type
     */
    public function index($roomTypeId)
    {
        $roomType = RoomType::findOrFail($roomTypeId);

        $images = RoomTypeImage::where('room_type_id', $roomTypeId)
            ->orderBy('image_type', 'asc')
            ->orderBy('sort_order', 'asc')
            ->get();

        return response()->json([
            "success" => true,
            "data"    => $images,
            "message" => "Room type images retrieved successfully",
        ]);
    }

    /**
     * Upload ảnh mới
     */
    public function store(Request $request, $roomTypeId)
    {
        $roomType = RoomType::findOrFail($roomTypeId);

        $validated = $request->validate([
            'image'      => 'required|image|mimes:jpeg,png,jpg,webp|max:4096',
            'image_type' => 'required|in:main,secondary',
            'sort_order' => 'nullable|integer|min:0',
        ]);

        // Upload file
        $path = $request->file('image')->store('room_type_images', 'public');

        // Nếu chọn main, các ảnh khác chuyển sang secondary
        if ($validated['image_type'] === 'main') {
            RoomTypeImage::where('room_type_id', $roomTypeId)
                ->where('image_type', 'main')
                ->update(['image_type' => 'secondary']);
        }

        $image = RoomTypeImage::create([
            'room_type_id' => $roomTypeId,
            'image_url'    => $path,
            'image_type'   => $validated['image_type'],
            'sort_order'   => $validated['sort_order'] ?? 0,
        ]);

        return response()->json([
            "success" => true,
            "data"    => $image,
            "message" => "Room type image uploaded successfully",
        ], 201);
    }

    /**
     * Cập nhật ảnh
     */
    public function update(Request $request, $roomTypeId, $imageId)
    {
        $roomType = RoomType::findOrFail($roomTypeId);

        $image = RoomTypeImage::where('room_type_id', $roomTypeId)
            ->where('image_id', $imageId)
            ->firstOrFail();

        $validated = $request->validate([
            'image'      => 'nullable|image|mimes:jpeg,png,jpg,webp|max:4096',
            'image_type' => 'required|in:main,secondary',
            'sort_order' => 'nullable|integer|min:0',
        ]);

        // Upload ảnh mới nếu có
        if ($request->hasFile('image')) {
            if ($image->image_url && Storage::disk('public')->exists($image->image_url)) {
                Storage::disk('public')->delete($image->image_url);
            }

            $path = $request->file('image')->store('room_type_images', 'public');
            $image->image_url = $path;
        }

        // Nếu đổi sang main → các ảnh khác thành secondary
        if ($validated['image_type'] === 'main') {
            RoomTypeImage::where('room_type_id', $roomTypeId)
                ->where('image_id', '!=', $imageId)
                ->where('image_type', 'main')
                ->update(['image_type' => 'secondary']);
        }

        $image->image_type = $validated['image_type'];
        $image->sort_order = $validated['sort_order'] ?? 0;
        $image->save();

        return response()->json([
            "success" => true,
            "data"    => $image,
            "message" => "Room type image updated successfully",
        ]);
    }

    /**
     * Xóa ảnh
     */
    public function destroy($roomTypeId, $imageId)
    {
        $roomType = RoomType::findOrFail($roomTypeId);

        $image = RoomTypeImage::where('room_type_id', $roomTypeId)
            ->where('image_id', $imageId)
            ->firstOrFail();

        if ($image->image_url && Storage::disk('public')->exists($image->image_url)) {
            Storage::disk('public')->delete($image->image_url);
        }

        $image->delete();

        return response()->json([
            "success" => true,
            "data"    => null,
            "message" => "Room type image deleted successfully",
        ]);
    }
}
