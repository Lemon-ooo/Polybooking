<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Gallery;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class GalleryController extends Controller
{
    /**
     * Danh sách gallery có phân trang
     */
    public function index()
    {
        $galleries = Gallery::paginate(20);

        return response()->json([
            "success" => true,
            "data"    => $galleries->items(),
            "message" => "Gallery retrieved successfully",
            "meta"    => [
                "total" => $galleries->total(),
                "per_page" => $galleries->perPage(),
                "current_page" => $galleries->currentPage(),
                "last_page" => $galleries->lastPage(),
            ]
        ]);
    }

    /**
     * Thêm ảnh vào gallery
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'gallery_category' => 'required|string|max:100',
            'image'            => 'required|image|mimes:jpg,jpeg,png,webp|max:2048',
            'caption'          => 'nullable|string|max:255',
        ]);

        // Lưu file ảnh
        $path = $request->file('image')->store('galleries', 'public');

        $gallery = Gallery::create([
            'gallery_category' => $validated['gallery_category'],
            'image_path' => $path,
            'caption' => $validated['caption'] ?? null,
        ]);

        return response()->json([
            "success" => true,
            "data"    => $gallery,
            "message" => "Gallery item created successfully",
        ], 201);
    }

    /**
     * Lấy chi tiết 1 gallery item
     */
    public function show($id)
    {
        $gallery = Gallery::findOrFail($id);

        return response()->json([
            "success" => true,
            "data"    => $gallery,
            "message" => "Gallery item retrieved successfully",
        ]);
    }

    /**
     * Cập nhật gallery item
     */
    public function update(Request $request, $id)
    {
        $gallery = Gallery::findOrFail($id);

        $validated = $request->validate([
            'gallery_category' => 'required|string|max:100',
            'image'            => 'nullable|image|mimes:jpg,jpeg,png,webp|max:2048',
            'caption'          => 'nullable|string|max:255',
        ]);

        $data = [
            'gallery_category' => $validated['gallery_category'],
            'caption' => $validated['caption'] ?? $gallery->caption,
        ];

        // Nếu có upload ảnh mới
        if ($request->hasFile('image')) {
            if ($gallery->image_path && Storage::disk('public')->exists($gallery->image_path)) {
                Storage::disk('public')->delete($gallery->image_path);
            }

            $data['image_path'] = $request->file('image')->store('galleries', 'public');
        }

        $gallery->update($data);

        return response()->json([
            "success" => true,
            "data"    => $gallery,
            "message" => "Gallery item updated successfully",
        ]);
    }

    /**
     * Xóa gallery item
     */
    public function destroy($id)
    {
        $gallery = Gallery::findOrFail($id);

        if ($gallery->image_path && Storage::disk('public')->exists($gallery->image_path)) {
            Storage::disk('public')->delete($gallery->image_path);
        }

        $gallery->delete();

        return response()->json([
            "success" => true,
            "data"    => null,
            "message" => "Gallery item deleted successfully",
        ]);
    }
}
