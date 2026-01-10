<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Booking;
use App\Models\BookingItem;
use App\Models\RoomType;
use App\Models\Voucher;

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
            'voucher_code' => 'nullable|string|exists:vouchers,code',
            'room_types' => 'required|array|min:1',
            'room_types.*.room_type_id' => 'required|exists:room_types,room_type_id',
            'room_types.*.quantity'     => 'required|integer|min:1',
        ]);

        if ($validator->fails()) {
            return $this->error('VALIDATION_ERROR', 'Dữ liệu không hợp lệ', $validator->errors(), 422);
        }

        $data = $validator->validated();

        $checkIn  = Carbon::parse($data['check_in'])->startOfDay();
        $checkOut = Carbon::parse($data['check_out'])->startOfDay();
        $nights   = $checkIn->diffInDays($checkOut);

        DB::beginTransaction();

        try {
            /* ================== TÍNH GIÁ GỐC ================== */
            $subtotalPrice = 0;

            foreach ($data['room_types'] as $item) {
                $roomType = RoomType::where('room_type_id', $item['room_type_id'])->firstOrFail();

                $subtotalPrice +=
                    $roomType->base_price *
                    $item['quantity'] *
                    $nights;
            }

            /* ================== XỬ LÝ VOUCHER ================== */
            $voucherDiscount = 0;
            $voucherCode = null;

            if (!empty($data['voucher_code'])) {
                $voucher = Voucher::where('code', $data['voucher_code'])->first();

                if (
                    !$voucher ||
                    !$voucher->isValid() ||
                    $subtotalPrice < $voucher->min_price
                ) {
                    throw new RuntimeException('Voucher không hợp lệ');
                }

                $voucherDiscount = $subtotalPrice - $voucher->applyDiscount($subtotalPrice);
                $voucherCode = $voucher->code;
            }

            $totalPrice = max(0, $subtotalPrice - $voucherDiscount);

            /* ================== TẠO BOOKING ================== */
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

            /* ================== BOOKING ITEMS ================== */
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
