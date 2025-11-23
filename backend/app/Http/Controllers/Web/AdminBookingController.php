<?php

namespace App\Http\Controllers\Web;

use App\Http\Controllers\Controller;
use App\Models\AssignedRoom;
use App\Models\Booking;
use App\Models\PenaltyCharge;
use App\Models\Room;
use App\Models\RoomType;
use App\Models\Service;
use App\Models\ServiceCharge;
use App\Services\BookingAdminService;
use Illuminate\Http\Request;
use RuntimeException;

class AdminBookingController extends Controller
{
    /**
     * Danh sách tất cả booking (admin)
     * Có thể sau này thêm filter theo status, ngày, user...
     */
    public function index(Request $request)
    {
        $query = Booking::with(['user', 'items.roomType']);

        if ($status = $request->get('status')) {
            $query->where('status', $status);
        }

        $bookings = $query->orderByDesc('created_at')->paginate(20);

        return view('admin.bookings.index', compact('bookings'));
    }

    /**
     * Chi tiết booking cho admin
     * Hiển thị:
     *  - thông tin booking
     *  - items (room_types)
     *  - assigned rooms
     *  - service charges
     *  - penalty charges
     *  - form gán phòng
     *  - form thêm dịch vụ
     *  - form thêm phạt
     */
    public function show($booking_id)
    {
        $booking = Booking::with([
                'user',
                'items.roomType',
                'assignedRooms.room',
                'serviceCharges.service',
                'penaltyCharges',
            ])
            ->findOrFail($booking_id);

        // Lấy danh sách phòng theo từng room_type để admin chọn khi gán
        $roomTypes  = RoomType::with('rooms')->get();
        $services   = Service::orderBy('service_name')->get(); // theo migrate trước bro dùng sevice_name

        return view('admin.bookings.show', compact('booking', 'roomTypes', 'services'));
    }

    /**
     * Chuyển booking sang trạng thái paid
     */
    public function markPaid($booking_id, BookingAdminService $service)
    {
        $booking = Booking::findOrFail($booking_id);

        try {
            $service->markAsPaid($booking);
        } catch (RuntimeException $e) {
            return back()->withErrors(['booking_error' => $e->getMessage()]);
        }

        return back()->with('success', 'Cập nhật trạng thái booking sang paid thành công.');
    }

    /**
     * Gán phòng cụ thể cho booking
     *
     * Form sẽ gửi:
     *  assigned_rooms[booking_item_id][] = room_id
     */
    public function assignRooms(Request $request, $booking_id, BookingAdminService $service)
    {
        $booking = Booking::with('items')->findOrFail($booking_id);

        $data = $request->validate([
            'assigned_rooms'   => ['required', 'array'],
            'assigned_rooms.*' => ['array'],
        ], [
            'assigned_rooms.required' => 'Vui lòng chọn phòng để gán cho từng loại phòng.',
        ]);

        try {
            $service->assignRooms($booking, $data['assigned_rooms']);
        } catch (RuntimeException $e) {
            return back()->withErrors(['booking_error' => $e->getMessage()]);
        } catch (\Throwable $e) {
            return back()->withErrors(['booking_error' => 'Có lỗi xảy ra khi gán phòng.']);
        }

        return back()->with('success', 'Gán phòng thành công, booking đã được xác nhận (confirmed).');
    }

    /**
     * Thêm dịch vụ phát sinh cho booking
     */
    public function addServiceCharge(Request $request, $booking_id, BookingAdminService $service)
    {
        $booking = Booking::findOrFail($booking_id);

        $data = $request->validate([
            'service_id' => ['required', 'integer', 'exists:services,service_id'],
            'quantity'   => ['required', 'integer', 'min:1'],
            'price'      => ['nullable', 'numeric', 'min:0'],
        ]);

        try {
            $service->addServiceCharge($booking, $data);
        } catch (RuntimeException $e) {
            return back()->withErrors(['service_error' => $e->getMessage()]);
        } catch (\Throwable $e) {
            return back()->withErrors(['service_error' => 'Có lỗi xảy ra khi thêm dịch vụ.']);
        }

        return back()->with('success', 'Thêm dịch vụ thành công.');
    }

    /**
     * Xoá một service charge
     */
    public function deleteServiceCharge($booking_id, $service_charge_id, BookingAdminService $service)
    {
        $booking = Booking::findOrFail($booking_id);

        /** @var ServiceCharge $charge */
        $charge = ServiceCharge::where('service_charge_id', $service_charge_id)
            ->where('booking_id', $booking->booking_id)
            ->firstOrFail();

        try {
            $service->deleteServiceCharge($charge);
        } catch (\Throwable $e) {
            return back()->withErrors(['service_error' => 'Có lỗi khi xóa dịch vụ.']);
        }

        return back()->with('success', 'Xóa dịch vụ phát sinh thành công.');
    }

    /**
     * Thêm penalty (phí phạt) cho booking
     */
    public function addPenalty(Request $request, $booking_id, BookingAdminService $service)
    {
        $booking = Booking::findOrFail($booking_id);

        $data = $request->validate([
            'description' => ['nullable', 'string'],
            'amount'      => ['required', 'numeric', 'min:0.01'],
        ]);

        try {
            $service->addPenalty($booking, $data);
        } catch (RuntimeException $e) {
            return back()->withErrors(['penalty_error' => $e->getMessage()]);
        } catch (\Throwable $e) {
            return back()->withErrors(['penalty_error' => 'Có lỗi xảy ra khi thêm phí phạt.']);
        }

        return back()->with('success', 'Thêm phí phạt thành công.');
    }

    /**
     * Xoá penalty
     */
    public function deletePenalty($booking_id, $penalty_id, BookingAdminService $service)
    {
        $booking = Booking::findOrFail($booking_id);

        /** @var PenaltyCharge $penalty */
        $penalty = PenaltyCharge::where('penalty_id', $penalty_id)
            ->where('booking_id', $booking->booking_id)
            ->firstOrFail();

        try {
            $service->deletePenalty($penalty);
        } catch (\Throwable $e) {
            return back()->withErrors(['penalty_error' => 'Có lỗi khi xóa phí phạt.']);
        }

        return back()->with('success', 'Xóa phí phạt thành công.');
    }
}
