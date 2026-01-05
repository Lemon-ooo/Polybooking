@extends('layouts.app')

@section('content')
<div class="container">

    <h2 class="mb-4">Thanh toán đơn hàng #{{ $booking->id }}</h2>

    <div class="card">
        <div class="card-body">

            <h5 class="card-title">Thông tin booking</h5>

            <p><strong>Loại phòng:</strong> {{ $booking->roomType->room_type_name }}</p>
            <p><strong>Số lượng phòng:</strong> {{ $booking->room_quantity }}</p>
            <p><strong>Số đêm:</strong> {{ $booking->nights }}</p>
            <p><strong>Tổng tiền cần thanh toán:</strong>
                <span class="text-danger fw-bold">
                    {{ number_format($booking->total_price) }} VND
                </span>
            </p>

            <hr>

            <form method="POST" action="{{ route('payment.vnpay', $booking->id) }}">
                @csrf

                <button type="submit" class="btn btn-primary btn-lg w-100">
                    Thanh toán qua VNPAY
                </button>
            </form>

        </div>
    </div>
</div>
@endsection
