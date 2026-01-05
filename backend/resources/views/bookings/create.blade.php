@extends('layouts.app')

@section('content')
<div class="container">
    <h2>Thông tin đặt phòng – {{ $roomType->name }}</h2>

    <form action="{{ route('bookings.store') }}" method="POST">
        @csrf

        <input type="hidden" name="room_type_id" value="{{ $roomType->id }}">

        <label>Người lớn:</label>
        <input type="number" name="adults" class="form-control" required min="1">

        <label>Trẻ em:</label>
        <input type="number" name="children" class="form-control" min="0">

        <label>Ngày nhận phòng:</label>
        <input type="date" name="check_in" class="form-control" required>

        <label>Ngày trả phòng:</label>
        <input type="date" name="check_out" class="form-control" required>

        <label>Số lượng phòng:</label>
        <input type="number" name="room_quantity" class="form-control" required min="1" value="1">
        <input type="hidden" name="room_type_id" value="{{ $roomType->room_type_id }}">


        <button type="submit" class="btn btn-success mt-3">Tiếp tục thanh toán</button>
    </form>
</div>
@endsection
