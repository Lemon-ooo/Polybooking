@extends('layouts.app')

@section('content')
<div class="container">
    <h2>Chọn loại phòng</h2>

    @foreach($roomTypes as $type)
        <div class="card my-3 p-3">
            <h4>{{ $type->name }}</h4>
            <p>Giá cơ bản: {{ number_format($type->base_price) }} VNĐ</p>

            <strong>Tiện ích:</strong>
            <ul>
                @foreach($type->amenities as $a)
                    <li>{{ $a->name }} ({{ number_format($a->price) }} VNĐ)</li>
                @endforeach
            </ul>

            <a href="{{ route('bookings.create', ['room_type_id' => $type->id]) }}" 
               class="btn btn-primary">Đặt phòng</a>
            
        </div>
    @endforeach
</div>
@endsection
