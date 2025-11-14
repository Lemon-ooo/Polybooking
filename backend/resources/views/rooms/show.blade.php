@extends('layouts.admin')

@section('content')
<div class="container mt-4">
    <div class="d-flex justify-content-between align-items-center mb-3">
        <h1 class="h3">Chi tiết phòng</h1>
        <div>
            <a href="{{ route('web.rooms.index') }}" class="btn btn-secondary btn-sm">Quay lại</a>
            <a href="{{ route('web.rooms.edit', $room) }}" class="btn btn-warning btn-sm">Sửa</a>
        </div>
    </div>

    <div class="card shadow-sm border-0">
        <div class="card-body">
            <div class="row mb-3">
                <div class="col-md-6">
                    <p><strong>Mã phòng:</strong> {{ $room->room_number }}</p>
                    <p><strong>Loại phòng:</strong> {{ $room->roomType->name ?? '—' }}</p>
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

            {{-- HIỂN THỊ 1 ẢNH ĐẦU TIÊN TỪ BẢNG room_images --}}
            <div class="mt-4 text-center">
                <h5>Ảnh phòng</h5>
                @php
                    $firstImage = $room->images->first();
                @endphp

                @if ($firstImage && $firstImage->image_path)
                    <img src="{{ asset('storage/' . $firstImage->image_path) }}"
                         alt="Phòng {{ $room->room_number }}"
                         class="img-fluid rounded shadow-sm"
                         style="max-height: 350px; object-fit: cover; border: 3px solid #e9ecef;">
                    <p class="mt-2 text-muted small">
                        <a href="{{ route('room.images.index', $room->room_id) }}" class="text-decoration-none">
                            Quản lý ảnh ({{ $room->images->count() }} ảnh)
                        </a>
                    </p>
                @else
                    <div class="py-5 bg-light rounded">
                        <img src="{{ asset('images/no-image.png') }}" alt="Chưa có ảnh" width="120" class="mb-3 opacity-50">
                        <p class="text-muted">Chưa có ảnh cho phòng này</p>
                        <a href="{{ route('room.images.index', $room->room_id) }}" class="btn btn-primary btn-sm">
                            Thêm ảnh ngay
                        </a>
                    </div>
                @endif
            </div>
            {{-- KẾT THÚC PHẦN ẢNH --}}
        </div>
    </div>
</div>
@endsection