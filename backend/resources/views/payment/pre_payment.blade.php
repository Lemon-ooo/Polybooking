@extends('layouts.app')

@section('content')
<div class="container">
    <h2>Thanh toán đơn đặt phòng #{{ $booking->id }}</h2>

    <p>Tổng tiền: <strong>{{ number_format($booking->total_price) }} VNĐ</strong></p>

    <form action="{{ route('payment.do', $booking->id) }}" method="POST">
        @csrf
        <label>Mã giảm giá:</label>
        <input type="text" name="voucher_code" class="form-control">

        <button class="btn btn-success mt-3">Thanh toán ngay</button>
    </form>
</div>
@endsection
