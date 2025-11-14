<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Gallery;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class GalleryController extends Controller
{
    // Lấy danh sách gallery
    public function index()
    {
        $galleries = Gallery::orderBy('created_at', 'desc')->get();

        return response()->json([
            'success' => true,
            'data' => $galleries->map(function ($item) {
                return [
                    'id' => $item->getKey(), // trả đúng primary key
                    'gallery_category' => $item->gallery_category,
                    'caption' => $item->caption,
                    'image_path' => $item->image_path,
                    'image_url' => asset('storage/' . $item->image_path),
                    'created_at' => $item->created_at,
                    'updated_at' => $item->updated_at,
                ];
            }),
            'message' => 'Gallery retrieved successfully',
            'meta' => [
                'total' => $galleries->count(),
            ],
        ]);
    }

    // Thêm ảnh mới
    public function store(Request $request)
    {
        $validated = $request->validate([
            'gallery_category' => 'required|string|max:100',
            'image' => 'required|image|mimes:jpg,jpeg,png,webp|max:2048',
            'caption' => 'nullable|string|max:255',
        ]);

        $path = $request->file('image')->store('galleries', 'public');

        $gallery = Gallery::create([
            'gallery_category' => $validated['gallery_category'],
            'image_path' => $path,
            'caption' => $validated['caption'] ?? null,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Image uploaded successfully!',
            'data' => [
                'id' => $gallery->getKey(), // trả đúng primary key
                'gallery_category' => $gallery->gallery_category,
                'caption' => $gallery->caption,
                'image_path' => $gallery->image_path,
                'image_url' => asset('storage/' . $gallery->image_path),
            ]
        ]);
    }

    // Xóa ảnh
    public function destroy(Gallery $gallery)
    {
        if ($gallery->image_path) {
            Storage::disk('public')->delete($gallery->image_path);
        }

        $gallery->delete();

        return response()->json([
            'success' => true,
            'message' => 'Image deleted successfully!'
        ]);
    }
}
