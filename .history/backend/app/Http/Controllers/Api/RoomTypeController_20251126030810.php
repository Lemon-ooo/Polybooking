<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\RoomType;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class RoomTypeController extends Controller
{
    /**
     * Lấy danh sách loại phòng (Refine useTable)
     */
    public function index(Request $request)
    {
        $perPage = $request->get('per_page', 10);
        $page = $request->get('page', 1);

        $query = RoomType::with('images')->withCount('rooms');

        // Sort nếu có
        if ($request->has('sort')) {
            $sorts = $request->get('sort');
            if (is_array($sorts)) {
                foreach ($sorts as $field => $order) {
                    $query->orderBy($field, $order);
                }
            }
        }

        $roomTypes = $query->paginate($perPage, ['*'], 'page', $page);

        return response()->json([
            'data'  => $roomTypes->items(),
            'total' => $roomTypes->total(),
        ]);
    }

    /**
     * Lấy chi tiết một loại phòng
     */
    public function show($id)
    {
        $roomType = RoomType::with('images', 'amenities', 'rooms')
            ->withCount('rooms')
            ->findOrFail($id);

        return response()->json([
            'data' => $roomType,
        ]);
    }

    /**
     * Tạo mới loại phòng
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'room_type_name' => 'required|string|max:255',
            'base_price' => 'required|numeric|min:0',
            'max_guests' => 'required|integer|min:1',
            'description' => 'nullable|string',
            'room_type_image' => 'nullable|image|mimes:jpeg,png,jpg,webp|max:2048',
        ]);

        if ($request->hasFile('room_type_image')) {
            $validated['room_type_image'] = $request->file('room_type_image')->store('room_types', 'public');
        }

        $roomType = RoomType::create($validated);

        return response()->json([
            'data' => $roomType->load('images'),
        ], 201);
    }

    /**
     * Cập nhật loại phòng
     */
    public function update(Request $request, $id)
    {
        $roomType = RoomType::findOrFail($id);

        $validated = $request->validate([
            'room_type_name' => 'required|string|max:255',
            'base_price' => 'required|numeric|min:0',
            'max_guests' => 'required|integer|min:1',
            'description' => 'nullable|string',
            'room_type_image' => 'nullable|image|mimes:jpeg,png,jpg,webp|max:2048',
        ]);

        // Xóa ảnh cũ nếu có
        if ($request->hasFile('room_type_image')) {
            if ($roomType->room_type_image && Storage::disk('public')->exists($roomType->room_type_image)) {
                Storage::disk('public')->delete($roomType->room_type_image);
            }
            $validated['room_type_image'] = $request->file('room_type_image')->store('room_types', 'public');
        }

        $roomType->update($validated);

        return response()->json([
            'data' => $roomType->load('images'),
        ]);
    }

    /**
     * Xóa loại phòng
     */
    public function destroy($id)
    {
        $roomType = RoomType::findOrFail($id);

        if ($roomType->room_type_image && Storage::disk('public')->exists($roomType->room_type_image)) {
            Storage::disk('public')->delete($roomType->room_type_image);
        }

        $roomType->delete();

        return response()->json([
            'data' => null,
        ]);
    }
}