<?php

namespace App\Http\Controllers\Web;

use App\Http\Controllers\Controller;
use App\Models\Booking;
use Illuminate\Http\Request;

class PaymentController extends Controller
{
    // Hiển thị trang checkout
    public function checkout($booking_id)
    {
        $booking = Booking::findOrFail($booking_id);

        return view('payment.checkout', compact('booking'));
    }

    // Xử lý thanh toán fake (manual payment)
    public function process(Request $request, $booking_id)
    {
        $booking = Booking::findOrFail($booking_id);

        // Loại thanh toán: vnpay / momo / paypal / fake
        $method = $request->payment_method ?? 'fake';

        switch($method) {
            case 'vnpay':
                return $this->vnPayFake($booking);
            case 'momo':
                return $this->moMoFake($booking);
            case 'paypal':
                return $this->payPalFake($booking);
            default:
                // thanh toán manual/fake
                $booking->update(['payment_status' => 'paid', 'payment_method' => 'manual']);
                return view('payment.success', compact('booking'));
        }
    }

    // Fake VNPay
    private function vnPayFake(Booking $booking)
    {
        // Fake redirect VNPay: chỉ simulate
        $booking->update(['payment_status' => 'paid', 'payment_method' => 'vnpay']);
        return view('payment.success', compact('booking'));
    }

    // Fake MoMo
    private function moMoFake(Booking $booking)
    {
        $booking->update(['payment_status' => 'paid', 'payment_method' => 'momo']);
        return view('payment.success', compact('booking'));
    }

    // Fake PayPal
    private function payPalFake(Booking $booking)
    {
        $booking->update(['payment_status' => 'paid', 'payment_method' => 'paypal']);
        return view('payment.success', compact('booking'));
    }
}
