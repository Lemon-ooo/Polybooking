<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\RoomType;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class RoomTypeController extends Controller
{
    /**
     * Danh sách loại phòng
     */
    public function index(Request $request)
    {
        $perPage = $request->get('per_page', 10);
        $page    = $request->get('page', 1);

        $query = RoomType::with(['images', 'amenities'])
            ->withCount('rooms')
            ->withCount([
                // 🔢 Tổng review (chỉ review hiển thị)
                'reviews as total_reviews' => function ($q) {
                    $q->where('is_hidden', 0);
                }
            ])
            ->withAvg([
                // ⭐ Rating trung bình
                'reviews as avg_rating' => function ($q) {
                    $q->where('is_hidden', 0);
                }
            ], 'rating');

        // Sort (Refine)
        if ($request->has('sort')) {
            foreach ((array) $request->get('sort') as $field => $order) {
                $query->orderBy($field, $order);
            }
        }

        $roomTypes = $query->paginate($perPage, ['*'], 'page', $page);

        // 🎯 Format lại data cho UI
        $data = collect($roomTypes->items())->map(function ($roomType) {
            return [
                ...$roomType->toArray(),
                'avg_rating' => $roomType->avg_rating
                    ? round($roomType->avg_rating, 1)
                    : 0,
                'total_reviews' => $roomType->total_reviews,
            ];
        });

        return response()->json([
            'data'  => $data,
            'total' => $roomTypes->total(),
        ]);
    }

    /**
     * ⭐ Lấy rating riêng cho 1 phòng (trang chi tiết)
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
            'avg_rating'    => $roomType->avg_rating
                ? round($roomType->avg_rating, 1)
                : 0,
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

            // ⭐ Load reviews + user
            'reviews' => function ($q) {
                $q->where('is_hidden', 0)
                    ->orderBy('created_at', 'desc');
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
            'avg_rating' => $roomType->avg_rating
                ? round($roomType->avg_rating, 1)
                : 0,
            'total_reviews' => $roomType->total_reviews,
        ]
    ]);
}


    // ⚠️ Các hàm store / update / destroy giữ nguyên như bạn đang có
}