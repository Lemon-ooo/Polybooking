<?php

namespace App\Http\Controllers\Web;

use App\Http\Controllers\Controller;
use App\Models\RoomType;
use App\Models\RoomTypeImage;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class RoomTypeImageController extends Controller
{
    /**
     * Danh sách ảnh của một room_type.
     */
    public function index($roomTypeId)
    {
        $roomType = RoomType::findOrFail($roomTypeId);

        $images = RoomTypeImage::where('room_type_id', $roomTypeId)
            ->orderBy('image_type', 'asc')      // main trước secondary
            ->orderBy('sort_order', 'asc')
            ->get();

        return view('admin.room_type_images.index', compact('roomType', 'images'));
    }

    /**
     * Form upload ảnh mới cho room_type.
     */
    public function create($roomTypeId)
    {
        $roomType = RoomType::findOrFail($roomTypeId);

        return view('admin.room_type_images.create', compact('roomType'));
    }

    /**
     * Lưu ảnh mới.
     * - Có thể chọn main / secondary
     * - Nếu chọn main: tự động set các ảnh khác của room_type này về secondary
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

        // Nếu chọn main, chuyển các ảnh khác về secondary
        if ($validated['image_type'] === 'main') {
            RoomTypeImage::where('room_type_id', $roomTypeId)
                ->where('image_type', 'main')
                ->update(['image_type' => 'secondary']);
        }

        RoomTypeImage::create([
            'room_type_id' => $roomTypeId,
            'image_url'    => $path,
            'image_type'   => $validated['image_type'],
            'sort_order'   => $validated['sort_order'] ?? 0,
        ]);

        return redirect()
            ->route('admin.room-types.images.index', $roomTypeId)
            ->with('success', 'Thêm ảnh cho loại phòng thành công.');
    }

    /**
     * Form sửa thông tin 1 ảnh (đổi main/secondary, sort_order, thay ảnh).
     */
    public function edit($roomTypeId, $imageId)
    {
        $roomType = RoomType::findOrFail($roomTypeId);

        $image = RoomTypeImage::where('room_type_id', $roomTypeId)
            ->where('image_id', $imageId)
            ->firstOrFail();

        return view('admin.room_type_images.edit', compact('roomType', 'image'));
    }

    /**
     * Cập nhật ảnh:
     * - Có thể thay file
     * - Có thể đổi main/secondary
     * - Nếu set main -> các ảnh khác của room_type thành secondary
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

        // Nếu upload ảnh mới → xóa file cũ
        if ($request->hasFile('image')) {
            if ($image->image_url && Storage::disk('public')->exists($image->image_url)) {
                Storage::disk('public')->delete($image->image_url);
            }

            $path = $request->file('image')->store('room_type_images', 'public');
            $image->image_url = $path;
        }

        // Nếu đổi sang main → các ảnh khác phải thành secondary
        if ($validated['image_type'] === 'main') {
            RoomTypeImage::where('room_type_id', $roomTypeId)
                ->where('image_id', '!=', $imageId)
                ->where('image_type', 'main')
                ->update(['image_type' => 'secondary']);
        }

        $image->image_type = $validated['image_type'];
        $image->sort_order = $validated['sort_order'] ?? 0;
        $image->save();

        return redirect()
            ->route('admin.room-types.images.index', $roomTypeId)
            ->with('success', 'Cập nhật ảnh thành công.');
    }

    /**
     * Xóa một ảnh.
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

        return redirect()
            ->route('admin.room-types.images.index', $roomTypeId)
            ->with('success', 'Xóa ảnh thành công.');
    }
}
