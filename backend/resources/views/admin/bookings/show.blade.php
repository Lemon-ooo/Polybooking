@extends('layouts.admin')

@section('content')
<h4>Booking #{{ $booking->id }}</h4>

<div class="card shadow-sm">
    <div class="card-body">
        <p><b>Trạng thái:</b> {{ $booking->status }}</p>
        <p><b>Ngày:</b> {{ $booking->check_in }} → {{ $booking->check_out }}</p>
        <p><b>Số khách:</b> {{ $booking->adults }} NL,
           {{ $booking->children }} TE</p>

        <hr>

        <p><b>Tổng tiền:</b>
            {{ number_format(
                $booking->room_price +
                $booking->service_total +
                $booking->damage_total
            ) }} đ
        </p>

        <p><b>Đã thanh toán:</b>
            {{ number_format($booking->paid_amount) }} đ
        </p>
    </div>
</div>
@endsection
