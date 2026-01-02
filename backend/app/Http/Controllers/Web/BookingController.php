<?php

namespace App\Http\Controllers\Web;

use App\Http\Controllers\Controller;
use App\Models\RoomType;
use App\Models\Booking;
use Illuminate\Http\Request;

class BookingController extends Controller
{
    public function index()
    {
        $roomTypes = RoomType::with('amenities')->get();
        return view('bookings.index', compact('roomTypes'));
    }

    public function create(Request $req)
    {
        if (!$req->has('room_type_id')) {
            return redirect('/')->with('error', 'Vui lòng chọn loại phòng trước.');
        }

        $roomType = RoomType::findOrFail($req->room_type_id);
        return view('bookings.create', compact('roomType'));
    }

    public function store(Request $req)
    {
        $req->validate([
            'room_type_id'  => 'required|exists:room_types,room_type_id',
            'adults'        => 'required|integer|min:1',
            'children'      => 'required|integer|min:0',
            'check_in'      => 'required|date',
            'check_out'     => 'required|date|after:check_in',
            'room_quantity' => 'required|integer|min:1'
        ]);

        $roomType = RoomType::where('room_type_id', $req->room_type_id)->firstOrFail();

        $room_price = $roomType->totalPricePerRoom();

        $nights = date_diff(
            new \DateTime($req->check_in),
            new \DateTime($req->check_out)
        )->days;

        $booking = Booking::create([
            'user_id'       => auth()->id(),
            'room_type_id'  => $roomType->room_type_id,
            'adults'        => $req->adults,
            'children'      => $req->children,
            'check_in'      => $req->check_in,
            'check_out'     => $req->check_out,
            'nights'        => $nights,
            'room_quantity' => $req->room_quantity,
            'room_price'    => $room_price,
            'total_price'   => $room_price * $req->room_quantity * $nights,
            'status'        => 'pending_payment'
        ]);

        //  SỬA ĐÚNG
        return redirect()->route('payment.page', $booking);
    }
}
