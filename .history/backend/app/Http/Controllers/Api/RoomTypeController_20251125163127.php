<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\RoomType;
use App\Models\Amenity;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class RoomTypeController extends Controller
{
    /**
     * Danh sách loại phòng (API)
     */
    public function index()
    {
        $roomTypes = RoomType::withCount('rooms')->paginate(10);

        return response()->json([
            "success" => true,
            "data"    => $roomTypes->items(),
            "message" => "Room types retrieved successfully",
            "meta"    => [
                "total" => $roomTypes->total(),
                "per_page" => $roomTypes->perPage(),
                "current_page" => $roomTypes->currentPage(),
                "last_page" => $roomTypes->lastPage(),
            ]
        ]);
    }

    /**
     * Tạo loại phòng mới
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'room_type_name' => 'required|string|max:255',
            'base_price'     => 'required|numeric|min:0',
            'max_guests'     => 'required|integer|min:1',
            'description'    => 'nullable|string',
            'room_type_image'=> 'nullable|image|mimes:jpeg,png,jpg,webp|max:2048',
            'amenity_ids'    => 'nullable|array',
            'amenity_ids.*'  => 'exists:amenities,amenity_id',
        ]);

        // Upload ảnh
        if ($request->hasFile('room_type_image')) {
            $path = $request->file('room_type_image')->store('room_types', 'public');
            $validated['room_type_image'] = $path;
        }

        // Tạo RoomType
        $roomType = RoomType::create($validated);

        // Gán tiện ích
        if (!empty($validated['amenity_ids'])) {
            $roomType->amenities()->sync($validated['amenity_ids']);
        }

        return response()->json([
            "success" => true,
            "data"    => $roomType->load(['amenities']),
            "message" => "Room type created successfully",
        ], 201);
    }

    /**
     * Chi tiết loại phòng
     */
    public function show($id)
    {
        $roomType = RoomType::with(['rooms', 'amenities', 'images'])
            ->withCount('rooms')
            ->findOrFail($id);

        return response()->json([
            "success" => true,
            "data"    => $roomType,
            "message" => "Room type retrieved successfully",
        ]);
    }

    /**
     * Cập nhật loại phòng
     */
    public function update(Request $request, $id)
    {
        $roomType = RoomType::findOrFail($id);

        $validated = $request->validate([
            'room_type_name' => 'required|string|max:255',
            'base_price'     => 'required|numeric|min:0',
            'max_guests'     => 'required|integer|min:1',
            'description'    => 'nullable|string',
            'room_type_image'=> 'nullable|image|mimes:jpeg,png,jpg,webp|max:2048',
            'amenity_ids'    => 'nullable|array',
            'amenity_ids.*'  => 'exists:amenities,amenity_id',
        ]);

        // Nếu có ảnh mới -> xóa ảnh cũ
        if ($request->hasFile('room_type_image')) {
            if ($roomType->room_type_image && Storage::disk('public')->exists($roomType->room_type_image)) {
                Storage::disk('public')->delete($roomType->room_type_image);
            }

            $path = $request->file('room_type_image')->store('room_types', 'public');
            $validated['room_type_image'] = $path;
        }

        // Cập nhật
        $roomType->update($validated);

        // Update tiện ích
        $roomType->amenities()->sync($validated['amenity_ids'] ?? []);

        return response()->json([
            "success" => true,
            "data"    => $roomType->load(['amenities']),
            "message" => "Room type updated successfully",
        ]);
    }

    /**
     * Xóa loại phòng
     */
    public function destroy($id)
    {
        $roomType = RoomType::findOrFail($id);

        // Xóa ảnh
        if ($roomType->room_type_image && Storage::disk('public')->exists($roomType->room_type_image)) {
            Storage::disk('public')->delete($roomType->room_type_image);
        }

        $roomType->delete();

        return response()->json([
            "success" => true,
            "data"    => null,
            "message" => "Room type deleted successfully",
        ]);
    }
}
