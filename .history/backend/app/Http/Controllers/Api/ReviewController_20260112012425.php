<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Review;
use App\Models\Booking;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ReviewController extends Controller
{
    /**
     * LIST – Refine useList
     */
    public function index(Request $request)
{
    $query = Review::with([
        'user:user_id,user_name,avatar',
        'booking:id,check_in,check_out'
    ]);

    // ⭐ FILTER THEO PHÒNG
    if ($request->filled('room_type_id')) {
        $query->where('room_type_id', $request->room_type_id);
    }

    // 🔢 SORT (Refine)
    $sort  = $request->get('_sort', 'id');
    $order = $request->get('_order', 'desc');
    $query->orderBy($sort, $order);

    // 🔢 PAGINATION (Refine)
    $start = (int) $request->get('_start', 0);
    $end   = (int) $request->get('_end', 10);
    $limit = $end - $start;

    $total = $query->count();

    $data = $query
        ->skip($start)
        ->take($limit)
        ->get();

    return response()->json([
        'data'  => $data,
        'total'=> $total
    ]);
}


    /**
     * SHOW – Refine useShow
     */
    public function show($id)
    {
        $review = Review::with([
            'user:user_id,user_name,avatar',
            'booking'
        ])->findOrFail($id);

        return response()->json([
            'data' => $review,
        ]);
    }

    /**
     * CREATE – User tạo review sau check-out
     */
    public function store(Request $request)
    {
        $user = Auth::user();

        $data = $request->validate([
            'booking_id' => 'required|exists:bookings,id',
            'rating'     => 'required|integer|min:1|max:5',
            'comment'    => 'nullable|string',
        ]);

        // 1️⃣ Lấy booking + items
        $booking = Booking::with('items')
            ->where('id', $data['booking_id'])
            ->where('user_id', $user->user_id) // ✅ đúng PK
            ->where('status', Booking::STATUS_CHECK_OUT) // ✅ check_out
            ->first();

        if (!$booking) {
            return response()->json([
                'message' => 'Bạn chỉ có thể đánh giá sau khi check-out'
            ], 403);
        }

        // 2️⃣ Booking không có phòng (data lỗi)
        if ($booking->items->isEmpty()) {
            return response()->json([
                'message' => 'Booking không có phòng để đánh giá'
            ], 422);
        }

        // 3️⃣ Chặn review trùng (1 booking = 1 review)
        if ($booking->review()->exists()) {
            return response()->json([
                'message' => 'Booking này đã được đánh giá'
            ], 409);
        }

        // 👉 Lấy room_type_id từ booking_items
        $roomTypeId = $booking->items->first()->room_type_id;

        // 4️⃣ Tạo review
        $review = Review::create([
            'user_id'      => $user->user_id,
            'booking_id'   => $booking->id,
            'room_type_id' => $roomTypeId,
            'rating'       => $data['rating'],
            'comment'      => $data['comment'],
        ]);

        return response()->json([
            'data' => $review
        ], 201);
    }

    /**
     * UPDATE – Refine useUpdate
     */
    public function update(Request $request, $id)
    {
        $review = Review::findOrFail($id);

        $data = $request->validate([
            'rating'  => 'required|integer|min:1|max:5',
            'comment' => 'nullable|string|max:1000',
        ]);

        $review->update($data);

        return response()->json([
            'data' => $review,
        ]);
    }

    /**
     * DELETE – Refine useDelete
     */
    public function destroy($id)
    {
        $review = Review::findOrFail($id);
        $review->delete();

        return response()->json([
            'data' => true,
        ]);
    }
}
