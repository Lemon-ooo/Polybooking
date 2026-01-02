<?php

namespace App\Http\Controllers\Web;

use App\Http\Controllers\Controller;
use App\Models\Booking;
use App\Models\AssignedRoom;
use Illuminate\Http\Request;

class BookingAdminController extends Controller
{
    // Danh sách booking đã thanh toán
    public function index()
    {
        $bookings = Booking::where('status', 'paid')->get();
        return view('admin.bookings.index', compact('bookings'));
    }

    // Trang check-in
    public function checkinPage($id)
    {
        $booking = Booking::with('guests')->findOrFail($id);
        return view('admin.bookings.checkin', compact('booking'));
    }

    // Xác nhận check-in
    public function doCheckin($id)
    {
        $booking = Booking::with('assignedRooms')->findOrFail($id);

        // Kiểm tra đã verified hết khách
        if ($booking->guests->where('verified', false)->count() > 0) {
            return back()->with('error', 'Chưa xác minh đủ khách.');
        }

        // Cập nhật trạng thái phòng
        foreach ($booking->assignedRooms as $r) {
            $r->room->update(['room_status' => 'đang sử dụng']);
        }

        $booking->update(['status' => 'in_use']);

        return redirect()->route('admin.bookings.index')->with('success', 'Check-in thành công');
    }

    // Trang check-out
    public function checkoutPage($id)
    {
        $booking = Booking::with(['serviceInvoice', 'damageInvoices'])->findOrFail($id);
        return view('admin.bookings.checkout', compact('booking'));
    }

    // Xác nhận check-out
    public function doCheckout($id)
    {
        $booking = Booking::findOrFail($id);

        $booking->update(['status' => 'check_out']);

        // Mở lại phòng
        AssignedRoom::where('booking_id', $id)
            ->each(fn($r) => $r->room->update(['room_status' => 'trống']));

        return redirect()->route('admin.bookings.index')->with('success', 'Check-out hoàn tất');
    }
    // 1. Booking chờ check-in
    public function paid()
    {
        $bookings = Booking::where('status', 'paid')->get();
        return view('admin.bookings.paid', compact('bookings'));
    }

    // 2. Booking đang ở
    public function inUse()
    {
        $bookings = Booking::where('status', 'in_use')->get();
        return view('admin.bookings.in_use', compact('bookings'));
    }

    // 3. Booking đã check-out
    public function checkedOut()
    {
        $bookings = Booking::where('status', 'check_out')->get();
        return view('admin.bookings.checked_out', compact('bookings'));
    }
    public function show($id)
    {
        $booking = Booking::with([
            'user',
            'roomType',
            'assignedRooms',
            'payments',
            'serviceInvoice',
            'damageInvoices'
        ])->findOrFail($id);

        return view('admin.bookings.show', compact('booking'));
    }
}
