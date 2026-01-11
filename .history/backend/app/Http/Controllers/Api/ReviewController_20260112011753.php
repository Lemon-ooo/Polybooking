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
     * GET /api/reviews
     */
    public function index(Request $request)
    {
        // Build query
        $query = Review::query()
            ->with([
                'user:user_id,user_name,avatar',
                'booking:id,booking_code,check_in,check_out,total_amount',
                'roomType:id,name,slug,images',
                'roomType.hotel:id,name,address,city'
            ]);

        // 🔍 FILTERS (Refine style)
        $filters = json_decode($request->get('filter', '{}'), true);
        
        if (!empty($filters)) {
            foreach ($filters as $field => $value) {
                if (is_array($value)) {
                    // Handle advanced filters
                    if (isset($value['q'])) {
                        $query->where(function($q) use ($value) {
                            $q->where('comment', 'like', "%{$value['q']}%")
                              ->orWhereHas('user', function($q2) use ($value) {
                                  $q2->where('user_name', 'like', "%{$value['q']}%");
                              });
                        });
                    }
                    
                    if (isset($value['rating'])) {
                        $query->where('rating', $value['rating']);
                    }
                    
                    if (isset($value['room_type_id'])) {
                        $query->where('room_type_id', $value['room_type_id']);
                    }
                    
                    if (isset($value['user_id'])) {
                        $query->where('user_id', $value['user_id']);
                    }
                    
                    if (isset($value['created_at'])) {
                        $dates = explode(',', $value['created_at']);
                        if (count($dates) === 2) {
                            $query->whereBetween('created_at', [$dates[0], $dates[1]]);
                        }
                    }
                } else {
                    // Simple filter
                    if ($field === 'q') {
                        $query->where(function($q) use ($value) {
                            $q->where('comment', 'like', "%{$value}%")
                              ->orWhereHas('user', function($q2) use ($value) {
                                  $q2->where('user_name', 'like', "%{$value}%");
                              });
                        });
                    } elseif ($field === 'rating') {
                        $query->where('rating', $value);
                    } elseif ($field === 'room_type_id') {
                        $query->where('room_type_id', $value);
                    } elseif ($field === 'user_id') {
                        $query->where('user_id', $value);
                    }
                }
            }
        }

        // 📊 SORT (Refine style)
        $sorters = json_decode($request->get('sort', '[]'), true);
        
        if (!empty($sorters)) {
            foreach ($sorters as $sorter) {
                if (isset($sorter['field']) && isset($sorter['order'])) {
                    $query->orderBy($sorter['field'], $sorter['order']);
                }
            }
        } else {
            $query->orderBy('created_at', 'desc');
        }

        // 📄 PAGINATION (Refine style)
        $current = (int) $request->get('current', 1);
        $pageSize = (int) $request->get('pageSize', 10);
        $start = ($current - 1) * $pageSize;

        $total = $query->count();

        $reviews = $query
            ->skip($start)
            ->take($pageSize)
            ->get()
            ->map(function ($review) {
                return $this->formatReview($review);
            });

        return response()->json([
            'data' => $reviews,
            'total' => $total,
            'success' => true,
            'pageSize' => $pageSize,
            'current' => $current
        ]);
    }

    /**
     * SHOW – Refine useOne
     * GET /api/reviews/{id}
     */
    public function show($id)
    {
        $review = Review::with([
            'user:user_id,user_name,avatar,email,phone',
            'booking:id,booking_code,check_in,check_out,total_amount,status',
            'booking.items.roomType:id,name,images',
            'roomType:id,name,slug,description,images',
            'roomType.hotel:id,name,address,city,stars,images'
        ])->findOrFail($id);

        return response()->json([
            'data' => $this->formatReviewDetail($review),
            'success' => true,
        ]);
    }

    /**
     * CREATE – Refine useCreate
     * POST /api/reviews
     */
    public function store(Request $request)
    {
        $user = Auth::user();

        $validator = Validator::make($request->all(), [
            'booking_id' => 'required|exists:bookings,id',
            'rating'     => 'required|integer|min:1|max:5',
            'comment'    => 'nullable|string|max:1000',
            'images'     => 'nullable|array',
            'images.*'   => 'image|mimes:jpeg,png,jpg,gif|max:2048'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        $data = $validator->validated();

        // Check if booking exists and belongs to user
        $booking = Booking::with(['items.roomType', 'review'])
            ->where('id', $data['booking_id'])
            ->where('user_id', $user->user_id)
            ->first();

        if (!$booking) {
            return response()->json([
                'success' => false,
                'message' => 'Booking không tồn tại hoặc không thuộc về bạn'
            ], 404);
        }

        // Check booking status
        if ($booking->status !== Booking::STATUS_CHECK_OUT) {
            return response()->json([
                'success' => false,
                'message' => 'Chỉ có thể đánh giá sau khi check-out'
            ], 403);
        }

        // Check if already reviewed
        if ($booking->review) {
            return response()->json([
                'success' => false,
                'message' => 'Booking này đã được đánh giá'
            ], 409);
        }

        // Check time limit (30 days)
        $daysAfterCheckout = now()->diffInDays($booking->check_out);
        if ($daysAfterCheckout > 30) {
            return response()->json([
                'success' => false,
                'message' => 'Thời gian đánh giá đã hết (chỉ trong vòng 30 ngày sau check-out)'
            ], 403);
        }

        // Get room type from booking
        $roomTypeId = $booking->items->first()->room_type_id;

        // Handle image upload
        $images = [];
        if ($request->hasFile('images')) {
            foreach ($request->file('images') as $image) {
                $path = $image->store('reviews', 'public');
                $images[] = $path;
            }
        }

        // Create review
        $review = Review::create([
            'user_id'      => $user->user_id,
            'booking_id'   => $booking->id,
            'room_type_id' => $roomTypeId,
            'rating'       => $data['rating'],
            'comment'      => $data['comment'] ?? null,
            'images'       => !empty($images) ? json_encode($images) : null,
        ]);

        // Calculate new average rating for room type
        $this->updateRoomTypeRating($roomTypeId);

        return response()->json([
            'data' => $this->formatReview($review->fresh()),
            'success' => true,
            'message' => 'Đánh giá đã được gửi thành công!'
        ], 201);
    }

    /**
     * UPDATE – Refine useUpdate
     * PUT /api/reviews/{id}
     */
    public function update(Request $request, $id)
    {
        $user = Auth::user();
        
        $review = Review::with(['roomType'])
            ->where('id', $id)
            ->where('user_id', $user->user_id)
            ->firstOrFail();

        $validator = Validator::make($request->all(), [
            'rating'  => 'sometimes|required|integer|min:1|max:5',
            'comment' => 'nullable|string|max:1000',
            'images'  => 'nullable|array',
            'images.*' => 'image|mimes:jpeg,png,jpg,gif|max:2048'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        $data = $validator->validated();

        // Handle image upload
        if ($request->hasFile('images')) {
            $images = [];
            foreach ($request->file('images') as $image) {
                $path = $image->store('reviews', 'public');
                $images[] = $path;
            }
            $data['images'] = json_encode($images);
        }

        $review->update($data);

        // Update room type rating if rating changed
        if (isset($data['rating']) && $data['rating'] !== $review->getOriginal('rating')) {
            $this->updateRoomTypeRating($review->room_type_id);
        }

        return response()->json([
            'data' => $this->formatReview($review->fresh()),
            'success' => true,
            'message' => 'Đánh giá đã được cập nhật!'
        ]);
    }

    /**
     * DELETE – Refine useDelete
     * DELETE /api/reviews/{id}
     */
    public function destroy($id)
    {
        $user = Auth::user();
        
        $review = Review::where('id', $id)
            ->where('user_id', $user->user_id)
            ->firstOrFail();

        $roomTypeId = $review->room_type_id;
        $review->delete();

        // Update room type rating
        $this->updateRoomTypeRating($roomTypeId);

        return response()->json([
            'data' => $id,
            'success' => true,
            'message' => 'Đánh giá đã được xóa!'
        ]);
    }

    /**
     * GET REVIEWABLE BOOKINGS – Refine useList
     * GET /api/reviews/reviewable-bookings
     */
    public function getReviewableBookings(Request $request)
    {
        $user = Auth::user();

        $query = Booking::with([
            'items.roomType:id,name,images',
            'items.roomType.hotel:id,name,address,city',
            'review:id,booking_id'
        ])
        ->where('user_id', $user->user_id)
        ->where('status', Booking::STATUS_CHECK_OUT);

        // Apply filters
        $filters = json_decode($request->get('filter', '{}'), true);
        if (!empty($filters)) {
            if (isset($filters['booking_code'])) {
                $query->where('booking_code', 'like', "%{$filters['booking_code']}%");
            }
        }

        // Apply sorting
        $sorters = json_decode($request->get('sort', '[]'), true);
        if (!empty($sorters)) {
            foreach ($sorters as $sorter) {
                if (isset($sorter['field']) && isset($sorter['order'])) {
                    $query->orderBy($sorter['field'], $sorter['order']);
                }
            }
        } else {
            $query->orderBy('check_out', 'desc');
        }

        // Apply pagination
        $current = (int) $request->get('current', 1);
        $pageSize = (int) $request->get('pageSize', 10);
        $start = ($current - 1) * $pageSize;

        $total = $query->count();

        $bookings = $query
            ->skip($start)
            ->take($pageSize)
            ->get()
            ->map(function ($booking) {
                return $this->formatBookingForReview($booking);
            })
            ->filter(function ($booking) {
                return $booking['can_review'];
            })
            ->values();

        return response()->json([
            'data' => $bookings,
            'total' => $bookings->count(),
            'success' => true,
            'pageSize' => $pageSize,
            'current' => $current
        ]);
    }

    /**
     * GET USER REVIEWS – Refine useList
     * GET /api/reviews/my-reviews
     */
    public function getUserReviews(Request $request)
    {
        $user = Auth::user();

        $query = Review::with([
            'booking:id,booking_code,check_in,check_out',
            'roomType:id,name,images',
            'roomType.hotel:id,name,address,city'
        ])
        ->where('user_id', $user->user_id);

        // Apply filters
        $filters = json_decode($request->get('filter', '{}'), true);
        if (!empty($filters)) {
            if (isset($filters['rating'])) {
                $query->where('rating', $filters['rating']);
            }
            if (isset($filters['room_type_id'])) {
                $query->where('room_type_id', $filters['room_type_id']);
            }
            if (isset($filters['created_at'])) {
                $dates = explode(',', $filters['created_at']);
                if (count($dates) === 2) {
                    $query->whereBetween('created_at', [$dates[0], $dates[1]]);
                }
            }
        }

        // Apply sorting
        $sorters = json_decode($request->get('sort', '[]'), true);
        if (!empty($sorters)) {
            foreach ($sorters as $sorter) {
                if (isset($sorter['field']) && isset($sorter['order'])) {
                    $query->orderBy($sorter['field'], $sorter['order']);
                }
            }
        } else {
            $query->orderBy('created_at', 'desc');
        }

        // Apply pagination
        $current = (int) $request->get('current', 1);
        $pageSize = (int) $request->get('pageSize', 10);
        $start = ($current - 1) * $pageSize;

        $total = $query->count();

        $reviews = $query
            ->skip($start)
            ->take($pageSize)
            ->get()
            ->map(function ($review) {
                return $this->formatUserReview($review);
            });

        return response()->json([
            'data' => $reviews,
            'total' => $total,
            'success' => true,
            'pageSize' => $pageSize,
            'current' => $current
        ]);
    }

    /**
     * GET ROOM TYPE REVIEWS – Refine useList
     * GET /api/reviews/room-type/{roomTypeId}
     */
    public function getRoomTypeReviews($roomTypeId, Request $request)
    {
        $query = Review::with([
            'user:user_id,user_name,avatar',
            'booking:id,check_in,check_out'
        ])
        ->where('room_type_id', $roomTypeId)
        ->where('status', 'active');

        // Apply filters
        $filters = json_decode($request->get('filter', '{}'), true);
        if (!empty($filters)) {
            if (isset($filters['rating'])) {
                $query->where('rating', $filters['rating']);
            }
        }

        // Apply sorting
        $sorters = json_decode($request->get('sort', '[]'), true);
        if (!empty($sorters)) {
            foreach ($sorters as $sorter) {
                if (isset($sorter['field']) && isset($sorter['order'])) {
                    $query->orderBy($sorter['field'], $sorter['order']);
                }
            }
        } else {
            $query->orderBy('created_at', 'desc');
        }

        // Apply pagination
        $current = (int) $request->get('current', 1);
        $pageSize = (int) $request->get('pageSize', 10);
        $start = ($current - 1) * $pageSize;

        $total = $query->count();

        $reviews = $query
            ->skip($start)
            ->take($pageSize)
            ->get()
            ->map(function ($review) {
                return [
                    'id' => $review->id,
                    'rating' => $review->rating,
                    'comment' => $review->comment,
                    'images' => $review->images ? json_decode($review->images, true) : [],
                    'created_at' => $review->created_at->format('d/m/Y'),
                    'user' => $review->user ? [
                        'id' => $review->user->user_id,
                        'name' => $review->user->user_name,
                        'avatar' => $review->user->avatar,
                        'initial' => strtoupper(substr($review->user->user_name, 0, 1))
                    ] : null
                ];
            });

        // Calculate statistics
        $statistics = $this->getRoomTypeStatistics($roomTypeId);

        return response()->json([
            'data' => $reviews,
            'total' => $total,
            'statistics' => $statistics,
            'success' => true,
            'pageSize' => $pageSize,
            'current' => $current
        ]);
    }

    /**
     * CHECK REVIEWABLE – Single booking check
     * GET /api/reviews/check-reviewable/{bookingId}
     */
    public function checkReviewable($bookingId)
    {
        $user = Auth::user();

        $booking = Booking::with([
            'items.roomType:id,name,images',
            'items.roomType.hotel:id,name,address',
            'review:id,booking_id,rating,comment'
        ])
        ->where('id', $bookingId)
        ->where('user_id', $user->user_id)
        ->first();

        if (!$booking) {
            return response()->json([
                'success' => false,
                'message' => 'Booking không tồn tại hoặc không thuộc về bạn'
            ], 404);
        }

        $canReview = true;
        $reasons = [];

        // Check conditions
        if ($booking->status !== Booking::STATUS_CHECK_OUT) {
            $canReview = false;
            $reasons[] = 'Chỉ có thể đánh giá sau khi check-out';
        }

        if ($booking->items->isEmpty()) {
            $canReview = false;
            $reasons[] = 'Booking không có phòng để đánh giá';
        }

        if ($booking->review) {
            $canReview = false;
            $reasons[] = 'Booking này đã được đánh giá';
        }

        // Check time limit (30 days)
        $daysAfterCheckout = now()->diffInDays($booking->check_out);
        if ($daysAfterCheckout > 30) {
            $canReview = false;
            $reasons[] = 'Thời gian đánh giá đã hết (30 ngày)';
        }

        $response = [
            'can_review' => $canReview,
            'reasons' => $reasons,
            'booking' => $this->formatBookingForReview($booking),
            'success' => true
        ];

        if ($booking->review) {
            $response['existing_review'] = $this->formatReview($booking->review);
        }

        return response()->json($response);
    }

    /**
     * GET REVIEW STATISTICS
     * GET /api/reviews/statistics
     */
    public function getStatistics(Request $request)
    {
        $user = Auth::user();

        // User statistics
        $userReviews = Review::where('user_id', $user->user_id)->get();
        
        $userStats = [
            'total_reviews' => $userReviews->count(),
            'average_rating' => $userReviews->avg('rating') ?? 0,
            'rating_distribution' => $this->calculateRatingDistribution($userReviews),
            'last_review_date' => $userReviews->max('created_at')
        ];

        // Global statistics (if admin)
        $globalStats = null;
        if ($user->is_admin) {
            $allReviews = Review::all();
            $globalStats = [
                'total_reviews' => $allReviews->count(),
                'average_rating' => $allReviews->avg('rating') ?? 0,
                'reviews_today' => Review::whereDate('created_at', today())->count(),
                'reviews_this_month' => Review::whereMonth('created_at', now()->month)->count(),
                'top_room_types' => $this->getTopRoomTypes()
            ];
        }

        return response()->json([
            'data' => [
                'user' => $userStats,
                'global' => $globalStats
            ],
            'success' => true
        ]);
    }

    /**
     * Helper Methods
     */
    private function formatReview($review)
    {
        return [
            'id' => $review->id,
            'rating' => $review->rating,
            'comment' => $review->comment,
            'images' => $review->images ? json_decode($review->images, true) : [],
            'status' => $review->status,
            'created_at' => $review->created_at->format('Y-m-d H:i:s'),
            'updated_at' => $review->updated_at->format('Y-m-d H:i:s'),
            'user' => $review->user ? [
                'id' => $review->user->user_id,
                'name' => $review->user->user_name,
                'avatar' => $review->user->avatar
            ] : null,
            'booking' => $review->booking ? [
                'id' => $review->booking->id,
                'code' => $review->booking->booking_code,
                'check_in' => $review->booking->check_in->format('d/m/Y'),
                'check_out' => $review->booking->check_out->format('d/m/Y')
            ] : null,
            'room_type' => $review->roomType ? [
                'id' => $review->roomType->id,
                'name' => $review->roomType->name,
                'images' => $review->roomType->images ? json_decode($review->roomType->images, true) : [],
                'hotel' => $review->roomType->hotel ? [
                    'name' => $review->roomType->hotel->name,
                    'address' => $review->roomType->hotel->address,
                    'city' => $review->roomType->hotel->city
                ] : null
            ] : null
        ];
    }

    private function formatReviewDetail($review)
    {
        $base = $this->formatReview($review);
        
        $base['booking']['details'] = [
            'total_amount' => number_format($review->booking->total_amount, 0, ',', '.') . ' VND',
            'status' => $review->booking->status,
            'items' => $review->booking->items->map(function ($item) {
                return [
                    'room_type' => $item->roomType->name,
                    'quantity' => $item->quantity,
                    'price' => $item->price
                ];
            })
        ];

        return $base;
    }

    private function formatUserReview($review)
    {
        return [
            'id' => $review->id,
            'rating' => $review->rating,
            'comment' => $review->comment,
            'images' => $review->images ? json_decode($review->images, true) : [],
            'created_at' => $review->created_at->format('d/m/Y H:i'),
            'updated_at' => $review->updated_at->format('d/m/Y H:i'),
            'booking' => [
                'code' => $review->booking->booking_code,
                'check_in' => $review->booking->check_in->format('d/m/Y'),
                'check_out' => $review->booking->check_out->format('d/m/Y')
            ],
            'room_type' => [
                'name' => $review->roomType->name,
                'hotel' => [
                    'name' => $review->roomType->hotel->name,
                    'address' => $review->roomType->hotel->address,
                    'city' => $review->roomType->hotel->city
                ]
            ]
        ];
    }

    private function formatBookingForReview($booking)
    {
        $firstItem = $booking->items->first();
        $roomType = $firstItem->roomType ?? null;
        $hotel = $roomType->hotel ?? null;
        $daysAfterCheckout = now()->diffInDays($booking->check_out);

        $canReview = $booking->status === Booking::STATUS_CHECK_OUT 
            && $booking->items->isNotEmpty() 
            && !$booking->review
            && $daysAfterCheckout <= 30;

        return [
            'id' => $booking->id,
            'booking_code' => $booking->booking_code,
            'check_in' => $booking->check_in->format('d/m/Y'),
            'check_out' => $booking->check_out->format('d/m/Y'),
            'status' => $booking->status,
            'can_review' => $canReview,
            'days_since_checkout' => $daysAfterCheckout,
            'time_remaining' => max(0, 30 - $daysAfterCheckout),
            'room_type' => $roomType ? [
                'id' => $roomType->id,
                'name' => $roomType->name,
                'images' => $roomType->images ? json_decode($roomType->images, true) : []
            ] : null,
            'hotel' => $hotel ? [
                'name' => $hotel->name,
                'address' => $hotel->address,
                'city' => $hotel->city
            ] : null,
            'has_review' => $booking->review !== null
        ];
    }

    private function updateRoomTypeRating($roomTypeId)
    {
        $roomType = RoomType::find($roomTypeId);
        if (!$roomType) return;

        $reviews = Review::where('room_type_id', $roomTypeId)
            ->where('status', 'active')
            ->get();

        $averageRating = $reviews->avg('rating') ?? 0;
        $totalReviews = $reviews->count();

        $roomType->update([
            'average_rating' => round($averageRating, 1),
            'total_reviews' => $totalReviews
        ]);
    }

    private function getRoomTypeStatistics($roomTypeId)
    {
        $reviews = Review::where('room_type_id', $roomTypeId)
            ->where('status', 'active')
            ->get();

        $total = $reviews->count();
        $average = $reviews->avg('rating') ?? 0;

        $distribution = [];
        for ($i = 5; $i >= 1; $i--) {
            $count = $reviews->where('rating', $i)->count();
            $percentage = $total > 0 ? ($count / $total) * 100 : 0;
            $distribution[] = [
                'rating' => $i,
                'count' => $count,
                'percentage' => round($percentage, 1)
            ];
        }

        return [
            'total_reviews' => $total,
            'average_rating' => round($average, 1),
            'rating_distribution' => $distribution
        ];
    }

    private function calculateRatingDistribution($reviews)
    {
        $distribution = [];
        for ($i = 1; $i <= 5; $i++) {
            $distribution[$i] = $reviews->where('rating', $i)->count();
        }
        return $distribution;
    }

    private function getTopRoomTypes()
    {
        return Review::selectRaw('room_type_id, COUNT(*) as total, AVG(rating) as average')
            ->with('roomType:id,name')
            ->groupBy('room_type_id')
            ->orderBy('average', 'desc')
            ->orderBy('total', 'desc')
            ->take(10)
            ->get()
            ->map(function ($item) {
                return [
                    'room_type' => $item->roomType->name,
                    'total_reviews' => $item->total,
                    'average_rating' => round($item->average, 1)
                ];
            });
    }
}