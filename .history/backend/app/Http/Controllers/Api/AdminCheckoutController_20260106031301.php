<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

// Models
use App\Models\Booking;
use App\Models\AssignedRoom;
use App\Models\Room;
use App\Models\ServiceCharge;
use App\Models\PenaltyCharge;

class AdminCheckoutController extends Controller
{
    /* =========================================================
     * POST /api/admin/bookings/{id}/checkout
     * Admin check-out (final accounting)
     * ========================================================= */
    public function checkout(Request $request, $id)
    {
        /**
         * 1. AUTH + ROLE CHECK (ADMIN)
         * Giả định User có field is_admin = true
         */
        $user = $request->user();
        if (!$user || !$user->is_admin) {
            return $this->forbidden();
        }

        /**
         * 2. LOAD BOOKING
         */
        $booking = Booking::find($id);
        if (!$booking) {
            return $this->error(
                'BOOKING_NOT_FOUND',
                'Không tìm thấy booking',
                404
            );
        }

        if ($booking->status !== 'checked_in') {
            return $this->error(
                'INVALID_BOOKING_STATUS',
                'Chỉ check-out khi booking đang lưu trú'
            );
        }

        /**
         * 3. TÍNH TOÁN TỔNG TIỀN
         * - Tiền phòng: booking.total_price
         * - Dịch vụ: sum(service_charges.total_price)
         * - Phạt: sum(penalty_charges.amount)
         */
        $roomTotal    = (float) $booking->total_price;

        $serviceTotal = (float) ServiceCharge::where('booking_id', $booking->id)
            ->sum('total_price');

        $penaltyTotal = (float) PenaltyCharge::where('booking_id', $booking->id)
            ->sum('amount');

        $grandTotal = $roomTotal + $serviceTotal + $penaltyTotal;

        /**
         * 4. TRANSACTION CHECK-OUT
         */
        DB::beginTransaction();
        try {
            // 4.1 Cập nhật booking
            $booking->update([
                'status' => 'checked_out'
                // Nếu có cột snapshot tổng tiền cuối, lưu tại đây
                // 'final_total' => $grandTotal
            ]);

            // 4.2 Giải phóng phòng
            $assignedRooms = AssignedRoom::where('booking_id', $booking->id)->get();

            foreach ($assignedRooms as $ar) {
                // cập nhật thời điểm check-out
                $ar->update([
                    'check_out_at' => now()
                ]);

                // mở lại phòng
                $room = Room::find($ar->room_id);
                if ($room) {
                    $room->update(['status' => 'available']);
                }
            }

            DB::commit();

            return $this->success([
                'booking_id'   => $booking->id,
                'status'       => 'checked_out',
                'summary' => [
                    'room_total'    => $roomTotal,
                    'service_total' => $serviceTotal,
                    'penalty_total' => $penaltyTotal,
                    'grand_total'   => $grandTotal
                ]
            ]);

        } catch (\Exception $e) {
            DB::rollBack();
            return $this->error(
                'CHECKOUT_FAILED',
                'Không thể thực hiện check-out'
            );
        }
    }

    /* =========================================================
     * HELPER RESPONSES (Refile-safe)
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

    private function forbidden()
    {
        return $this->error(
            'FORBIDDEN',
            'Bạn không có quyền thực hiện thao tác này',
            403
        );
    }
}
