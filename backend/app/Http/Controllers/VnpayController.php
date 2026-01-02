<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Payment;
use App\Models\Booking;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class VnpayController extends Controller
{
    public function callback(Request $request)
    {
        // 1️⃣ Lấy toàn bộ dữ liệu VNPay gửi về
        $vnpData = $request->all();

        // 2️⃣ Lấy SecureHash VNPay gửi
        $vnpSecureHash = $vnpData['vnp_SecureHash'] ?? null;
        unset($vnpData['vnp_SecureHash'], $vnpData['vnp_SecureHashType']);

        // 3️⃣ Chỉ lấy các key bắt đầu bằng vnp_
        ksort($vnpData);

        $hashData = [];
        foreach ($vnpData as $key => $value) {
            if (str_starts_with($key, 'vnp_')) {
                $hashData[] = $key . '=' . $value;
            }
        }

        $hashString = implode('&', $hashData);

        // 4️⃣ Tạo checksum phía server
        $calculatedHash = hash_hmac(
            'sha512',
            $hashString,
            config('vnpay.hash_secret')
        );

        // 5️⃣ So sánh checksum
        if ($calculatedHash !== $vnpSecureHash) {
            Log::warning('VNPay checksum mismatch', $vnpData);
            abort(403, 'Invalid checksum');
        }

        // 6️⃣ Kiểm tra kết quả giao dịch
        $responseCode = $vnpData['vnp_ResponseCode'] ?? null;
        $bookingId    = $vnpData['vnp_TxnRef'] ?? null;
        $amount       = ($vnpData['vnp_Amount'] ?? 0) / 100;

        $booking = Booking::findOrFail($bookingId);

        DB::transaction(function () use (
            $responseCode,
            $vnpData,
            $booking,
            $amount
        ) {

            // 7️⃣ Lưu payment
            $payment = Payment::create([
                'booking_id'        => $booking->id,
                'payment_type'      => 'room_prepaid',
                'transaction_no'    => $vnpData['vnp_TransactionNo'] ?? null,
                'bank_code'         => $vnpData['vnp_BankCode'] ?? null,
                'vnp_response_code' => $responseCode,
                'amount'            => $amount,
                'status'            => $responseCode === '00' ? 'success' : 'failed',
                'paid_at'           => $responseCode === '00' ? now() : null,
                'note'              => 'VNPay callback'
            ]);

            // 8️⃣ Nếu thanh toán thành công → cập nhật booking
            if ($responseCode === '00') {

                $booking->update([
                    'prepaid_amount' => $booking->prepaid_amount + $amount,
                    'paid_amount'    => $booking->paid_amount + $amount,
                    'status'         => 'paid'
                ]);
            }
        });

        // 9️⃣ Redirect kết quả cho user
        return redirect()->route('booking.result', [
            'status' => $responseCode === '00' ? 'success' : 'failed'
        ]);
    }
}
