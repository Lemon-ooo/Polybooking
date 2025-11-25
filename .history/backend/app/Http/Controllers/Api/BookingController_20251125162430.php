<?php

namespace App\Http\Controllers\Web;

use App\Http\Controllers\Controller;
use App\Models\Booking;
use App\Models\RoomType;
use App\Services\BookingService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use RuntimeException;

class BookingController extends Controller
{
    /**
     * Danh sách booking của user hiện tại
     */
    public function index()
    {
        $user = Auth::user();

        $bookings = Booking::with(['items.roomType'])
            ->where('user_id', $user->user_id)
            ->orderByDesc('created_at')
            ->paginate(10);

        return view('bookings.index', compact('bookings'));
    }

    /**
     * Form tạo booking mới
     */
    public function create()
    {
        // Lấy danh sách room types để user chọn
        $roomTypes = RoomType::orderBy('base_price', 'asc')->get();

        return view('bookings.create', compact('roomTypes'));
    }

    /**
     * Xử lý tạo booking
     */
    public function store(Request $request, BookingService $bookingService)
    {
        $user = Auth::user();

        $validated = $request->validate([
            'check_in'                  => ['required', 'date', 'after_or_equal:today'],
            'check_out'                 => ['required', 'date', 'after:check_in'],
            'guest_number'              => ['required', 'integer', 'min:1'],
            'room_type_ids'             => ['required', 'array', 'min:1'],
            'room_type_ids.*'           => ['required', 'integer', 'exists:room_types,room_type_id'],
            'quantities'                => ['required', 'array', 'min:1'],
            'quantities.*'              => ['required', 'integer', 'min:0'],
        ], [
            'check_in.required'         => 'Vui lòng chọn ngày check-in.',
            'check_out.required'        => 'Vui lòng chọn ngày check-out.',
            'check_out.after'           => 'Check-out phải sau check-in.',
            'guest_number.required'     => 'Vui lòng nhập số lượng khách.',
            'room_type_ids.required'    => 'Vui lòng chọn ít nhất một loại phòng.',
        ]);

        try {
            $booking = $bookingService->createBookingForUser($user, $validated);
        } catch (RuntimeException $e) {
            return back()
                ->withErrors(['booking_error' => $e->getMessage()])
                ->withInput();
        } catch (\Throwable $e) {
            // Có thể log lỗi chi tiết
            return back()
                ->withErrors(['booking_error' => 'Có lỗi xảy ra khi tạo booking.'])
                ->withInput();
        }

        return redirect()
            ->route('bookings.show', $booking->booking_id)
            ->with('success', 'Đặt phòng thành công ở trạng thái chưa thanh toán (unpaid).');
    }

    /**
     * Chi tiết 1 booking (chỉ cho chủ booking xem)
     */
    public function show($id)
    {
        $user = Auth::user();

        $booking = Booking::with([
                'items.roomType',
                'assignedRooms.room',
                'serviceCharges.service',
                'penaltyCharges',
            ])
            ->where('booking_id', $id)
            ->where('user_id', $user->user_id)
            ->firstOrFail();

        return view('bookings.show', compact('booking'));
    }

    /**
     * Hủy booking – chỉ khi còn unpaid
     */
    public function cancel($id)
    {
        $user = Auth::user();

        /** @var Booking $booking */
        $booking = Booking::where('booking_id', $id)
            ->where('user_id', $user->user_id)
            ->firstOrFail();

        if (!$booking->canBeCancelled()) {
            return redirect()
                ->route('bookings.show', $booking->booking_id)
                ->withErrors(['booking_error' => 'Chỉ có thể hủy booking ở trạng thái unpaid.']);
        }

        $booking->status = Booking::STATUS_CANCELLED;
        $booking->save();

        return redirect()
            ->route('bookings.index')
            ->with('success', 'Hủy booking thành công.');
    }
}
