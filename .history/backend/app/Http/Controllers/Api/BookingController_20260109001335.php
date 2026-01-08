<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Booking;
use App\Models\BookingItem;
use App\Models\RoomType;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;
use Carbon\Carbon;
use RuntimeException;

class BookingController extends Controller
{
    private function success($data, $message = '')
    {
        return response()->json([
            'success' => true,
            'data'    => $data,
            'message' => $message,
        ]);
    }

    private function error($code, $message, $details = [], $httpCode = 400)
    {
        return response()->json([
            'success' => false,
            'error' => [
                'code'    => $code,
                'message' => $message,
                'details' => $details,
            ],
        ], $httpCode);
    }

    // ===============================
    // SHOW BOOKING DETAIL
    // ===============================
    public function show($id)
    {
        try {
            // Tìm booking
            $booking = Booking::with([
                'items.roomType.images',
                'user' => function($query) {
                    $query->select('user_id', 'user_name', 'email', 'phone');
                }
            ])->find($id);

            if (!$booking) {
                return $this->error(
                    'BOOKING_NOT_FOUND',
                    'Không tìm thấy đơn đặt phòng',
                    [],
                    404
                );
            }

            // Kiểm tra quyền truy cập
            $user = auth()->user();
            
            if (!$user) {
                return $this->error(
                    'UNAUTHENTICATED',
                    'Bạn chưa đăng nhập',
                    [],
                    401
                );
            }

            // Chỉ cho phép chủ booking hoặc admin xem
            $isOwner = $user->user_id == $booking->user_id;
            $isAdmin = $user->role === 'admin'; // Giả sử có trường role

            if (!$isOwner && !$isAdmin) {
                return $this->error(
                    'UNAUTHORIZED',
                    'Bạn không có quyền xem đơn đặt phòng này',
                    [],
                    403
                );
            }

            // Format dữ liệu trả về
            $formattedBooking = [
                'id' => $booking->id,
                'booking_id' => $booking->id, // Thêm trường này cho frontend
                'user_id' => $booking->user_id,
                'user_name' => $booking->user->user_name ?? null,
                'check_in' => $booking->check_in,
                'check_out' => $booking->check_out,
                'nights' => $booking->nights,
                'adults' => $booking->adults,
                'children' => $booking->children,
                'total_price' => $booking->total_price,
                'status' => $booking->status,
                'created_at' => $booking->created_at,
                'updated_at' => $booking->updated_at,
                'items' => $booking->items->map(function($item) {
                    return [
                        'id' => $item->id,
                        'room_type_id' => $item->room_type_id,
                        'room_type_name' => $item->roomType->room_type_name ?? null,
                        'quantity' => $item->quantity,
                        'base_price' => $item->base_price,
                        'number_of_nights' => $item->number_of_nights,
                        'amount' => $item->amount,
                        'room_type' => $item->roomType ? [
                            'room_type_id' => $item->roomType->room_type_id,
                            'room_type_name' => $item->roomType->room_type_name,
                            'base_price' => $item->roomType->base_price,
                            'max_guests' => $item->roomType->max_guests,
                            'images' => $item->roomType->images->map(function($image) {
                                return [
                                    'image_url' => $image->image_url,
                                    'is_primary' => $image->is_primary,
                                ];
                            })
                        ] : null
                    ];
                })
            ];

            return $this->success($formattedBooking, 'Lấy thông tin đơn đặt phòng thành công');
            
        } catch (\Throwable $e) {
            return $this->error(
                'SERVER_ERROR',
                'Lỗi server: ' . $e->getMessage(),
                [],
                500
            );
        }
    }

    // ===============================
    // LIST USER BOOKINGS
    // ===============================
    public function index(Request $request)
    {
        try {
            $user = auth()->user();
            
            if (!$user) {
                return $this->error(
                    'UNAUTHENTICATED',
                    'Bạn chưa đăng nhập',
                    [],
                    401
                );
            }

            // Lấy danh sách booking của user
            $bookings = Booking::with(['items.roomType'])
                ->where('user_id', $user->user_id)
                ->orderBy('created_at', 'desc')
                ->get();

            $formattedBookings = $bookings->map(function($booking) {
                return [
                    'id' => $booking->id,
                    'booking_id' => $booking->id,
                    'check_in' => $booking->check_in,
                    'check_out' => $booking->check_out,
                    'nights' => $booking->nights,
                    'adults' => $booking->adults,
                    'children' => $booking->children,
                    'total_price' => $booking->total_price,
                    'status' => $booking->status,
                    'created_at' => $booking->created_at,
                    'items_count' => $booking->items->sum('quantity'),
                    'items' => $booking->items->map(function($item) {
                        return [
                            'room_type_name' => $item->roomType->room_type_name ?? null,
                            'quantity' => $item->quantity,
                            'amount' => $item->amount,
                        ];
                    })
                ];
            });

            return $this->success($formattedBookings, 'Lấy danh sách đơn đặt phòng thành công');
            
        } catch (\Throwable $e) {
            return $this->error(
                'SERVER_ERROR',
                'Lỗi server: ' . $e->getMessage(),
                [],
                500
            );
        }
    }

    public function store(Request $request)
    {
        if (!$request->user()) {
            return $this->error(
                'UNAUTHENTICATED',
                'Bạn chưa đăng nhập hoặc token không hợp lệ',
                [],
                401
            );
        }

        $validator = Validator::make($request->all(), [
            'check_in'  => 'required|date|after_or_equal:today',
            'check_out' => 'required|date|after:check_in',
            'adults'   => 'required|integer|min:1',
            'children' => 'nullable|integer|min:0',
            'room_types' => 'required|array|min:1',
            'room_types.*.room_type_id' => 'required|exists:room_types,room_type_id',
            'room_types.*.quantity'     => 'required|integer|min:1',
        ]);

        if ($validator->fails()) {
            return $this->error(
                'VALIDATION_ERROR',
                'Dữ liệu không hợp lệ',
                $validator->errors(),
                422
            );
        }

        $data = $validator->validated();

        $checkIn  = Carbon::parse($data['check_in'])->startOfDay();
        $checkOut = Carbon::parse($data['check_out'])->startOfDay();
        $nights   = $checkIn->diffInDays($checkOut);

        if ($nights <= 0) {
            throw new RuntimeException('Số đêm không hợp lệ');
        }

        DB::beginTransaction();

        try {
            $totalPrice = 0;

            foreach ($data['room_types'] as $item) {
                $roomType = RoomType::where(
                    'room_type_id',
                    $item['room_type_id']
                )->firstOrFail();

                $totalPrice +=
                    $roomType->base_price *
                    $item['quantity'] *
                    $nights;
            }

            $user = $request->user();

            if (!$user) {
                return $this->error(
                    'UNAUTHENTICATED',
                    'Vui lòng đăng nhập để đặt phòng',
                    [],
                    401
                );
            }

            $booking = Booking::create([
                'user_id'     => $request->user()->user_id,
                'adults'      => $data['adults'],
                'children'    => $data['children'] ?? 0,
                'check_in'    => $checkIn->toDateString(),
                'check_out'   => $checkOut->toDateString(),
                'nights'      => $nights,
                'total_price' => $totalPrice,
                'status'      => Booking::STATUS_PENDING_PAYMENT,
            ]);

            foreach ($data['room_types'] as $item) {
                $roomType = RoomType::where(
                    'room_type_id',
                    $item['room_type_id']
                )->first();

                BookingItem::create([
                    'booking_id'   => $booking->id,
                    'room_type_id' => $roomType->room_type_id,
                    'quantity'     => $item['quantity'],    
                    'base_price'   => $roomType->base_price,
                    'number_of_nights' =>$booking->nights,
                    'amount' => $roomType->base_price * $item['quantity'] * $nights,
                ]);
            }

            DB::commit();

            return $this->success(
                $booking->load('items'),
                'Tạo booking thành công'
            );
        } catch (\Throwable $e) {
            DB::rollBack();

            return $this->error(
                'BOOKING_FAILED',
                $e->getMessage(),
                [],
                500
            );
        }
    }
}