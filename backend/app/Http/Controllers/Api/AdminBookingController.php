<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Booking;
use Illuminate\Http\Request;

class AdminBookingController extends Controller
{
    /**
     * Danh sách booking (Admin)
     */
    public function index(Request $request)
    {
        $query = Booking::with([
            'user',
            'bookingItems.roomType'
        ])->orderByDesc('created_at');

        // 🔍 Filter theo status (optional)
        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        // 🔍 Filter theo booking_code (optional)
        if ($request->filled('booking_code')) {
            $query->where('booking_code', 'like', '%' . $request->booking_code . '%');
        }

        $bookings = $query->paginate(10);

        return response()->json([
            'success' => true,
            'data' => $bookings,
            'meta' => [
                'timestamp' => now()
            ]
        ]);
    }

    /**
     * Chi tiết booking (Admin)
     */
    public function show($id)
    {
        $booking = Booking::with([
            'user',
            'bookingItems.roomType',
            'voucher',
            'payments',
            'damages.damageType',
            'services'
        ])->find($id);

        if (!$booking) {
            return response()->json([
                'success' => false,
                'error' => [
                    'code' => 'BOOKING_NOT_FOUND',
                    'message' => 'Không tìm thấy booking'
                ]
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $booking,
            'meta' => [
                'timestamp' => now()
            ]
        ]);
    }
}
