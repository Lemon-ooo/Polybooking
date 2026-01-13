<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Booking;
use App\Models\BookingItem;
use App\Models\RoomType;
use App\Models\Voucher;
use App\Models\Room;
use App\Models\User;
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

    public function index(Request $request)
{
    $user = $request->user();

    if (!$user) {
        return $this->error(
            'UNAUTHENTICATED',
            'Bạn chưa đăng nhập',
            [],
            401
        );
    }

    // ⚠️ Nếu có phân quyền admin thì check ở đây
    // if (!$user->is_admin) { ... }

    $query = Booking::with([
        'user:user_id,name,email',
        'items.roomType'
    ]);

    /* ================== FILTER ================== */

    // filter theo status
    if ($request->filled('status')) {
        $query->where('status', $request->status);
    }

    // filter theo user
    if ($request->filled('user_id')) {
        $query->where('user_id', $request->user_id);
    }

    // filter theo ngày check-in
    if ($request->filled('from_date')) {
        $query->whereDate('check_in', '>=', $request->from_date);
    }

    if ($request->filled('to_date')) {
        $query->whereDate('check_out', '<=', $request->to_date);
    }

    /* ================== SORT ================== */
    $query->orderByDesc('created_at');

    /* ================== PAGINATE ================== */
    $perPage = $request->get('per_page', 10);

    $bookings = $query->paginate($perPage);

    /* ================== FORMAT RESPONSE ================== */
    $bookings->getCollection()->transform(function ($booking) {
        return [
            'booking_id'        => $booking->id,
            'user' => [
                'user_id' => $booking->user->user_id ?? null,
                'name'    => $booking->user->name ?? null,
                'email'   => $booking->user->email ?? null,
            ],
            'check_in'          => $booking->check_in,
            'check_out'         => $booking->check_out,
            'nights'            => $booking->nights,
            'subtotal_price'    => $booking->subtotal_price,
            'voucher_code'      => $booking->voucher_code,
            'voucher_discount'  => $booking->voucher_discount,
            'total_price'       => $booking->total_price,
            'status'            => $booking->status,
            'created_at'        => $booking->created_at,

            'items' => $booking->items->map(function ($item) {
                return [
                    'booking_item_id'  => $item->booking_item_id,
                    'room_type_id'     => $item->room_type_id,
                    'room_type_name'   => $item->roomType?->room_type_name,
                    'quantity'         => $item->quantity,
                    'number_of_nights' => $item->number_of_nights,
                    'base_price'       => $item->base_price,
                    'amount'           => $item->amount,
                ];
            }),
        ];
    });

    return $this->success(
        $bookings,
        'Danh sách booking'
    );
}


    public function store(Request $request)
{
    if (!$request->user()) {
        return $this->error('UNAUTHENTICATED', 'Bạn chưa đăng nhập', [], 401);
    }

    $validator = Validator::make($request->all(), [
        'check_in'  => 'required|date|after_or_equal:today',
        'check_out' => 'required|date|after:check_in',
        'adults'    => 'required|integer|min:1',
        'children'  => 'nullable|integer|min:0',
        'voucher_code' => 'nullable|string',
        'room_types' => 'required|array|min:1',
        'room_types.*.room_type_id' => 'required|exists:room_types,room_type_id',
        'room_types.*.quantity'     => 'required|integer|min:1',
    ]);

    if ($validator->fails()) {
        return $this->error('VALIDATION_ERROR', 'Dữ liệu không hợp lệ', $validator->errors(), 422);
    }

    foreach ($request->room_types as $item) {
        $availableRooms = Room::where('room_type_id', $item['room_type_id'])
            ->where('room_status', 'available')
            ->count();

        if ($item['quantity'] > $availableRooms) {
            return $this->error(
                'ROOM_TYPE_NOT_ENOUGH',
                'Số lượng phòng trống của loại phòng không đủ để đặt',
                [],
                422
            );
        }
    }

    $data = $validator->validated();

    $checkIn  = Carbon::parse($data['check_in'])->startOfDay();
    $checkOut = Carbon::parse($data['check_out'])->startOfDay();
    $nights   = $checkIn->diffInDays($checkOut);

    DB::beginTransaction();

    try {
        /* ================== GIÁ GỐC ================== */
        $subtotalPrice = 0;

        foreach ($data['room_types'] as $item) {
            $roomType = RoomType::where('room_type_id', $item['room_type_id'])->firstOrFail();
            $subtotalPrice += $roomType->base_price * $item['quantity'] * $nights;
        }

        /* ================== VOUCHER ================== */
        $voucher = null;
        $voucherDiscount = 0;
        $voucherCode = null;

        if (!empty($data['voucher_code'])) {
            $user = $request->user();

            // 1️⃣ Voucher RIÊNG
            $voucher = $user->vouchers()
                ->where('code', $data['voucher_code'])
                ->wherePivot('is_used', false)
                ->whereDate('expired_at', '>=', now())
                ->first();

            // 2️⃣ Voucher CHUNG
            if (!$voucher) {
                $voucher = Voucher::where('code', $data['voucher_code'])
                    ->whereDate('expired_at', '>=', now())
                    ->whereDoesntHave('users')
                    ->first();
            }

            if (
                !$voucher ||
                $subtotalPrice < $voucher->min_price
            ) {
                throw new RuntimeException('Voucher không hợp lệ');
            }

            $voucherDiscount = $voucher->discount_percent
                ? intval($subtotalPrice * $voucher->discount_percent / 100)
                : $voucher->discount_amount;

            if ($voucher->max_discount) {
                $voucherDiscount = min($voucherDiscount, $voucher->max_discount);
            }

            $voucherDiscount = min($voucherDiscount, $subtotalPrice);
            $voucherCode = $voucher->code;
        }

        $totalPrice = max(0, $subtotalPrice - $voucherDiscount);

        /* ================== BOOKING ================== */
        $booking = Booking::create([
            'user_id'           => $request->user()->user_id,
            'adults'            => $data['adults'],
            'children'          => $data['children'] ?? 0,
            'check_in'          => $checkIn->toDateString(),
            'check_out'         => $checkOut->toDateString(),
            'nights'            => $nights,
            'subtotal_price'    => $subtotalPrice,
            'voucher_code'      => $voucherCode,
            'voucher_discount'  => $voucherDiscount,
            'total_price'       => $totalPrice,
            'status'            => Booking::STATUS_PENDING_PAYMENT,
        ]);

        /* ================== ITEMS ================== */
        foreach ($data['room_types'] as $item) {
            $roomType = RoomType::where('room_type_id', $item['room_type_id'])->first();

            BookingItem::create([
                'booking_id'   => $booking->id,
                'room_type_id' => $roomType->room_type_id,
                'quantity'     => $item['quantity'],
                'base_price'   => $roomType->base_price,
                'number_of_nights' => $nights,
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


    public function show(Request $request, $id)
    {
        $user = auth('sanctum')->user();

        if (!$user) {
            return $this->error(
                'UNAUTHENTICATED',
                'Bạn chưa đăng nhập',
                [],
                401
            );
        }

        $booking = Booking::with([
            'items.roomType',
            'serviceInvoice.charges.service',
            'damageInvoices.damageType',
            'penaltyCharges',
            'payments'                    // thanh toán
        ])
            ->where('id', $id)
            ->when($user->role !== 'admin', function ($query) use ($user) {
                $query->where('user_id', $user->user_id);
            })
            ->first();

        if (!$booking) {
            return $this->error(
                'BOOKING_NOT_FOUND',
                'Không tìm thấy booking hoặc bạn không có quyền',
                [],
                404
            );
        }

        /**
         * TÍNH TOÁN GIÁ TIỀN – KHÔNG HARD CODE
         */
        $roomTotal = collect($booking->items)->sum('amount');

        // Service total: prefer summarized `total_amount` on invoice, fallback to summing charges
        $serviceTotal = 0;
        if ($booking->serviceInvoice) {
            $serviceTotal = $booking->serviceInvoice->total_amount ?? collect($booking->serviceInvoice->charges)->sum('amount');
        }

        // Damage invoices (amount field)
        $damageTotal = collect($booking->damageInvoices)->sum('amount');

        // Penalty charges
        $penaltyTotal = collect($booking->penaltyCharges)->sum('amount');

        $grandTotal = $roomTotal + $serviceTotal + $damageTotal + $penaltyTotal;

        return $this->success([
            'booking' => $booking,

            'pricing' => [
                'room_total'    => $roomTotal,
                'service_total' => $serviceTotal,
                'damage_total'  => $damageTotal,
                'penalty_total' => $penaltyTotal,
                'grand_total'   => $grandTotal,
            ]
        ], 'Chi tiết booking');
    }






    public function myBookings(Request $request)
    {
        $user = $request->user();

        if (!$user) {
            return $this->error(
                'UNAUTHENTICATED',
                'Bạn chưa đăng nhập',
                [],
                401
            );
        }

        $bookings = Booking::with('items.roomType')
            ->where('user_id', $user->user_id)
            ->orderByDesc('created_at')
            ->get()
            ->map(function ($booking) {
                $booking->items = $booking->items->map(function ($item) {
                    return [
                        'booking_item_id'   => $item->booking_item_id,
                        'room_type_id'      => $item->room_type_id,
                        'room_type_name'    => $item->roomType?->name,
                        'quantity'          => $item->quantity,
                        'number_of_nights'  => $item->number_of_nights,
                        'base_price'        => $item->base_price,
                        'amount'            => $item->amount,
                    ];
                });

                return $booking;
            });

        return $this->success(
            $bookings,
            'Danh sách booking của bạn'
        );
    }

    
}