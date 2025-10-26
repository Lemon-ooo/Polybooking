@extends('layouts.admin')

@section('content')
<h1>Chi tiết loại phòng: {{ $roomType->name }}</h1>
<p><strong>Mô tả:</strong> {{ $roomType->description ?? 'Không có mô tả' }}</p>
<p><strong>Giá cơ bản:</strong> {{ number_format($roomType->base_price, 2) }} VNĐ</p>
<a href="{{ route('room-types.index') }}" class="btn btn-secondary">Quay lại</a>
@endsection