<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Mail;
use App\Mail\BookingPaidMail;
use App\Models\MembershipTier;
use App\Models\Voucher;
use App\Models\User;
/*
|--------------------------------------------------------------------------
| MODELS
|--------------------------------------------------------------------------
*/
use App\Models\Booking;
use App\Models\Payment;
use App\Models\ServiceInvoice;
use App\Models\DamageInvoice;
use App\Models\Penalty;
use App\Models\AssignedRoom;
use App\Services\LoyaltyPointService;


/*
|--------------------------------------------------------------------------
| PaymentController
|--------------------------------------------------------------------------
| DÙNG CHUNG CHO:
| 1. Thanh toán BOOKING ban đầu (prepaid)
| 2. Thanh toán CHECK_OUT (service + damage + penalty)
|--------------------------------------------------------------------------
*/

class PaymentController extends Controller
{
    /* =========================================================
     * 1. TẠO VNPAY – THANH TOÁN BOOKING BAN ĐẦU
     * POST /api/payments/vnpay/booking
     * ========================================================= */
    public function createVnpayBooking(Request $request)
    {
        $data = $request->validate([
            'booking_id' => 'required|exists:bookings,id'
        ]);

        $booking = Booking::findOrFail($data['booking_id']);

        // SỐ TIỀN THANH TOÁN = tiền đặt phòng ban đầu
        $amount = $booking->total_price;

        return $this->buildVnpayUrl(
            'BOOKING',
            $booking->id,
            $amount
        );
    }

    /* =========================================================
     * 2. TẠO VNPAY – THANH TOÁN CHECKOUT
     * POST /api/payments/vnpay/checkout
     * ========================================================= */
    public function createVnpayCheckout(Request $request)
    {
        $data = $request->validate([
            'booking_id' => 'required|exists:bookings,id',
            'amount'     => 'required|integer|min:0'
        ]);

        // amount được truyền từ AdminCheckoutController (final_total)
        return $this->buildVnpayUrl(
            'CHECKOUT',
            $data['booking_id'],
            $data['amount']
        );
    }

    /* =========================================================
     * 3. CALLBACK VNPAY (DÙNG CHUNG)
     * GET /api/payments/vnpay/callback
     * ========================================================= */
    public function vnpayCallback(Request $request)
    {
        /* ---------- 1. VERIFY SIGNATURE ---------- */
        $vnp_HashSecret = config('vnpay.hash_secret');
        $inputData = $request->all();

        $secureHash = $inputData['vnp_SecureHash'] ?? null;
        unset($inputData['vnp_SecureHash'], $inputData['vnp_SecureHashType']);

        ksort($inputData);
        $hashData = http_build_query($inputData);
        $calculatedHash = hash_hmac('sha512', $hashData, $vnp_HashSecret);

        if ($secureHash !== $calculatedHash) {
            return $this->error('INVALID_SIGNATURE', 'Chữ ký không hợp lệ');
        }

        /* ---------- 2. PARSE TXN REF ---------- */
        // Format: BOOKING_{id}_{time} | CHECKOUT_{id}_{time}
        $txnRef = $request->vnp_TxnRef ?? '';
        preg_match('/^(BOOKING|CHECKOUT)_(\d+)_/', $txnRef, $matches);

        $type      = $matches[1] ?? null;
        $bookingId = $matches[2] ?? null;

        if (!$type || !$bookingId) {
            return $this->error('INVALID_TXN_REF', 'TxnRef không hợp lệ');
        }

        $booking = Booking::find($bookingId);
        if (!$booking) {
            return $this->error('BOOKING_NOT_FOUND', 'Booking không tồn tại');
        }

        /* ---------- 3. PAYMENT FAIL ---------- */
        if ($request->vnp_ResponseCode !== '00') {

            Payment::create([
                'booking_id' => $booking->id,
                'method'     => 'vnpay',
                'amount'     => $request->vnp_Amount / 100,
                'status'     => 'failed',
                'raw_data'   => json_encode($request->all())
            ]);

            return $this->error('PAYMENT_FAILED', 'Thanh toán không thành công');
        }

        /* ---------- 4. PAYMENT SUCCESS ---------- */
        DB::transaction(function () use ($type, $booking, $request) {

            Payment::create([
                'booking_id' => $booking->id,
                'method'     => 'vnpay',
                'amount'     => $request->vnp_Amount / 100,
                'status'     => 'success',
                'paid_at'    => now(),
                'raw_data'   => json_encode($request->all())
            ]);

            /* ===== BOOKING PAYMENT ===== */
            if ($type === 'BOOKING') {

                // 1. Đổi trạng thái booking
                $booking->update(['status' => 'paid']);

                if ($booking->voucher_code && $booking->user) {

                    $voucher = Voucher::where('code', $booking->voucher_code)->first();

                    if ($voucher) {
                        // chỉ update nếu voucher này là voucher riêng của user
                        $booking->user->vouchers()
                            ->wherePivot('voucher_id', $voucher->id)
                            ->wherePivot('is_used', false)
                            ->update(['is_used' => true]);
                    }
                }

                // 2. 🔥 TÍCH ĐIỂM THÀNH VIÊN
                app(LoyaltyPointService::class)
                    ->rewardForBooking(
                        $booking->user,
                        $booking->total_price
                    );

                // ===============================
                // 3. 🔥 GÁN VOUCHER THEO HẠNG
                // ===============================
                $this->assignVoucherAfterPaid($booking);

                // 4. Load data gửi mail
                $booking->load(['user', 'items.roomType']);

                // 5. Gửi mail xác nhận
                Mail::to($booking->user->email)
                    ->send(new BookingPaidMail($booking));
            }

            /* ===== CHECKOUT PAYMENT ===== */
            if ($type === 'CHECKOUT') {

                // bắt buộc đã confirm checkout
                if (!Cache::get("checkout_confirmed_{$booking->id}")) {
                    throw new \Exception('Checkout chưa được xác nhận');
                }

                // đóng booking
                $booking->update(['status' => 'check_out']);

                // mở lại phòng
                AssignedRoom::where('booking_id', $booking->id)
                    ->update(['status' => 'available']);

                Cache::forget("checkout_confirmed_{$booking->id}");
            }
        });

        return $this->success([
            'booking_id' => $booking->id,
            'type'       => $type,
            'status'     => 'success'
        ]);
    }

    /* =========================================================
     * PRIVATE – BUILD VNPAY URL (DÙNG CHUNG)
     * ========================================================= */
    private function buildVnpayUrl(string $type, int $bookingId, int $amount)
    {
        $vnp_HashSecret = config('vnpay.hash_secret');
        $vnp_Url = config('vnpay.url');
        $vnp_Returnurl = config('vnpay.return_url');

        $txnRef = $type . '_' . $bookingId . '_' . time();

        $params = [
            'vnp_Version'   => '2.1.0',
            'vnp_Command'   => 'pay',
            'vnp_TmnCode'   => config('vnpay.tmn_code'),
            'vnp_Amount'    => $amount * 100,
            'vnp_CurrCode'  => 'VND',
            'vnp_TxnRef'    => $txnRef,
            'vnp_OrderInfo' => 'BOOKING PAYMENT booking ' . $bookingId,
            'vnp_OrderType' => 'other',
            'vnp_Locale'    => 'vn',
            'vnp_ReturnUrl' => $vnp_Returnurl,
            'vnp_IpAddr' => '8.8.8.8',
            'vnp_CreateDate' => date('YmdHis'),
        ];

        ksort($params);

        $hashData = http_build_query($params);
        $secureHash = hash_hmac('sha512', $hashData, $vnp_HashSecret);

        return response()->json([
            'success' => true,
            'payment_url' => $vnp_Url . '?' . http_build_query($params) . '&vnp_SecureHash=' . $secureHash
        ]);
    }

    /* =========================================================
     * RESPONSE HELPERS
     * ========================================================= */
    private function success($data, $status = 200)
    {
        return response()->json([
            'success' => true,
            'data'    => $data,
            'meta'    => ['timestamp' => now()->toISOString()]
        ], $status);
    }

    private function error($code, $message, $status = 400)
    {
        return response()->json([
            'success' => false,
            'error'   => ['code' => $code, 'message' => $message]
        ], $status);
    }

    private function assignVoucherAfterPaid(Booking $booking)
    {
        $user = $booking->user;
        $year = now()->year;

        // 1. Lấy điểm năm hiện tại
        $points = $user->points()
            ->where('year', $year)
            ->first();

        if (!$points) return;

        // 2. Xác định hạng
        $tier = MembershipTier::where('min_points', '<=', $points->total_points)
            ->orderByDesc('min_points')
            ->first();

        if (!$tier) return;

        // 3. Map hạng → mã voucher
        $voucherCode = match ($tier->name) {
            'gold'    => 'GOLD10',
            'diamond' => 'DIAMOND20',
            default   => null,
        };

        // ❌ Silver không có voucher
        if (!$voucherCode) return;

        // 4. Lấy voucher theo CODE
        $voucher = Voucher::where('code', $voucherCode)
            ->where('status', 'active')
            ->first();

        if (!$voucher) return;

        // 5. Tránh gán trùng
        $alreadyHas = $user->vouchers()
            ->where('vouchers.id', $voucher->id)
            ->exists();

        if ($alreadyHas) return;

        // 6. ✅ GÁN VOUCHER
        $user->vouchers()->attach($voucher->id, [
            'is_used' => false,
            'created_at' => now(),
            'updated_at' => now(),
        ]);
    }
}
