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
                'message' => 'You can only leave a review after check-out.'
            ], 403);
        }

        // 2️⃣ Booking không có phòng (data lỗi)
        if ($booking->items->isEmpty()) {
            return response()->json([
                'message' => 'Booking has no rooms available for review.'
            ], 422);
        }

        // 3️⃣ Chặn review trùng (1 booking = 1 review)
        if ($booking->review()->exists()) {
            return response()->json([
                'message' => 'This booking has been reviewed.'
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
 * LẤY DANH SÁCH BOOKING CẦN ĐÁNH GIÁ
 * Frontend gọi API này khi user vào trang chủ
 */
public function getPendingReviews()
{
    $user = Auth::user();

    // Lấy tất cả booking đã checkout nhưng chưa có review
    $pendingBookings = Booking::with([
        'items.roomType:id,type_name,image', // Lấy thông tin loại phòng
    ])
        ->where('user_id', $user->user_id)
        ->where('status', Booking::STATUS_CHECK_OUT)
        ->whereDoesntHave('review') // ✅ Chưa có review
        ->orderBy('check_out', 'desc')
        ->get()
        ->map(function ($booking) {
            // Lấy room_type_id từ booking item đầu tiên
            $firstItem = $booking->items->first();
            
            return [
                'booking_id' => $booking->id,
                'check_in' => $booking->check_in,
                'check_out' => $booking->check_out,
                'room_type_id' => $firstItem?->room_type_id,
                'room_type_name' => $firstItem?->roomType?->type_name,
                'room_type_image' => $firstItem?->roomType?->image,
            ];
        });

    return response()->json([
        'data' => $pendingBookings,
        'total' => $pendingBookings->count(),
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
