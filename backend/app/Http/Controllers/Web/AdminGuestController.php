<?php

namespace App\Http\Controllers\Web;

use App\Http\Controllers\Controller;
use App\Models\Booking;
use App\Models\BookingGuest;
use App\Models\AssignedRoom;
use App\Models\Room;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class AdminGuestController extends Controller
{
    /**
     * 1️⃣ Xác nhận từng khách (tick checkbox)
     */
    public function verify(Booking $booking, BookingGuest $guest)
    {
        if ($guest->booking_id !== $booking->id) {
            abort(403, 'Guest không thuộc booking này');
        }

        $guest->update(['verified' => true]);

        return back()->with('success', 'Đã xác nhận khách: ' . $guest->name);
    }

    /**
     * 2️⃣ Check-in CUỐI (chỉ khi đã xác nhận đủ khách)
     */
    public function finalCheckin(Request $request, Booking $booking)
    {
        // Chỉ cho check-in khi booking đã paid
        if ($booking->status !== 'paid') {
            abort(403, 'Booking chưa sẵn sàng check-in');
        }

        // Kiểm tra ngày
        if (Carbon::today()->toDateString() !== $booking->check_in) {
            abort(403, 'Không đúng ngày check-in');
        }

        // Kiểm tra giờ (06:00 – 22:00)
        $hour = Carbon::now()->hour;
        if ($hour < 6 || $hour > 22) {
            abort(403, 'Ngoài khung giờ cho phép check-in');
        }

        // Kiểm tra đủ khách hay chưa
        $expectedGuests = $booking->adults + $booking->children;

        $verifiedGuests = $booking->guests()
            ->where('verified', true)
            ->count();

        if ($verifiedGuests !== $expectedGuests) {
            abort(422, 'Chưa xác nhận đủ khách');
        }

        DB::transaction(function () use ($booking) {

            // Cập nhật booking
            $booking->update([
                'status'        => 'in_use',
                'checked_in_at' => now()
            ]);

            // Assigned room
            $assignedRoom = AssignedRoom::where('booking_id', $booking->id)
                ->where('status', 'assigned')
                ->firstOrFail();

            $assignedRoom->update([
                'status'        => 'in_use',
                'checked_in_at' => now()
            ]);

            // Khóa phòng vật lý
            Room::where('room_id', $assignedRoom->room_id)->update([
                'room_status'         => 'đang sử dụng',
                'current_booking_id' => $booking->id
            ]);
        });

        return back()->with('success', 'Check-in hoàn tất, khách đã nhận phòng');
    }
}
