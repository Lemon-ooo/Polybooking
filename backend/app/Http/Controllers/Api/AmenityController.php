<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Amenity;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class AmenityController extends Controller
{
    /**
     * 🟢 Lấy danh sách tiện ích
     */
    public function index(): JsonResponse
    {
        $amenities = Amenity::latest()->get();

        // Tạo icon_url để FE load ảnh
        $amenities->each(function ($item) {
            $item->icon_url = $item->icon_path ? asset($item->icon_path) : null;
        });

        return response()->json([
            'success' => true,
            'message' => 'Danh sách tiện ích',
            'data' => $amenities
        ]);
    }

    /**
     * 🟢 Lấy chi tiết tiện ích
     */
    public function show($id): JsonResponse
    {
        $amenity = Amenity::find($id);

        if (!$amenity) {
            return response()->json([
                'success' => false,
                'message' => 'Không tìm thấy tiện ích',
            ], 404);
        }

        $amenity->icon_url = $amenity->icon_path ? asset($amenity->icon_path) : null;

        return response()->json([
            'success' => true,
            'message' => 'Chi tiết tiện ích',
            'data' => $amenity
        ]);
    }

    /**
     * 🟢 Tạo mới tiện ích (upload ảnh icon)
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'category' => 'nullable|string|max:255',
            'icon' => 'nullable|image|mimes:jpeg,png,jpg,webp,gif|max:2048',
            'description' => 'nullable|string',
        ]);

        $data = $request->only(['name', 'category', 'description']);

        // Upload icon
        if ($request->hasFile('icon')) {
            $path = $request->file('icon')->store('amenities', 'public_uploads');
            $data['icon_path'] = $path;
        }

        $amenity = Amenity::create($data);
        $amenity->icon_url = $amenity->icon_path ? asset($amenity->icon_path) : null;

        return response()->json([
            'success' => true,
            'message' => 'Thêm tiện ích thành công!',
            'data' => $amenity
        ], 201);
    }

    /**
     * 🟢 Cập nhật tiện ích
     */
    public function update(Request $request, $id): JsonResponse
    {
        $amenity = Amenity::find($id);

        if (!$amenity) {
            return response()->json([
                'success' => false,
                'message' => 'Không tìm thấy tiện ích',
            ], 404);
        }

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'category' => 'nullable|string|max:255',
            'icon' => 'nullable|image|mimes:jpeg,png,jpg,webp,gif|max:2048',
            'description' => 'nullable|string',
        ]);

        $data = $request->only(['name', 'category', 'description']);

        // Upload icon mới nếu có
        if ($request->hasFile('icon')) {

            // Xóa ảnh cũ
            if ($amenity->icon_path && file_exists(public_path($amenity->icon_path))) {
                unlink(public_path($amenity->icon_path));
            }

            $path = $request->file('icon')->store('amenities', 'public_uploads');
            $data['icon_path'] = $path;
        }

        $amenity->update($data);

        $amenity->icon_url = $amenity->icon_path ? asset($amenity->icon_path) : null;

        return response()->json([
            'success' => true,
            'message' => 'Cập nhật tiện ích thành công!',
            'data' => $amenity
        ]);
    }

    /**
     * 🟢 Xóa tiện ích
     */
    public function destroy($id): JsonResponse
    {
        $amenity = Amenity::find($id);

        if (!$amenity) {
            return response()->json([
                'success' => false,
                'message' => 'Không tìm thấy tiện ích',
            ], 404);
        }

        // Xóa ảnh trên server
        if ($amenity->icon_path && file_exists(public_path($amenity->icon_path))) {
            unlink(public_path($amenity->icon_path));
        }

        $amenity->delete();

        return response()->json([
            'success' => true,
            'message' => 'Xóa tiện ích thành công!'
        ]);
    }
}
