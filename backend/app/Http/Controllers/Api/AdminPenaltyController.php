<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

use App\Models\Booking;
use App\Models\Penalty;

class AdminPenaltyController extends Controller
{
    // List penalties for a booking
    public function index($bookingId)
    {
        $booking = Booking::findOrFail($bookingId);

        $items = Penalty::where('booking_id', $bookingId)->get();

        return response()->json(['success' => true, 'data' => $items]);
    }

    // Create penalty
    public function store(Request $request, $bookingId)
    {
        $booking = Booking::findOrFail($bookingId);

        if (!in_array($booking->status, [Booking::STATUS_CHECK_IN, Booking::STATUS_IN_USE])) {
            return response()->json(['success' => false, 'message' => 'Booking không hợp lệ'], 400);
        }

        $data = $request->validate([
            'days_late' => 'required|integer|min:1',
            'amount'    => 'required|integer|min:0'
        ]);

        $penalty = Penalty::create([
            'booking_id' => $booking->id,
            'days_late'  => $data['days_late'],
            'amount'     => $data['amount']
        ]);

        if ($booking->status === Booking::STATUS_CHECK_IN) {
            $booking->update(['status' => Booking::STATUS_IN_USE]);
        }

        return response()->json(['success' => true, 'data' => $penalty]);
    }

    // Optionally delete a penalty
    public function destroy($id)
    {
        $penalty = Penalty::findOrFail($id);
        $penalty->delete();
        return response()->json(['success' => true]);
    }
}
