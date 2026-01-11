<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

// Models
use App\Models\Booking;
use App\Models\DamageType;
use App\Models\PenaltyCharge;

class AdminPenaltyController extends Controller
{
    /* =========================================================
     * POST /api/admin/bookings/{id}/penalties
     * Ghi nhận hư hỏng / phạt
     * ========================================================= */
    public function addPenalty(Request $request, $id)
    {
        $user = $request->user();
        if (!$user || !$user->is_admin) {
            return $this->forbidden();
        }

        try {
            $validated = $request->validate([
                'penalties' => 'required|array|min:1',
                'penalties.*.damage_type_id' => 'required|exists:damage_types,id',
                'penalties.*.amount' => 'nullable|numeric|min:0',
                'penalties.*.note'   => 'nullable|string|max:255'
            ]);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return $this->validationError($e->errors());
        }

        $booking = Booking::find($id);
        if (!$booking) {
            return $this->error('BOOKING_NOT_FOUND', 'Không tìm thấy booking', 404);
        }

        if ($booking->status !== Booking::STATUS_IN_USE) {
            return $this->error(
                'INVALID_BOOKING_STATUS',
                'Chỉ ghi nhận phạt khi khách đang lưu trú'
            );
        }

        DB::beginTransaction();
        try {
            $lines = [];

            foreach ($validated['penalties'] as $item) {
                $damage = DamageType::find($item['damage_type_id']);
                if (!$damage) {
                    throw new \Exception('DAMAGE_TYPE_NOT_FOUND');
                }

                $amount = $item['amount'] ?? $damage->default_amount;

                PenaltyCharge::create([
                    'booking_id'     => $booking->id,
                    'damage_type_id' => $damage->id,
                    'amount'         => $amount,
                    'note'           => $item['note'] ?? null
                ]);

                $lines[] = [
                    'damage' => $damage->name,
                    'amount' => $amount
                ];
            }

            DB::commit();

            return $this->success([
                'booking_id' => $booking->id,
                'penalties'  => $lines
            ]);

        } catch (\Exception $e) {
            DB::rollBack();
            return $this->error('PENALTY_ADD_FAILED', 'Không thể ghi nhận phạt');
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
