<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

use App\Models\Booking;
use App\Models\Service;
use App\Models\ServiceInvoice;
use App\Models\ServiceCharge;

class AdminServiceController extends Controller
{
    /**
     * Thêm dịch vụ cho booking (sau check-in)
     */
    public function addService(Request $request, $bookingId)
    {
        // 1. Lấy booking
        $booking = Booking::findOrFail($bookingId);

        // 2. Kiểm tra trạng thái booking
        if ($booking->status !== Booking::STATUS_IN_USE) {
            return response()->json([
                'success' => false,
                'message' => 'Booking chưa in_use, không thể thêm dịch vụ'
            ], 400);
        }

        // 3. Validate input
        $validated = $request->validate([
            'services' => 'required|array|min:1',
            'services.*.service_id' => 'required|exists:services,service_id',
            'services.*.quantity' => 'required|integer|min:1'
        ]);

        DB::beginTransaction();

        try {
            // 4. Lấy hoặc tạo service_invoice
            $invoice = ServiceInvoice::firstOrCreate(
                ['booking_id' => $booking->id],
                ['total_amount' => 0]
            );

            $addedTotal = 0;

            // 5. Thêm từng dịch vụ
            foreach ($validated['services'] as $item) {

                $service = Service::where('service_id', $item['service_id'])->firstOrFail();

                $price  = (int) $service->service_price;
                $qty    = $item['quantity'];
                $amount = $price * $qty;

                ServiceCharge::create([
                    'service_invoice_id' => $invoice->id,
                    'service_id'         => $service->service_id,
                    'quantity'           => $qty,
                    'price'              => $price,
                    'amount'             => $amount
                ]);

                $addedTotal += $amount;
            }

            // 6. Cập nhật tổng tiền invoice
            $invoice->increment('total_amount', $addedTotal);

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Thêm dịch vụ thành công',
                'data' => [
                    'service_invoice_id' => $invoice->id,
                    'added_amount'       => $addedTotal,
                    'total_amount'       => $invoice->fresh()->total_amount
                ]
            ]);

        } catch (\Exception $e) {
            DB::rollBack();

            return response()->json([
                'success' => false,
                'message' => 'Lỗi khi thêm dịch vụ',
                'error'   => $e->getMessage()
            ], 500);
        }
    }
}
