<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

// Models
use App\Models\Booking;
use App\Models\Service;
use App\Models\ServiceCharge;

class AdminServiceController extends Controller
{
    /* =========================================================
     * POST /api/admin/bookings/{id}/services
     * Ghi nhận dịch vụ phát sinh
     * ========================================================= */
    public function addService(Request $request, $id)
    {
        $user = $request->user();
        if (!$user || !$user->is_admin) {
            return $this->forbidden();
        }

        try {
            $validated = $request->validate([
                'services' => 'required|array|min:1',
                'services.*.service_id' => 'required|exists:services,id',
                'services.*.quantity'   => 'required|integer|min:1'
            ]);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return $this->validationError($e->errors());
        }

        $booking = Booking::find($id);
        if (!$booking) {
            return $this->error('BOOKING_NOT_FOUND', 'Không tìm thấy booking', 404);
        }

        if ($booking->status !== 'checked_in') {
            return $this->error(
                'INVALID_BOOKING_STATUS',
                'Chỉ ghi nhận dịch vụ khi khách đang lưu trú'
            );
        }

        DB::beginTransaction();
        try {
            $lines = [];

            foreach ($validated['services'] as $item) {
                $service = Service::find($item['service_id']);
                if (!$service) {
                    throw new \Exception('SERVICE_NOT_FOUND');
                }

                $lineTotal = $service->price * $item['quantity'];

                $charge = ServiceCharge::create([
                    'booking_id'  => $booking->id,
                    'service_id'  => $service->id,
                    'quantity'    => $item['quantity'],
                    'unit_price'  => $service->price,
                    'total_price' => $lineTotal
                ]);

                $lines[] = [
                    'service' => $service->name,
                    'quantity'=> $item['quantity'],
                    'total'   => $lineTotal
                ];
            }

            DB::commit();

            return $this->success([
                'booking_id' => $booking->id,
                'services'   => $lines
            ]);

        } catch (\Exception $e) {
            DB::rollBack();
            return $this->error('SERVICE_ADD_FAILED', 'Không thể ghi nhận dịch vụ');
        }
    }

    /* ================= HELPERS ================= */

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

    private function forbidden()
    {
        return $this->error('FORBIDDEN', 'Không có quyền truy cập', 403);
    }

    private function validationError($details)
    {
        return response()->json([
            'success' => false,
            'error' => [
                'code'    => 'VALIDATION_ERROR',
                'message' => 'Dữ liệu không hợp lệ',
                'details' => $details
            ]
        ], 422);
    }
}
