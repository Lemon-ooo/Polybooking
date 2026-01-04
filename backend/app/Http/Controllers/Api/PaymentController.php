<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

// Models
use App\Models\Booking;
use App\Models\Payment;

class PaymentController extends Controller
{
    /* =========================================================
     * POST /api/payments/vnpay/create
     * Tạo URL thanh toán VNPAY
     * ========================================================= */
    public function createVnpay(Request $request)
    {
        $user = $request->user();
        if (!$user) {
            return $this->unauthenticated();
        }

        $request->validate([
            'booking_id' => 'required|integer'
        ]);

        $booking = Booking::where('id', $request->booking_id)
            ->where('user_id', $user->id)
            ->first();

        if (!$booking) {
            return $this->error('BOOKING_NOT_FOUND', 'Không tìm thấy booking', 404);
        }

        if ($booking->status !== 'pending_payment') {
            return $this->error(
                'INVALID_BOOKING_STATUS',
                'Booking không ở trạng thái chờ thanh toán'
            );
        }

        // Thông tin VNPAY
        $vnp_TmnCode    = config('vnpay.tmn_code');
        $vnp_HashSecret= config('vnpay.hash_secret');
        $vnp_Url       = config('vnpay.url');
        $vnp_ReturnUrl = config('vnpay.return_url');

        $vnp_TxnRef = 'BOOKING_' . $booking->id . '_' . time();
        $vnp_Amount = $booking->total_price * 100;

        $inputData = [
            "vnp_Version"   => "2.1.0",
            "vnp_TmnCode"   => $vnp_TmnCode,
            "vnp_Amount"   => $vnp_Amount,
            "vnp_Command"  => "pay",
            "vnp_CreateDate"=> now()->format('YmdHis'),
            "vnp_CurrCode" => "VND",
            "vnp_IpAddr"   => $request->ip(),
            "vnp_Locale"   => "vn",
            "vnp_OrderInfo"=> "Thanh toan booking #" . $booking->id,
            "vnp_OrderType"=> "other",
            "vnp_ReturnUrl"=> $vnp_ReturnUrl,
            "vnp_TxnRef"   => $vnp_TxnRef
        ];

        ksort($inputData);
        $hashData = urldecode(http_build_query($inputData));
        $secureHash = hash_hmac('sha512', $hashData, $vnp_HashSecret);

        $vnpayUrl = $vnp_Url . '?' . http_build_query($inputData) .
            '&vnp_SecureHash=' . $secureHash;

        return $this->success([
            'payment_url' => $vnpayUrl,
            'booking_id'  => $booking->id
        ]);
    }

    /* =========================================================
     * GET /api/payments/vnpay/callback
     * VNPAY redirect về
     * ========================================================= */
    public function vnpayCallback(Request $request)
    {
        $vnp_HashSecret = config('vnpay.hash_secret');
        $inputData = $request->all();

        $vnp_SecureHash = $inputData['vnp_SecureHash'] ?? null;
        unset($inputData['vnp_SecureHash'], $inputData['vnp_SecureHashType']);

        ksort($inputData);
        $hashData = urldecode(http_build_query($inputData));
        $calculatedHash = hash_hmac('sha512', $hashData, $vnp_HashSecret);

        if ($calculatedHash !== $vnp_SecureHash) {
            return $this->error(
                'INVALID_SIGNATURE',
                'Chữ ký không hợp lệ',
                400
            );
        }

        // Parse booking id
        $txnRef = $request->vnp_TxnRef ?? '';
        preg_match('/BOOKING_(\d+)_/', $txnRef, $matches);
        $bookingId = $matches[1] ?? null;

        if (!$bookingId) {
            return $this->error('INVALID_TXN_REF', 'Không xác định được booking');
        }

        $booking = Booking::find($bookingId);
        if (!$booking) {
            return $this->error('BOOKING_NOT_FOUND', 'Booking không tồn tại');
        }

        // Chỉ xử lý 1 lần
        if ($booking->status === 'paid') {
            return $this->success([
                'booking_id' => $booking->id,
                'status'     => 'paid'
            ]);
        }

        // Thành công
        if ($request->vnp_ResponseCode === '00') {
            DB::beginTransaction();
            try {
                Payment::create([
                    'booking_id' => $booking->id,
                    'method'     => 'vnpay',
                    'amount'     => $request->vnp_Amount / 100,
                    'status'     => 'success',
                    'paid_at'    => now(),
                    'raw_data'   => json_encode($request->all())
                ]);

                $booking->update(['status' => 'paid']);

                DB::commit();

                return $this->success([
                    'booking_id' => $booking->id,
                    'status'     => 'paid'
                ]);

            } catch (\Exception $e) {
                DB::rollBack();
                return $this->error('PAYMENT_SAVE_FAILED', 'Lỗi lưu thanh toán');
            }
        }

        // Thất bại
        Payment::create([
            'booking_id' => $booking->id,
            'method'     => 'vnpay',
            'amount'     => $request->vnp_Amount / 100,
            'status'     => 'failed',
            'raw_data'   => json_encode($request->all())
        ]);

        return $this->error(
            'PAYMENT_FAILED',
            'Thanh toán không thành công'
        );
    }

    /* =========================================================
     * HELPER RESPONSES
     * ========================================================= */
    private function success($data, $status = 200)
    {
        return response()->json([
            'success' => true,
            'data'    => $data,
            'meta'    => [
                'timestamp' => now()->toISOString()
            ]
        ], $status);
    }

    private function error($code, $message, $status = 400)
    {
        return response()->json([
            'success' => false,
            'error' => [
                'code'    => $code,
                'message' => $message
            ]
        ], $status);
    }

    private function unauthenticated()
    {
        return $this->error(
            'UNAUTHENTICATED',
            'Token không hợp lệ hoặc đã hết hạn',
            401
        );
    }
}
