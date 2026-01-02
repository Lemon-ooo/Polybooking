<?php

namespace App\Http\Controllers\Web;

use App\Http\Controllers\Controller;
use App\Models\Booking;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class AdminServiceController extends Controller
{
    /**
     * Thêm dịch vụ phát sinh
     */
    public function addService(Request $request, Booking $booking)
    {
        if ($booking->status !== 'in_use') {
            abort(403, 'Chỉ thêm dịch vụ khi khách đang ở');
        }

        $request->validate([
            'service_name' => 'required|string',
            'price'        => 'required|integer|min:0',
        ]);

        DB::transaction(function () use ($booking, $request) {

            // Cộng tiền dịch vụ
            $booking->increment('service_total', $request->price);
            $booking->increment('total_price', $request->price);
        });

        return back()->with(
            'success',
            'Đã thêm dịch vụ: ' . $request->service_name
        );
    }

    /**
     * Ghi nhận thiệt hại
     */
    public function addDamage(Request $request, Booking $booking)
    {
        if ($booking->status !== 'in_use') {
            abort(403, 'Chỉ ghi nhận thiệt hại khi khách đang ở');
        }

        $request->validate([
            'description' => 'required|string',
            'cost'        => 'required|integer|min:0',
        ]);

        DB::transaction(function () use ($booking, $request) {

            // Cộng tiền thiệt hại
            $booking->increment('damage_total', $request->cost);
            $booking->increment('total_price', $request->cost);
        });

        return back()->with(
            'success',
            'Đã ghi nhận thiệt hại: ' . $request->description
        );
    }
}
