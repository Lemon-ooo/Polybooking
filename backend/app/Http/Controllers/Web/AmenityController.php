<?php

namespace App\Http\Controllers\Web;

use App\Http\Controllers\Controller; // <-- bắt buộc phải có
use App\Models\Amenity;
use Illuminate\Http\Request;

class AmenityController extends Controller
{
    /**
     * Hiển thị danh sách tiện ích
     */
    public function index()
    {
        $amenities = Amenity::latest()->paginate(10);
        return view('amenities.index', compact('amenities'));
    }

    /**
     * Hiển thị form thêm tiện ích mới
     */
    public function create()
    {
        return view('amenities.create');
    }

    /**
     * Xử lý thêm tiện ích vào database
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'category' => 'nullable|string|max:255',
            'icon_url' => 'nullable|string|max:255',
            'description' => 'nullable|string',
        ]);

        Amenity::create($validated);

        return redirect()->route('amenities.index')->with('success', 'Thêm tiện ích thành công!');
    }

    /**
     * Hiển thị form sửa tiện ích
     */
    public function edit(Amenity $amenity)
    {
        return view('amenities.edit', compact('amenity'));
    }

    /**
     * Cập nhật tiện ích trong database
     */
    public function update(Request $request, Amenity $amenity)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'category' => 'nullable|string|max:255',
            'icon_url' => 'nullable|string|max:1000',
            'description' => 'nullable|string',
        ]);

        $amenity->update($validated);

        return redirect()->route('amenities.index')->with('success', 'Cập nhật tiện ích thành công!');
    }

    /**
     * Xóa tiện ích
     */
    public function destroy(Amenity $amenity)
    {
        $amenity->delete();
        return redirect()->route('amenities.index')->with('success', 'Xóa tiện ích thành công!');
    }
}
