@extends('layouts.admin')

@section('content')
<div class="container">
    <h2>Thanh toán Check-out – Booking #{{ $booking->id }}</h2>

    <ul class="list-group mb-3">
        <li class="list-group-item">Dịch vụ: {{ number_format($service_fee) }} VNĐ</li>
        <li class="list-group-item">Thiệt hại: {{ number_format($damage_fee) }} VNĐ</li>
        <li class-group-item>Penalty: {{ number_format($penalty_fee) }} VNĐ</li>
        <li class="list-group-item active">Tổng cần thanh toán: {{ number_format($total_due) }} VNĐ</li>
    </ul>

    <form action="{{ route('payment.checkout.do', $booking->id) }}" method="POST">
        @csrf

        <label>Mã giảm giá:</label>
        <input type="text" name="voucher_code" class="form-control">

        <button class="btn btn-success mt-3">Xác nhận thanh toán</button>
    </form>
</div>
@endsection
