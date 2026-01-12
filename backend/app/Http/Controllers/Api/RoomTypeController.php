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
        }

        $roomType->delete();

        return response()->json([
            'success' => true,
            'message' => 'Deleted successfully'
        ]);
    }
}