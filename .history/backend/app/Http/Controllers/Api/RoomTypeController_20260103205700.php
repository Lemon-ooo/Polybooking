<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\RoomType;
use App\Models\Amenity;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class RoomTypeController extends Controller
{
    /*
    |--------------------------------------------------------------------------
    | GET /api/admin/room-types
    | Danh sách loại phòng (pagination)
    |--------------------------------------------------------------------------
    */
    public function index(Request $request)
    {
        $roomTypes = RoomType::withCount('rooms')
            ->paginate($request->get('per_page', 10));

        return response()->json([
            'success' => true,
            'data'    => $roomTypes
        ]);
    }

    /*
    |--------------------------------------------------------------------------
    | GET /api/admin/room-types/create
    | Lấy dữ liệu cần để tạo (amenities)
    |--------------------------------------------------------------------------
    */
    public function create()
    {
        return response()->json([
            'success'   => true,
            'amenities' => Amenity::all()
        ]);
    }

    /*
    |--------------------------------------------------------------------------
    | POST /api/admin/room-types
    | Tạo loại phòng mới
    |--------------------------------------------------------------------------
    */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'room_type_name'  => 'required|string|max:255',
            'base_price'      => 'required|numeric|min:0',
            'max_guests'      => 'required|integer|min:1',
            'description'     => 'nullable|string',
            'room_type_image' => 'nullable|image|mimes:jpeg,png,jpg,webp|max:2048',
            'amenity_ids'     => 'nullable|array',
            'amenity_ids.*'   => 'exists:amenities,amenity_id',
        ]);

        // Upload ảnh
        if ($request->hasFile('room_type_image')) {
            $validated['room_type_image'] =
                $request->file('room_type_image')->store('room_types', 'public');
        }

        $roomType = RoomType::create($validated);

        if (!empty($validated['amenity_ids'] ?? null)) {
            $roomType->amenities()->sync($validated['amenity_ids']);
        }

        return response()->json([
            'success' => true,
            'message' => 'Tạo loại phòng thành công',
            'data'    => $roomType
        ], 201);
    }

    /*
    |--------------------------------------------------------------------------
    | GET /api/admin/room-types/{id}
    | Chi tiết loại phòng
    |--------------------------------------------------------------------------
    */
    public function show($id)
    {
        $roomType = RoomType::with(['rooms', 'amenities', 'images'])
            ->withCount('rooms')
            ->findOrFail($id);
return response()->json([
            'success' => true,
            'data'    => $roomType
        ]);
    }

    /*
    |--------------------------------------------------------------------------
    | GET /api/admin/room-types/{id}/edit
    | Lấy dữ liệu để edit
    |--------------------------------------------------------------------------
    */
    public function edit($id)
    {
        return response()->json([
            'success'   => true,
            'roomType'  => RoomType::with('amenities')->findOrFail($id),
            'amenities' => Amenity::all()
        ]);
    }

    /*
    |--------------------------------------------------------------------------
    | PUT /api/admin/room-types/{id}
    | Cập nhật loại phòng
    |--------------------------------------------------------------------------
    */
    public function update(Request $request, $id)
    {
        $roomType = RoomType::findOrFail($id);

        $validated = $request->validate([
            'room_type_name'  => 'required|string|max:255',
            'base_price'      => 'required|numeric|min:0',
            'max_guests'      => 'required|integer|min:1',
            'description'     => 'nullable|string',
            'room_type_image' => 'nullable|image|mimes:jpeg,png,jpg,webp|max:2048',
            'amenity_ids'     => 'nullable|array',
            'amenity_ids.*'   => 'exists:amenities,amenity_id',
        ]);

        if ($request->hasFile('room_type_image')) {
            if (
                $roomType->room_type_image &&
                Storage::disk('public')->exists($roomType->room_type_image)
            ) {
                Storage::disk('public')->delete($roomType->room_type_image);
            }

            $validated['room_type_image'] =
                $request->file('room_type_image')->store('room_types', 'public');
        }

        $roomType->update($validated);
        $roomType->amenities()->sync($validated['amenity_ids'] ?? []);

        return response()->json([
            'success' => true,
            'message' => 'Cập nhật loại phòng thành công',
            'data'    => $roomType
        ]);
    }

    /*
    |--------------------------------------------------------------------------
    | DELETE /api/admin/room-types/{id}
    | Xóa loại phòng
    |--------------------------------------------------------------------------
    */
    public function destroy($id)
    {
        $roomType = RoomType::findOrFail($id);

        if (
            $roomType->room_type_image &&
            Storage::disk('public')->exists($roomType->room_type_image)
        ) {
            Storage::disk('public')->delete($roomType->room_type_image);
        }

        $roomType->delete();

        return response()->json([
            'success' => true,
            'message' => 'Xóa loại phòng thành công'
        ]);
    }
}