<?
namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Booking;

class BookingPaymentController extends Controller
{
    public function createVnpay(Request $request, Booking $booking)
    {
        // 1. Kiểm tra trạng thái
        if ($booking->status !== 'pending_payment') {
            return response()->json([
                'message' => 'Booking không hợp lệ để thanh toán'
            ], 400);
        }

        // 2. Thông tin VNPAY
        $vnp_TmnCode = config('vnpay.tmn_code');
        $vnp_HashSecret = config('vnpay.hash_secret');
        $vnp_Url = config('vnpay.url');
        $vnp_ReturnUrl = config('vnpay.return_url');

        // 3. Tạo dữ liệu
        $vnp_TxnRef = $booking->id . '_' . time();
        $vnp_Amount = $booking->total_price * 100;

        $inputData = [
            "vnp_Version" => "2.1.0",
            "vnp_Command" => "pay",
            "vnp_TmnCode" => $vnp_TmnCode,
            "vnp_Amount" => $vnp_Amount,
            "vnp_CurrCode" => "VND",
            "vnp_TxnRef" => $vnp_TxnRef,
            "vnp_OrderInfo" => "Thanh toán booking #" . $booking->id,
            "vnp_OrderType" => "billpayment",
            "vnp_Locale" => "vn",
            "vnp_ReturnUrl" => $vnp_ReturnUrl,
            "vnp_IpAddr" => $request->ip(),
            "vnp_CreateDate" => now()->format('YmdHis'),
        ];

        // 4. Sort + hash
        ksort($inputData);
        $hashData = urldecode(http_build_query($inputData));
        $vnpSecureHash = hash_hmac('sha512', $hashData, $vnp_HashSecret);

        // 5. URL thanh toán
        $paymentUrl = $vnp_Url . '?' . http_build_query($inputData)
            . '&vnp_SecureHash=' . $vnpSecureHash;

        return response()->json([
            'payment_url' => $paymentUrl
        ]);
    }
}
