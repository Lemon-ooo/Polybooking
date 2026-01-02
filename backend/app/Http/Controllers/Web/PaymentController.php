<?php

namespace App\Http\Controllers\Web;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Booking;
use App\Models\Payment;

class PaymentController extends Controller
{
    /*
    |--------------------------------------------------------------------------
    | Trang hiển thị thông tin + nút thanh toán
    |--------------------------------------------------------------------------
    | Route: GET /payment/{booking}
    | Name : payment.page
    */
    public function showPaymentPage(Booking $booking)
    {
        if ($booking->status !== 'pending_payment') {
            return back()->with('error', 'Booking đã được thanh toán hoặc không hợp lệ.');
        }

        return view('payment.payment_page', compact('booking'));
    }

    /*
    |--------------------------------------------------------------------------
    | Chuyển hướng sang VNPAY
    |--------------------------------------------------------------------------
    | Route: POST /payment/{booking}/vnpay
    | Name : payment.vnpay
    */
    public function redirectToVnpay(Request $request, Booking $booking)
    {
        if ($booking->status !== 'pending_payment') {
            return back()->with('error', 'Booking không hợp lệ để thanh toán.');
        }

        $vnp_Url        = config('vnpay.vnp_Url');
        $vnp_ReturnUrl  = config('vnpay.vnp_ReturnUrl');
        $vnp_TmnCode    = config('vnpay.vnp_TmnCode');
        $vnp_HashSecret = config('vnpay.vnp_HashSecret');

        $vnp_TxnRef    = $booking->id; // booking_id
        $vnp_OrderInfo = "Thanh toan don dat phong #" . $booking->id;
        $vnp_Amount    = $booking->total_price * 100; // VNPAY yêu cầu *100
        $vnp_IpAddr    = $request->ip();
        $vnp_CreateDate = date('YmdHis');

        $inputData = [
            "vnp_Version"    => "2.1.0",
            "vnp_TmnCode"    => $vnp_TmnCode,
            "vnp_Amount"     => $vnp_Amount,
            "vnp_Command"    => "pay",
            "vnp_CreateDate" => $vnp_CreateDate,
            "vnp_CurrCode"   => "VND",
            "vnp_IpAddr"     => $vnp_IpAddr,
            "vnp_Locale"     => "vn",
            "vnp_OrderInfo"  => $vnp_OrderInfo,
            "vnp_OrderType"  => "billpayment",
            "vnp_ReturnUrl"  => $vnp_ReturnUrl,
            "vnp_TxnRef"     => $vnp_TxnRef
        ];

        ksort($inputData);

        $query = "";
        $hashdata = "";

        foreach ($inputData as $key => $value) {
            $query    .= urlencode($key) . "=" . urlencode($value) . "&";
            $hashdata .= urlencode($key) . "=" . urlencode($value) . "&";
        }

        $query = rtrim($query, "&");
        $hashdata = rtrim($hashdata, "&");

        $vnpSecureHash = hash_hmac('sha512', $hashdata, $vnp_HashSecret);

        $paymentUrl = $vnp_Url . "?" . $query . "&vnp_SecureHash=" . $vnpSecureHash;

        return redirect($paymentUrl);
    }

    /*
    |--------------------------------------------------------------------------
    | VNPAY trả kết quả (Return URL)
    |--------------------------------------------------------------------------
    | Route: GET /payment/vnpay/return
    | Name : payment.vnpay.return
    */
    public function vnpayReturn(Request $request)
    {
        $vnp_HashSecret = config('vnpay.vnp_HashSecret');

        $inputData = $request->all();
        $vnp_SecureHash = $inputData['vnp_SecureHash'] ?? '';

        unset($inputData['vnp_SecureHash']);
        unset($inputData['vnp_SecureHashType']);

        ksort($inputData);

        $hashData = '';
        foreach ($inputData as $key => $value) {
            $hashData .= urlencode($key) . '=' . urlencode($value) . '&';
        }
        $hashData = rtrim($hashData, '&');

        $serverHash = hash_hmac('sha512', $hashData, $vnp_HashSecret);

        if ($serverHash !== $vnp_SecureHash) {
            abort(400, 'Sai checksum! Giao dịch không hợp lệ.');
        }

        // ✅ Checksum hợp lệ
        $booking = Booking::findOrFail($request->vnp_TxnRef);

        if ($request->vnp_ResponseCode === '00') {

            $booking->update([
                'status'          => 'paid',
                'prepaid_amount'  => $request->vnp_Amount / 100
            ]);

            Payment::create([
                'booking_id'     => $booking->id,
                'transaction_no' => $request->vnp_TransactionNo,
                'bank_code'      => $request->vnp_BankCode,
                'amount'         => $request->vnp_Amount / 100,
                'status'         => 'success',
                'paid_at'        => now()
            ]);

            return view('payment.success', compact('booking'));
        }

        // ❌ Thanh toán thất bại
        Payment::create([
            'booking_id' => $booking->id,
            'status'     => 'failed'
        ]);

        return view('payment.fail', compact('booking'));
    }
}
