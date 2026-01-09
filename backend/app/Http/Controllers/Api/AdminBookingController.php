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

        $user = auth('sanctum')->user();

    if ($user->role !== 'admin') {
        return response()->json([
            'success' => false,
            'error' => [
                'code' => 'FORBIDDEN',
                'message' => 'Bạn không có quyền truy cập'
            ]
        ], 403);
    }
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

}
