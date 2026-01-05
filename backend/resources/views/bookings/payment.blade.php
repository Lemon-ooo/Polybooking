@extends('layouts.app')

@section('content')
<div class="container">
    <h3>Thanh toán đơn đặt phòng #{{ $booking->id }}</h3>

    <p>Loại phòng: {{ $booking->roomType->room_type_name }}</p>
    <p>Số tiền cần thanh toán: <strong>{{ number_format($booking->total_price) }} VND</strong></p>

    <form action="{{ route('payment.vnpay', $booking->id) }}" method="POST">
        @csrf
        <button type="submit" class="btn btn-primary">
            Thanh toán bằng VNPAY
        </button>
    </form>
</div>
@endsection
