<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\RoomTypeImage;
use App\Models\RoomType;
use Illuminate\Support\Facades\Storage;

class RoomTypeImageController extends Controller
{
    /**
     * Lấy danh sách ảnh của một loại phòng (Refine useTable)
     */
    public function index(Request $request, $roomTypeId)
    {
        $perPage = $request->get('per_page', 10);
        $page = $request->get('page', 1);

        $query = RoomTypeImage::where('room_type_id', $roomTypeId)
            ->orderBy('image_type', 'asc')
            ->orderBy('sort_order', 'asc');

        $images = $query->paginate($perPage, ['*'], 'page', $page);

        return response()->json([
            'data' => $images->items(),
            'total' => $images->total(),
        ]);
    }

    /**
     * Upload ảnh mới (Refine useCreate)
     */
public function store(Request $request, $roomTypeId)
{
    // Nếu là ảnh chính → chỉ nhận 1 file
    if ($request->image_type === 'main') {
        $request->validate([
            'image' => 'required|image|mimes:jpeg,png,jpg,webp|max:4096',
        ]);

        // Nếu chọn main, các ảnh khác chuyển thành secondary
        RoomTypeImage::where('room_type_id', $roomTypeId)
            ->where('image_type', 'main')
            ->update(['image_type' => 'secondary']);

        $path = $request->file('image')->store('room_type_images', 'public');

        $image = RoomTypeImage::create([
            'room_type_id' => $roomTypeId,
            'image_url' => $path,
            'image_type' => 'main',
            'sort_order' => $request->sort_order ?? 0,
        ]);

        return response()->json([
            'data' => $image,
        ], 201);
    }

    // Nếu là ảnh phụ → có thể nhận mảng files
    $request->validate([
        'images.*' => 'required|image|mimes:jpeg,png,jpg,webp|max:4096',
        'sort_order' => 'nullable|integer|min:0',
    ]);

    $uploadedImages = [];

    if ($request->hasFile('images')) {
        foreach ($request->file('images') as $index => $imageFile) {
            $path = $imageFile->store('room_type_images', 'public');

            $image = RoomTypeImage::create([
                'room_type_id' => $roomTypeId,
                'image_url' => $path,
                'image_type' => 'secondary',
                'sort_order' => $request->sort_order ?? ($index + 1),
            ]);

            $uploadedImages[] = $image;
        }
    }

    return response()->json([
        'data' => $uploadedImages,
    ], 201);
}


    /**
     * Cập nhật ảnh (Refine useUpdate)
     */
    public function update(Request $request, $roomTypeId, $imageId)
    {
        $image = RoomTypeImage::where('room_type_id', $roomTypeId)
            ->where('image_id', $imageId)
            ->firstOrFail();

        $request->validate([
            'image' => 'nullable|image|mimes:jpeg,png,jpg,webp|max:4096',
            'image_type' => 'required|in:main,secondary',
            'sort_order' => 'nullable|integer|min:0',
        ]);

        // Upload ảnh mới nếu có
        if ($request->hasFile('image')) {
            if ($image->image_url && Storage::disk('public')->exists($image->image_url)) {
                Storage::disk('public')->delete($image->image_url);
            }
            $image->image_url = $request->file('image')->store('room_type_images', 'public');
        }

        // Nếu đổi sang main → các ảnh khác thành secondary
        if ($request->image_type === 'main') {
            RoomTypeImage::where('room_type_id', $roomTypeId)
                ->where('image_id', '!=', $imageId)
                ->where('image_type', 'main')
                ->update(['image_type' => 'secondary']);
        }

        $image->image_type = $request->image_type;
        $image->sort_order = $request->sort_order ?? 0;
        $image->save();

        return response()->json([
            'data' => $image,
        ]);
    }

    /**
     * Xóa ảnh (Refine useDelete)
     */
    public function destroy($roomTypeId, $imageId)
    {
        $image = RoomTypeImage::where('room_type_id', $roomTypeId)
            ->where('image_id', $imageId)
            ->firstOrFail();

        if ($image->image_url && Storage::disk('public')->exists($image->image_url)) {
            Storage::disk('public')->delete($image->image_url);
        }

        $image->delete();

        return response()->json([
            'data' => null,
        ]);
    }

    public function destroyMainImage($roomTypeId)
{
    $roomType = RoomType::findOrFail($roomTypeId);

    if ($roomType->room_type_image && Storage::disk('public')->exists($roomType->room_type_image)) {
        Storage::disk('public')->delete($roomType->room_type_image);
        $roomType->room_type_image = null;
        $roomType->save();
    }

    return response()->json([
        'message' => 'Xóa ảnh đại diện thành công',
    ]);
}

}