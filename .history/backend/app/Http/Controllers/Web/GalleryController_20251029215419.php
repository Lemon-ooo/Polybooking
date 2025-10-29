<?php

namespace App\Http\Controllers\Web;

use App\Http\Controllers\Controller;
use App\Models\Gallery;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class GalleryController extends Controller
{
    public function index()
{
    $galleries = \App\Models\Gallery::orderBy('created_at', 'desc')->get()
        ->groupBy('gallery_category'); // Nhóm theo category

    return view('galleries.index', compact('galleries'));
}

    public function create()
    {
        return view('galleries.create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'gallery_category' => 'required|string|max:100',
            'image' => 'required|image|mimes:jpg,jpeg,png,webp|max:2048',
            'caption' => 'nullable|string|max:255',
        ]);

        $path = $request->file('image')->store('galleries', 'public');

        Gallery::create([
            'gallery_category' => $validated['gallery_category'],
            'image_path' => $path,
            'caption' => $validated['caption'] ?? null,
        ]);

        return redirect()->route('galleries.index')->with('success', 'Thêm ảnh thành công!');
    }

    public function destroy(Gallery $gallery)
    {
        if ($gallery->image_path) {
            Storage::disk('public')->delete($gallery->image_path);
        }
        $gallery->delete();
        return back()->with('success', 'Xóa ảnh thành công!');
    }
}
