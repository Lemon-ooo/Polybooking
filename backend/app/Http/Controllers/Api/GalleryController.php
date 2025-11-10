<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Gallery;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class GalleryController extends Controller
{
    // Lấy danh sách gallery, nhóm theo category
    public function index()
    {
        $galleries = Gallery::orderBy('created_at', 'desc')->get()
            ->groupBy('gallery_category');

        return response()->json([
            'status' => 'success',
            'data' => $galleries
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
            'status' => 'success',
            'message' => 'Thêm ảnh thành công!',
            'data' => $gallery
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
            'status' => 'success',
            'message' => 'Xóa ảnh thành công!'
        ]);
    }
}
