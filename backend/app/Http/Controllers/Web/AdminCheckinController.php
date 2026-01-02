<?php

namespace App\Http\Controllers\Web;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Models\Booking;
use App\Models\AssignedRoom;
use App\Models\Room;
use App\Models\BookingGuest;
use Carbon\Carbon;

class AdminCheckinController extends Controller
{
    /*
    |--------------------------------------------------------------------------
    | GET: Trang check-in (HIỂN THỊ FORM)
    |--------------------------------------------------------------------------
    */
    public function show(Booking $booking)
    {

        if ($booking->status !== 'paid') {
            return redirect()
                ->route('admin.bookings.index')
                ->with('error', 'Booking đã check-in hoặc không hợp lệ');
        }

        $booking->load('guests');

        $expectedTotal = (int) $booking->adults + (int) $booking->children;

        // 🔥 Nếu đang THỪA guest → XÓA BỚT
        if ($booking->guests->count() > $expectedTotal) {
            $booking->guests
                ->sortByDesc('id') // xóa mấy cái sinh sau
                ->take($booking->guests->count() - $expectedTotal)
                ->each
                ->delete();
        }

        // Reload lại sau khi xóa
        $booking->load('guests');

        // 🔥 Nếu đang THIẾU → TẠO BÙ
        if ($booking->guests->count() < $expectedTotal) {
            $toCreate = $expectedTotal - $booking->guests->count();

            BookingGuest::insert(
                array_fill(0, $toCreate, [
                    'booking_id' => $booking->id,
                    'verified'   => false,
                    'created_at' => now(),
                    'updated_at' => now(),
                ])
            );
        }

        $booking->load('guests');

        return view('admin.bookings.checkin', [
            'booking'  => $booking,
            'guests'   => $booking->guests,
            'adults'   => $booking->adults,
            'children' => $booking->children,
        ]);
    }



    /*
    |--------------------------------------------------------------------------
    | POST: Xác nhận check-in
    |--------------------------------------------------------------------------
    */
    public function checkin(Request $request, Booking $booking)
    {

        if ($booking->status !== 'paid') {
            return redirect()->route('admin.bookings.index')
                ->with('error', 'Booking chưa sẵn sàng check-in');
        }

        if (Carbon::today()->lt(Carbon::parse($booking->check_in))) {
            return redirect()->route('admin.bookings.index')
                ->with('error', 'Chưa đến ngày check-in');
        }

        $hour = Carbon::now()->hour;
        if ($hour < 6 || $hour > 22) {
            return redirect()->route('admin.bookings.index')
                ->with('error', 'Ngoài thời gian cho phép check-in');
        }

        // ✅ Validate trước
        foreach ($booking->guests as $guest) {
            if (!isset($request->guests[$guest->id]['verified'])) {
                return redirect()->back()
                    ->with('error', 'Chưa xác nhận đủ tất cả khách');
            }
        }

        // Tìm assigned room trước khi bắt đầu transaction — nếu không có
        // sẽ trả về thông báo lỗi thay vì ném ModelNotFound -> 404
        $assignedRoom = AssignedRoom::where('booking_id', $booking->id)
            ->where('status', 'assigned')
            ->first();

        if (!$assignedRoom) {
            return redirect()->route('admin.bookings.index')
                ->with('error', 'Không tìm thấy phòng đã được gán cho booking này');
        }

        DB::transaction(function () use ($booking, $request, $assignedRoom) {

            foreach ($booking->guests as $guest) {
                $guest->update([
                    'name'     => $request->guests[$guest->id]['name'],
                    'age'      => $request->guests[$guest->id]['age'],
                    'verified' => true,
                ]);
            }

            $booking->update([
                'status'        => 'in_use',
                'checked_in_at' => now(),
            ]);

            $assignedRoom->update([
                'status'        => 'in_use',
                'checked_in_at' => now(),
            ]);

            Room::where('room_id', $assignedRoom->room_id)->update([
                'room_status'         => 'đang sử dụng',
                'current_booking_id' => $booking->id,
            ]);
        });

        return redirect()
            ->route('admin.bookings.index')
            ->with('success', 'Check-in thành công');
    }
}
