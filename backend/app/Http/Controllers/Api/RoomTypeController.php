<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\RoomType;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class RoomTypeController extends Controller
{
    /**
     * Danh sách loại phòng (kèm rating & pagination)
     */
    public function index(Request $request)
    {
        $perPage = $request->get('per_page', 10);
        $page    = $request->get('page', 1);

        $query = RoomType::with(['images', 'amenities'])
            ->withCount('rooms')
            ->withCount([
                'reviews as total_reviews' => function ($q) {
                    $q->where('is_hidden', 0);
                }
            ])
            ->withAvg([
                'reviews as avg_rating' => function ($q) {
                    $q->where('is_hidden', 0);
                }
            ], 'rating');

        if ($request->has('sort')) {
            foreach ((array) $request->get('sort') as $field => $order) {
                $query->orderBy($field, $order);
            }
        }

        $roomTypes = $query->paginate($perPage, ['*'], 'page', $page);

        $data = collect($roomTypes->items())->map(function ($roomType) {
            return [
                ...$roomType->toArray(),
                'avg_rating' => $roomType->avg_rating ? round($roomType->avg_rating, 1) : 0,
                'total_reviews' => $roomType->total_reviews,
            ];
        });

        return response()->json([
            'data'  => $data,
            'total' => $roomTypes->total(),
        ]);
    }

    /**
     * Lấy rating của 1 room_type
     */
    public function rating($id)
    {
        $roomType = RoomType::withCount([
                'reviews as total_reviews' => function ($q) {
                    $q->where('is_hidden', 0);
                }
            ])
            ->withAvg([
                'reviews as avg_rating' => function ($q) {
                    $q->where('is_hidden', 0);
                }
            ], 'rating')
            ->findOrFail($id);

        return response()->json([
            'avg_rating'    => $roomType->avg_rating ? round($roomType->avg_rating, 1) : 0,
            'total_reviews' => $roomType->total_reviews,
        ]);
    }

    /**
     * Chi tiết 1 loại phòng
     */
    public function show($id)
    {
        $roomType = RoomType::with([
                'images',
                'amenities',
                'rooms',
                'reviews' => function ($q) {
                    $q->where('is_hidden', 0)->orderBy('created_at', 'desc');
                },
                'reviews.user'
            ])
            ->withCount('rooms')
            ->withCount([
                'reviews as total_reviews' => function ($q) {
                    $q->where('is_hidden', 0);
                }
            ])
            ->withAvg([
                'reviews as avg_rating' => function ($q) {
                    $q->where('is_hidden', 0);
                }
            ], 'rating')
            ->findOrFail($id);

        return response()->json([
            'data' => [
                ...$roomType->toArray(),
                'avg_rating' => $roomType->avg_rating ? round($roomType->avg_rating, 1) : 0,
                'total_reviews' => $roomType->total_reviews,
            ]
        ]);
    }

    /**
     * Thêm Room Type
     */
    public function store(Request $request)
    {
        $roomType = RoomType::create($request->only([
            'room_type_name',
            'description',
            'base_price',
            'max_guests'
        ]));

        return response()->json([
            'success' => true,
            'message' => 'Created successfully',
            'data' => $roomType
        ]);
    }

    /**
     * Cập nhật Room Type
     */
public function update(Request $request, $id)
{
    $roomType = RoomType::findOrFail($id);

    // update fields
    $roomType->room_type_name = $request->room_type_name;
    $roomType->base_price = $request->base_price;
    $roomType->max_guests = $request->max_guests;
    $roomType->description = $request->description;

    // update main image
    if ($request->hasFile('room_type_image')) {
        $file = $request->file('room_type_image');
        $path = $file->store('room_types', 'public');
        $roomType->room_type_image = $path;
    }

    $roomType->save();

    // amenities
    if ($request->has('amenity_ids')) {
        $roomType->amenities()->sync($request->amenity_ids);
    }

    return response()->json([
        'success' => true,
        'message' => 'Updated successfully',
        'data' => $roomType
    ]);
}
public function store(Request $request)
    {
        $validated = $request->validate([
            'room_type_name'  => 'required|string|max:255',
            'base_price'      => 'required|numeric|min:0',
            'max_guests'      => 'required|integer|min:1',
            'description'     => 'nullable|string',
            'room_type_image' => 'nullable|image|mimes:jpeg,png,jpg,webp|max:2048',

            // ✅ TIỆN ÍCH
            'amenity_ids'     => 'nullable|array',
            'amenity_ids.*'   => 'exists:amenities,amenity_id',
        ]);

<<<<<<< HEAD
        // Upload ảnh
        if ($request->hasFile('room_type_image')) {
            $validated['room_type_image'] =
                $request->file('room_type_image')->store('room_types', 'public');
        }

        $roomType = RoomType::create($validated);

        // ✅ Gán tiện ích
        if (!empty($validated['amenity_ids'] ?? null)) {
            $roomType->amenities()->sync($validated['amenity_ids']);
        }

        return response()->json([
            'data' => $roomType->load(['images', 'amenities']),
        ], 201);
    }
    public function update(Request $request, $id)
    {
        $roomType = RoomType::findOrFail($id);

        $validated = $request->validate([
            'room_type_name'  => 'required|string|max:255',
            'base_price'      => 'required|numeric|min:0',
            'max_guests'      => 'required|integer|min:1',
            'description'     => 'nullable|string',
            'room_type_image' => 'nullable|image|mimes:jpeg,png,jpg,webp|max:2048',

            // ✅ TIỆN ÍCH
            'amenity_ids'     => 'nullable|array',
            'amenity_ids.*'   => 'exists:amenities,amenity_id',
        ]);

        // Xử lý ảnh
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

        // ✅ Update tiện ích
        $roomType->amenities()->sync($validated['amenity_ids'] ?? []);

        return response()->json([
            'data' => $roomType->load(['images', 'amenities']),
        ]);
    }
    public function destroy($id)
    {
        $roomType = RoomType::findOrFail($id);

        if (
            $roomType->room_type_image &&
            Storage::disk('public')->exists($roomType->room_type_image)
        ) {
            Storage::disk('public')->delete($roomType->room_type_image);
=======
    /**
     * Xoá Room Type
     */
    public function destroy($id)
    {
        $roomType = RoomType::find($id);

        if (!$roomType) {
            return response()->json([
                'success' => false,
                'message' => 'Room type not found'
            ], 404);
>>>>>>> lamtangthanh
        }

        $roomType->delete();

        return response()->json([
<<<<<<< HEAD
            'data' => null,
=======
            'success' => true,
            'message' => 'Deleted successfully'
>>>>>>> lamtangthanh
        ]);
    }
}