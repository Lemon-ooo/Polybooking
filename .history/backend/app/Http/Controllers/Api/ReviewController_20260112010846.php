<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Review;
use App\Models\Booking;
use App\Models\RoomType;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;

class ReviewController extends Controller
{
    /**
     * LIST – Refine useList
     */
    public function index(Request $request)
    {
        $query = Review::with([
            'user:user_id,user_name,avatar',
            'booking:id,check_in,check_out',
            'roomType:id,name,slug,hotel_id',
            'roomType.hotel:id,name,address'
        ]);

        // ⭐ FILTER THEO PHÒNG
        if ($request->filled('room_type_id')) {
            $query->where('room_type_id', $request->room_type_id);
        }

        // ⭐ FILTER THEO USER
        if ($request->filled('user_id')) {
            $query->where('user_id', $request->user_id);
        }

        // ⭐ FILTER THEO RATING
        if ($request->filled('rating')) {
            $query->where('rating', $request->rating);
        }

        // 🔢 SORT (Refine)
        $sort  = $request->get('_sort', 'created_at');
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
            ->get()
            ->map(function ($review) {
                return [
                    'id' => $review->id,
                    'rating' => $review->rating,
                    'comment' => $review->comment,
                    'created_at' => $review->created_at->format('d/m/Y H:i'),
                    'user' => $review->user ? [
                        'id' => $review->user->user_id,
                        'name' => $review->user->user_name,
                        'avatar' => $review->user->avatar
                    ] : null,
                    'booking' => $review->booking ? [
                        'check_in' => $review->booking->check_in,
                        'check_out' => $review->booking->check_out
                    ] : null,
                    'room_type' => $review->roomType ? [
                        'id' => $review->roomType->id,
                        'name' => $review->roomType->name,
                        'hotel' => $review->roomType->hotel ? [
                            'name' => $review->roomType->hotel->name,
                            'address' => $review->roomType->hotel->address
                        ] : null
                    ] : null
                ];
            });

        return response()->json([
            'data'  => $data,
            'total' => $total
        ]);
    }

    /**
     * SHOW – Refine useShow
     */
    public function show($id)
    {
        $review = Review::with([
            'user:user_id,user_name,avatar',
            'booking',
            'roomType:id,name,slug,hotel_id',
            'roomType.hotel:id,name,address'
        ])->findOrFail($id);

        $formattedReview = [
            'id' => $review->id,
            'rating' => $review->rating,
            'comment' => $review->comment,
            'created_at' => $review->created_at->format('d/m/Y H:i'),
            'updated_at' => $review->updated_at->format('d/m/Y H:i'),
            'user' => $review->user ? [
                'id' => $review->user->user_id,
                'name' => $review->user->user_name,
                'avatar' => $review->user->avatar
            ] : null,
            'booking' => $review->booking,
            'room_type' => $review->roomType ? [
                'id' => $review->roomType->id,
                'name' => $review->roomType->name,
                'hotel' => $review->roomType->hotel ? [
                    'name' => $review->roomType->hotel->name,
                    'address' => $review->roomType->hotel->address
                ] : null
            ] : null
        ];

        return response()->json([
            'data' => $formattedReview,
        ]);
    }

    /**
     * GET USER'S REVIEWABLE BOOKINGS – Lấy danh sách booking có thể đánh giá
     */
    public function getReviewableBookings(Request $request)
    {
        $user = Auth::user();

        // Lấy tất cả booking đã check-out của user
        $bookings = Booking::with(['items.roomType.hotel', 'review'])
            ->where('user_id', $user->user_id)
            ->where('status', Booking::STATUS_CHECK_OUT)
            ->orderBy('check_out', 'desc')
            ->get();

        $reviewableBookings = [];

        foreach ($bookings as $booking) {
            // Kiểm tra điều kiện để đánh giá
            $canReview = $booking->items->isNotEmpty() && !$booking->review;

            // Kiểm tra thời gian đánh giá (30 ngày)
            $daysAfterCheckout = now()->diffInDays($booking->check_out);
            $withinTimeLimit = $daysAfterCheckout <= 30;

            if ($canReview && $withinTimeLimit) {
                $firstItem = $booking->items->first();
                $roomType = $firstItem->roomType;
                $hotel = $roomType->hotel ?? null;

                $reviewableBookings[] = [
                    'booking_id' => $booking->id,
                    'booking_code' => $booking->booking_code,
                    'check_in' => $booking->check_in->format('d/m/Y'),
                    'check_out' => $booking->check_out->format('d/m/Y'),
                    'room_type' => $roomType->name ?? 'Không xác định',
                    'room_type_id' => $roomType->id ?? null,
                    'hotel' => $hotel ? [
                        'name' => $hotel->name,
                        'address' => $hotel->address
                    ] : null,
                    'days_since_checkout' => $daysAfterCheckout,
                    'can_review' => true
                ];
            }
        }

        return response()->json([
            'data' => $reviewableBookings,
            'total' => count($reviewableBookings)
        ]);
    }

    /**
     * CHECK REVIEWABLE – Kiểm tra booking có thể đánh giá không
     */
    public function checkReviewable($bookingId)
    {
        $user = Auth::user();

        // Lấy thông tin booking
        $booking = Booking::with(['items.roomType.hotel', 'review'])
            ->where('id', $bookingId)
            ->where('user_id', $user->user_id)
            ->first();

        if (!$booking) {
            return response()->json([
                'reviewable' => false,
                'message' => 'Booking không tồn tại hoặc không thuộc về bạn'
            ], 404);
        }

        // Kiểm tra các điều kiện để có thể đánh giá
        $canReview = true;
        $messages = [];

        // 1️⃣ Kiểm tra trạng thái booking
        if ($booking->status !== Booking::STATUS_CHECK_OUT) {
            $canReview = false;
            $messages[] = 'Chỉ có thể đánh giá sau khi check-out';
        }

        // 2️⃣ Kiểm tra booking có phòng không
        if ($booking->items->isEmpty()) {
            $canReview = false;
            $messages[] = 'Booking không có phòng để đánh giá';
        }

        // 3️⃣ Kiểm tra đã đánh giá chưa
        if ($booking->review) {
            $canReview = false;
            $messages[] = 'Booking này đã được đánh giá';
            
            $firstItem = $booking->items->first();
            $roomType = $firstItem->roomType ?? null;
            $hotel = $roomType->hotel ?? null;

            return response()->json([
                'reviewable' => false,
                'message' => implode(', ', $messages),
                'existing_review' => [
                    'id' => $booking->review->id,
                    'rating' => $booking->review->rating,
                    'comment' => $booking->review->comment,
                    'created_at' => $booking->review->created_at->format('d/m/Y H:i'),
                ],
                'booking_info' => [
                    'id' => $booking->id,
                    'booking_code' => $booking->booking_code,
                    'check_in' => $booking->check_in->format('d/m/Y'),
                    'check_out' => $booking->check_out->format('d/m/Y'),
                    'room_type' => $roomType ? [
                        'name' => $roomType->name,
                        'hotel' => $hotel ? [
                            'name' => $hotel->name,
                            'address' => $hotel->address
                        ] : null
                    ] : null,
                ]
            ]);
        }

        // 4️⃣ Kiểm tra thời gian đánh giá (30 ngày)
        $daysAfterCheckout = now()->diffInDays($booking->check_out);
        if ($daysAfterCheckout > 30) {
            $canReview = false;
            $messages[] = 'Thời gian đánh giá đã hết (chỉ trong vòng 30 ngày sau check-out)';
        }

        $firstItem = $booking->items->first();
        $roomType = $firstItem->roomType ?? null;
        $hotel = $roomType->hotel ?? null;

        $response = [
            'reviewable' => $canReview,
            'message' => $canReview ? 'Có thể đánh giá' : implode(', ', $messages),
            'booking_info' => [
                'id' => $booking->id,
                'booking_code' => $booking->booking_code,
                'check_in' => $booking->check_in->format('d/m/Y'),
                'check_out' => $booking->check_out->format('d/m/Y'),
                'status' => $booking->status,
                'room_type' => $roomType ? [
                    'id' => $roomType->id,
                    'name' => $roomType->name,
                    'hotel' => $hotel ? [
                        'name' => $hotel->name,
                        'address' => $hotel->address
                    ] : null
                ] : null,
                'days_since_checkout' => $daysAfterCheckout
            ]
        ];

        return response()->json($response);
    }

    /**
     * CREATE – User tạo review sau check-out
     */
    public function store(Request $request)
    {
        $user = Auth::user();

        $validator = Validator::make($request->all(), [
            'booking_id' => 'required|exists:bookings,id',
            'rating'     => 'required|integer|min:1|max:5',
            'comment'    => 'nullable|string|max:1000',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        $data = $validator->validated();

        // 1️⃣ Lấy booking + items
        $booking = Booking::with(['items.roomType.hotel'])
            ->where('id', $data['booking_id'])
            ->where('user_id', $user->user_id)
            ->where('status', Booking::STATUS_CHECK_OUT)
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

        // 4️⃣ Kiểm tra thời gian đánh giá (30 ngày)
        $daysAfterCheckout = now()->diffInDays($booking->check_out);
        if ($daysAfterCheckout > 30) {
            return response()->json([
                'message' => 'Thời gian đánh giá đã hết (chỉ trong vòng 30 ngày sau check-out)'
            ], 403);
        }

        // 👉 Lấy room_type_id từ booking_items
        $roomTypeId = $booking->items->first()->room_type_id;

        // 5️⃣ Tạo review
        $review = Review::create([
            'user_id'      => $user->user_id,
            'booking_id'   => $booking->id,
            'room_type_id' => $roomTypeId,
            'rating'       => $data['rating'],
            'comment'      => $data['comment'],
        ]);

        // Load thông tin đầy đủ
        $review->load(['user', 'roomType.hotel']);

        $formattedReview = [
            'id' => $review->id,
            'rating' => $review->rating,
            'comment' => $review->comment,
            'created_at' => $review->created_at->format('d/m/Y H:i'),
            'user' => $review->user ? [
                'id' => $review->user->user_id,
                'name' => $review->user->user_name,
                'avatar' => $review->user->avatar
            ] : null,
            'room_type' => $review->roomType ? [
                'name' => $review->roomType->name,
                'hotel' => $review->roomType->hotel ? [
                    'name' => $review->roomType->hotel->name,
                    'address' => $review->roomType->hotel->address
                ] : null
            ] : null
        ];

        return response()->json([
            'message' => 'Đánh giá đã được gửi thành công!',
            'data' => $formattedReview
        ], 201);
    }

    /**
     * UPDATE – Refine useUpdate
     */
    public function update(Request $request, $id)
    {
        $user = Auth::user();
        
        $review = Review::where('id', $id)
            ->where('user_id', $user->user_id)
            ->firstOrFail();

        $validator = Validator::make($request->all(), [
            'rating'  => 'required|integer|min:1|max:5',
            'comment' => 'nullable|string|max:1000',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        $data = $validator->validated();

        $review->update($data);

        $review->load(['user', 'roomType.hotel']);

        $formattedReview = [
            'id' => $review->id,
            'rating' => $review->rating,
            'comment' => $review->comment,
            'updated_at' => $review->updated_at->format('d/m/Y H:i'),
            'user' => $review->user ? [
                'id' => $review->user->user_id,
                'name' => $review->user->user_name,
                'avatar' => $review->user->avatar
            ] : null,
            'room_type' => $review->roomType ? [
                'name' => $review->roomType->name,
                'hotel' => $review->roomType->hotel ? [
                    'name' => $review->roomType->hotel->name,
                    'address' => $review->roomType->hotel->address
                ] : null
            ] : null
        ];

        return response()->json([
            'message' => 'Đánh giá đã được cập nhật!',
            'data' => $formattedReview,
        ]);
    }

    /**
     * DELETE – Refine useDelete
     */
    public function destroy($id)
    {
        $user = Auth::user();
        
        $review = Review::where('id', $id)
            ->where('user_id', $user->user_id)
            ->firstOrFail();

        $review->delete();

        return response()->json([
            'message' => 'Đánh giá đã được xóa!',
            'data' => true,
        ]);
    }

    /**
     * GET USER REVIEWS – Lấy tất cả reviews của user hiện tại
     */
    public function getUserReviews(Request $request)
    {
        $user = Auth::user();

        $query = Review::with(['roomType.hotel', 'booking'])
            ->where('user_id', $user->user_id)
            ->orderBy('created_at', 'desc');

        // 🔢 PAGINATION
        $start = (int) $request->get('_start', 0);
        $end   = (int) $request->get('_end', 10);
        $limit = $end - $start;

        $total = $query->count();

        $data = $query
            ->skip($start)
            ->take($limit)
            ->get()
            ->map(function ($review) {
                return [
                    'id' => $review->id,
                    'rating' => $review->rating,
                    'comment' => $review->comment,
                    'created_at' => $review->created_at->format('d/m/Y H:i'),
                    'updated_at' => $review->updated_at->format('d/m/Y H:i'),
                    'room_type' => $review->roomType ? [
                        'name' => $review->roomType->name,
                        'hotel' => $review->roomType->hotel ? [
                            'name' => $review->roomType->hotel->name,
                            'address' => $review->roomType->hotel->address
                        ] : null
                    ] : null,
                    'booking' => $review->booking ? [
                        'check_in' => $review->booking->check_in->format('d/m/Y'),
                        'check_out' => $review->booking->check_out->format('d/m/Y'),
                        'booking_code' => $review->booking->booking_code
                    ] : null
                ];
            });

        return response()->json([
            'data' => $data,
            'total' => $total
        ]);
    }

    /**
     * GET ROOM TYPE REVIEWS – Lấy reviews theo room_type_id
     */
    public function getRoomTypeReviews($roomTypeId)
    {
        $reviews = Review::with(['user:user_id,user_name,avatar', 'booking'])
            ->where('room_type_id', $roomTypeId)
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(function ($review) {
                return [
                    'id' => $review->id,
                    'rating' => $review->rating,
                    'comment' => $review->comment,
                    'created_at' => $review->created_at->format('d/m/Y'),
                    'user' => $review->user ? [
                        'name' => $review->user->user_name,
                        'avatar' => $review->user->avatar,
                        'initial' => strtoupper(substr($review->user->user_name, 0, 1))
                    ] : null
                ];
            });

        // Tính toán thống kê rating
        $totalReviews = $reviews->count();
        $averageRating = $totalReviews > 0 ? $reviews->avg('rating') : 0;
        $ratingDistribution = [];

        for ($i = 5; $i >= 1; $i--) {
            $count = $reviews->where('rating', $i)->count();
            $percentage = $totalReviews > 0 ? ($count / $totalReviews) * 100 : 0;
            $ratingDistribution[] = [
                'rating' => $i,
                'count' => $count,
                'percentage' => round($percentage, 1)
            ];
        }

        return response()->json([
            'data' => $reviews,
            'statistics' => [
                'total_reviews' => $totalReviews,
                'average_rating' => round($averageRating, 1),
                'rating_distribution' => $ratingDistribution
            ]
        ]);
    }
}