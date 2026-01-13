<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Cache;

/*
|--------------------------------------------------------------------------
| MODELS
|--------------------------------------------------------------------------
*/
use App\Models\Booking;
use App\Models\ServiceInvoice;
use App\Models\DamageType;
use App\Models\DamageInvoice;
use App\Models\Penalty;
use App\Models\AssignedRoom;
use App\Http\Controllers\Api\PaymentController;

/*
|--------------------------------------------------------------------------
| AdminCheckoutController
|--------------------------------------------------------------------------
| FULL CHECK-OUT FLOW (API-ONLY)
|
| 1. Thêm thiệt hại (0..n)
| 2. Thêm penalty (trả phòng trễ)
| 3. Xác nhận checkout (BẮT BUỘC)
| 4. Xem tổng tiền
| 5. Thanh toán:
|    - CASH  -> checkout ngay
|    - VNPAY -> gọi PaymentController
| 6. Hoàn tất checkout + mở phòng
|
| KHÔNG xử lý booking payment ban đầu
| KHÔNG sửa DB
|--------------------------------------------------------------------------
*/

class AdminCheckoutController extends Controller
{
    /* =========================================================
     * NOTE: Damage and Penalty endpoints moved to dedicated controllers:
     * - AdminDamageController
     * - AdminPenaltyController
     * This controller now only handles confirm/summary/pay/complete checkout flows.
     * ========================================================= */

    /* =========================================================
     * 3. CONFIRM CHECKOUT (BẮT BUỘC)
     * POST /api/admin/bookings/{id}/checkout/confirm
     * ========================================================= */
    public function confirmCheckout($id)
    {
        $booking = Booking::findOrFail($id);

        if ($booking->status !== Booking::STATUS_IN_USE) {
            return response()->json(['success' => false, 'message' => 'Chưa sẵn sàng checkout'], 400);
        }

        // dùng cache làm cờ xác nhận
        Cache::put("checkout_confirmed_{$id}", true, now()->addMinutes(60));

        return response()->json([
            'success' => true,
            'message' => 'Đã xác nhận checkout'
        ]);
    }

    /* =========================================================
     * 4. CHECKOUT SUMMARY (TÍNH TIỀN)
     * GET /api/admin/bookings/{id}/checkout/summary
     * ========================================================= */
    public function summary($id)
    {
        $booking = Booking::findOrFail($id);

        // 🔥 TIỀN PHÒNG GỐC: LẤY total_price
        $room = (int) ($booking->total_price ?? 0);

        // Tổng service
        $service = (int) ServiceInvoice::where('booking_id', $id)
            ->sum('total_amount');

        // Tổng thiệt hại
        $damage = (int) DamageInvoice::where('booking_id', $id)
            ->sum('amount');

        // Tổng penalty
        $penalty = (int) Penalty::where('booking_id', $id)
            ->sum('amount');

        // Đã trả trước
        $prepaid = (int) ($booking->total_price ?? 0);

        // Tổng cuối cùng
        $final = $room + $service + $damage + $penalty - $prepaid;

        return response()->json([
            'success' => true,
            'data' => [
                'room'    => $room,
                'service' => $service,
                'damage'  => $damage,
                'penalty' => $penalty,
                'prepaid' => $prepaid,
                'final'   => max(0, $final)
            ]
        ]);
    }


    /* =========================================================
     *  Add Damage (upload image immediately)
     * POST /api/admin/bookings/{id}/checkout/damages
     * ========================================================= */
public function addDamages(Request $request, $id)
{
    $booking = Booking::findOrFail($id);

    $data = $request->validate([
        'damage_type_id' => 'required|exists:damage_types,id',
        'description' => 'nullable|string',
        'image' => 'nullable|file|image|max:2048', // hình file
    ]);

    $type = DamageType::find($data['damage_type_id']);

    if (!$type) {
        return response()->json([
            'success' => false,
            'message' => 'Damage type không tồn tại'
        ], 400);
    }

    // Upload file nếu có
    $imagePath = null;
    if ($request->hasFile('image')) {
        $imagePath = $request->file('image')->store('damages', 'public');
    }

    $damage = DamageInvoice::create([
        'booking_id'      => $booking->id,
        'damage_type_id'  => $type->id,
        'amount'          => $type->price,
        'image_path'      => $imagePath, // lưu path
        'description'     => $data['description'] ?? null,
    ]);

    return response()->json([
        'success' => true,
        'data' => $damage
    ], 201);
}



    /* =========================================================
     *  Add Penalty
     * POST /api/admin/bookings/{id}/checkout/penalty
     * ========================================================= */
    public function addPenatis(Request $request, $id)
    {
        $booking = Booking::findOrFail($id);

        $data = $request->validate([
            'days_late' => 'required|integer|min:0',
            'amount' => 'required|numeric|min:0'
        ]);

        $penalty = Penalty::create([
            'booking_id' => $booking->id,
            'days_late' => $data['days_late'],
            'amount' => $data['amount']
        ]);

        return response()->json([
            'success' => true,
            'data' => $penalty
        ], 201);
    }


    /* =========================================================
     * 5. PAY CHECKOUT (CASH / VNPAY)
     * POST /api/admin/bookings/{id}/checkout/pay
     * ========================================================= */
    public function pay(Request $request, $id)
    {
        $booking = Booking::findOrFail($id);

        if (!Cache::get("checkout_confirmed_{$id}")) {
            return response()->json([
                'success' => false,
                'message' => 'Chưa xác nhận checkout'
            ], 400);
        }

        $data = $request->validate([
            'method' => 'required|in:cash,vnpay'
        ]);

        // CASH -> checkout ngay
        if ($data['method'] === 'cash') {
            $this->completeCheckout($booking);
            return response()->json([
                'success' => true,
                'message' => 'Checkout thành công (tiền mặt)'
            ]);
        }

        // VNPAY -> gọi PaymentController (checkout payment)
        $summary = $this->summary($id)->getData(true)['data'];

        return app(PaymentController::class)->createVnpayCheckout(
            new Request([
                'booking_id' => $booking->id,
                'amount'     => $summary['final']
            ])
        );
    }

    /* =========================================================
     * 6. COMPLETE CHECKOUT (CHỈ 1 NƠI DUY NHẤT)
     * ========================================================= */
    public function completeCheckout(Booking $booking)
    {
        DB::transaction(function () use ($booking) {

            // đóng booking
            $booking->update(['status' => Booking::STATUS_CHECK_OUT]);

            // mở lại phòng (đánh dấu assigned rooms đã checked out)
            AssignedRoom::where('booking_id', $booking->id)
                ->update(['status' => \App\Models\AssignedRoom::STATUS_CHECKED_OUT]);

            // cập nhật trạng thái thực tế của room về available
            $roomIds = AssignedRoom::where('booking_id', $booking->id)
                ->pluck('room_id')
                ->filter()
                ->unique()
                ->toArray();

            if (!empty($roomIds)) {
                \App\Models\Room::whereIn('room_id', $roomIds)
                    ->update(['room_status' => \App\Models\Room::STATUS_AVAILABLE]);
            }

            // xóa cờ xác nhận
            Cache::forget("checkout_confirmed_{$booking->id}");
        });
    }
}