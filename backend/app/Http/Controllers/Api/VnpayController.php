<?
namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Booking;

class VnpayController extends Controller
{
    public function handleReturn(Request $request)
    {
        $vnp_HashSecret = config('vnpay.hash_secret');
        $inputData = $request->all();

        $secureHash = $inputData['vnp_SecureHash'];
        unset($inputData['vnp_SecureHash'], $inputData['vnp_SecureHashType']);

        ksort($inputData);
        $hashData = urldecode(http_build_query($inputData));
        $checkHash = hash_hmac('sha512', $hashData, $vnp_HashSecret);

        if ($checkHash !== $secureHash) {
            return redirect(env('FRONTEND_URL') . '/payment/fail');
        }

        // Lấy booking_id từ TxnRef
        [$bookingId] = explode('_', $inputData['vnp_TxnRef']);
        $booking = Booking::findOrFail($bookingId);


        if ($inputData['vnp_ResponseCode'] === '00') {
            $booking->update([
                'status' => Booking::STATUS_PAID,
                'paid_at' => now(),
                'payment_method' => 'vnpay',
            ]);

            return redirect(env('FRONTEND_URL') . '/payment/success');
        }

        return redirect(env('FRONTEND_URL') . '/payment/fail');
    }
}
