<?php

namespace App\Http\Controllers\Api;

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
     * Danh sách booking của user hiện tại (API)
     */
    public function index()
    {
        $user = Auth::user();

        $bookings = Booking::with(['items.roomType'])
            ->where('user_id', $user->user_id)
            ->orderByDesc('created_at')
            ->paginate(10);

        return response()->json([
            "success" => true,
            "data"    => $bookings->items(),
            "message" => "Bookings retrieved successfully",
            "meta"    => [
                "total"        => $bookings->total(),
                "per_page"     => $bookings->perPage(),
                "current_page" => $bookings->currentPage(),
                "last_page"    => $bookings->lastPage(),
            ]
        ]);
    }

    /**
     * Danh sách room types để tạo booking mới
     */
    public function create()
    {
        $roomTypes = RoomType::orderBy('base_price', 'asc')->get();

        return response()->json([
            "success" => true,
            "data"    => $roomTypes,
            "message" => "Room types retrieved successfully"
        ]);
    }

    /**
     * Xử lý tạo booking
     */
    public function store(Request $request, BookingService $bookingService)
    {
        $user = Auth::user();

        $validated = $request->validate([
            'check_in'        => ['required', 'date', 'after_or_equal:today'],
            'check_out'       => ['required', 'date', 'after:check_in'],
            'guest_number'    => ['required', 'integer', 'min:1'],
            'room_type_ids'   => ['required', 'array', 'min:1'],
            'room_type_ids.*' => ['required', 'integer', 'exists:room_types,room_type_id'],
            'quantities'      => ['required', 'array', 'min:1'],
            'quantities.*'    => ['required', 'integer', 'min:0'],
        ]);

        try {
            $booking = $bookingService->createBookingForUser($user, $validated);
        } catch (RuntimeException $e) {
            return response()->json([
                "success" => false,
                "data"    => null,
                "message" => $e->getMessage(),
            ], 400);
        } catch (\Throwable $e) {
            return response()->json([
                "success" => false,
                "data"    => null,
                "message" => "Có lỗi xảy ra khi tạo booking.",
            ], 500);
        }

        return response()->json([
            "success" => true,
            "data"    => $booking,
            "message" => "Booking created successfully (unpaid).",
        ], 201);
    }

    /**
     * Chi tiết 1 booking
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

        return response()->json([
            "success" => true,
            "data"    => $booking,
            "message" => "Booking retrieved successfully",
        ]);
    }

    /**
     * Hủy booking
     */
    public function cancel($id)
    {
        $user = Auth::user();

        /** @var Booking $booking */
        $booking = Booking::where('booking_id', $id)
            ->where('user_id', $user->user_id)
            ->firstOrFail();

        if (!$booking->canBeCancelled()) {
            return response()->json([
                "success" => false,
                "data"    => null,
                "message" => "Chỉ có thể hủy booking ở trạng thái unpaid.",
            ], 400);
        }

        $booking->status = Booking::STATUS_CANCELLED;
        $booking->save();

        return response()->json([
            "success" => true,
            "data"    => $booking,
            "message" => "Booking cancelled successfully",
        ]);
    }
}