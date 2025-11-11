<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Amenity;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class AmenityController extends Controller
{
    /**
     * 🟢 Lấy danh sách tất cả tiện ích (JSON)
     */
    public function index(): JsonResponse
    {
        $amenities = Amenity::latest()->get();

        return response()->json([
            'success' => true,
            'message' => 'Danh sách tiện ích',
            'data' => $amenities
        ]);
    }

    /**
     * 🟢 Lấy chi tiết 1 tiện ích
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

        return response()->json([
            'success' => true,
            'message' => 'Chi tiết tiện ích',
            'data' => $amenity
        ]);
    }

    /**
     * 🟢 Tạo mới tiện ích
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'category' => 'nullable|string|max:255',
            'icon_url' => 'nullable|string|max:255',
            'description' => 'nullable|string',
        ]);

        $amenity = Amenity::create($validated);

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
            'icon_url' => 'nullable|string|max:255',
            'description' => 'nullable|string',
        ]);

        $amenity->update($validated);

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

        $amenity->delete();

        return response()->json([
            'success' => true,
            'message' => 'Xóa tiện ích thành công!'
        ]);
    }
}
