@extends('layouts.admin')

@section('content')
<div class="container mt-4">
    <div class="d-flex justify-content-between align-items-center mb-3">
        <h1 class="h3">Chi tiết phòng</h1>
        <div>
            <a href="{{ route('rooms.index') }}" class="btn btn-secondary btn-sm">Quay lại</a>
            <a href="{{ route('rooms.edit', $room) }}" class="btn btn-warning btn-sm">Sửa</a>
        </div>
    </div>

    <div class="card shadow-sm border-0">
        <div class="card-body">
            <div class="row mb-3">
                <div class="col-md-6">
                    <p><strong>Mã phòng:</strong> {{ $room->room_number }}</p>
                    <p><strong>Loại phòng:</strong> {{ $room->roomType->name }}</p>
                    <p><strong>Trạng thái:</strong> 
                        <span class="badge 
                            {{ $room->status == 'trống' ? 'bg-success' : 
                               ($room->status == 'đang sử dụng' ? 'bg-warning text-dark' : 'bg-danger') }}">
                            {{ ucfirst($room->status) }}
                        </span>
                    </p>
                </div>
                <div class="col-md-6">
                    <p><strong>Giá:</strong> {{ number_format($room->price, 0) }} VNĐ</p>
                    <p><strong>Mô tả:</strong> {{ $room->description ?? 'Không có mô tả' }}</p>
                </div>
            </div>

            @if($room->image)
                <div class="text-center">
                    <img src="{{ asset('storage/' . $room->image) }}" alt="Ảnh phòng" class="img-fluid rounded shadow-sm" style="max-height: 300px;">
                </div>
            @else
                <p class="text-muted text-center">Chưa có ảnh cho phòng này</p>
            @endif
        </div>
    </div>
</div>
@endsection