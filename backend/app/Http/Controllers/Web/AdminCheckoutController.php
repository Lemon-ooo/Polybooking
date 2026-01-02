<?php

namespace App\Http\Controllers\Web;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Models\Booking;
use App\Models\AssignedRoom;
use App\Models\Room;
use App\Models\CheckoutPhoto;

class AdminCheckoutController extends Controller
{
    public function checkout(Request $request, Booking $booking)
    {
        // 1️⃣ Chỉ cho checkout khi đang ở
        if ($booking->status !== 'in_use') {
            abort(403, 'Booking không ở trạng thái đang sử dụng');
        }

        // 2️⃣ Kiểm tra đã thanh toán đủ hay chưa
        $totalMustPay =
              $booking->room_price
            + $booking->service_total
            + $booking->damage_total;

        if ($booking->paid_amount < $totalMustPay) {
            abort(422, 'Chưa thanh toán đủ, không thể checkout');
        }

        // 3️⃣ BẮT BUỘC upload ảnh phòng
        if (!$request->hasFile('photos')) {
            abort(422, 'Phải upload ít nhất 1 ảnh tình trạng phòng');
        }

        DB::transaction(function () use ($booking, $request) {

            // 4️⃣ Cập nhật booking
            $booking->update([
                'status'         => 'check_out',
                'checked_out_at' => now()
            ]);

            // 5️⃣ Cập nhật assigned_rooms
            $assignedRoom = AssignedRoom::where('booking_id', $booking->id)
                ->whereIn('status', ['in_use', 'checkout_pending'])
                ->first();

            if ($assignedRoom) {
                $assignedRoom->update([
                    'status'          => 'checked_out',
                    'checked_out_at'  => now()
                ]);

                // 6️⃣ Mở lại phòng
                Room::where('room_id', $assignedRoom->room_id)->update([
                    'room_status'        => 'trống',
                    'current_booking_id'=> null
                ]);
            }

            // 7️⃣ Lưu ảnh tình trạng phòng
            foreach ($request->file('photos') as $photo) {
                $path = $photo->store('checkout_photos', 'public');

                CheckoutPhoto::create([
                    'booking_id' => $booking->id,
                    'image_path' => $path
                ]);
            }
        });

        return back()->with('success', 'Checkout hoàn tất, phòng đã được trả');
    }
}
