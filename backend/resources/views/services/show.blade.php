@extends('layouts.admin')

@section('content')
<div class="page-container">
    <div class="header-row">
        <h2 class="page-title">Chi tiết Dịch vụ</h2>
        <a href="{{ route('web.services.index') }}" class="btn btn-secondary">Quay lại</a>
    </div>

    <div class="card">
        <div class="detail-group">
            <p><strong>Tên:</strong> {{ $service->name }}</p>
            <p><strong>Mô tả:</strong> {{ $service->description ?? 'Không có mô tả' }}</p>
            <p><strong>Giá:</strong> {{ number_format($service->price, 0, ',', '.') }} VND</p>
            
            <p><strong>Hình ảnh:</strong></p>
            <div style="margin-top: 10px; text-align: center;">
                @if ($service->image && file_exists(public_path($service->image)))
                    <img src="{{ asset($service->image) }}" 
                         alt="{{ $service->name }}" 
                         width="300" 
                         style="border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.1); max-width: 100%; height: auto;">
                @else
                    <div style="background: #f0f0f0; border: 2px dashed #ccc; border-radius: 12px; padding: 40px; color: #999;">
                        <em>Không có ảnh</em>
                    </div>
                @endif
            </div>
        </div>

        <div style="margin-top: 20px; text-align: center;">
            <a href="{{ route('web.services.edit', $service->id) }}" class="btn btn-primary">Sửa</a>
            <a href="{{ route('web.services.index') }}" class="btn btn-secondary">Danh sách</a>
        </div>
    </div>
</div>

<style>
.page-container {
    background: #f4f6f9;
    padding: 25px 35px;
    border-radius: 8px;
    min-height: 80vh;
}

.header-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
}

.page-title {
    font-size: 22px;
    font-weight: 600;
    color: #333;
    border-left: 5px solid #2196F3;
    padding-left: 10px;
}

.card {
    background: #fff;
    border-radius: 12px;
    padding: 30px;
    box-shadow: 0 3px 15px rgba(0, 0, 0, 0.08);
}

.detail-group p {
    font-size: 16px;
    margin-bottom: 15px;
    color: #444;
    line-height: 1.6;
}

.detail-group strong {
    font-weight: 600;
    color: #333;
    margin-right: 10px;
}

.btn {
    padding: 10px 20px;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    font-size: 15px;
    font-weight: 500;
    text-decoration: none;
    transition: all 0.3s ease;
    margin: 0 8px;
}

.btn-primary {
    background-color: #2196F3;
    color: #fff;
}

.btn-primary:hover {
    background-color: #1976D2;
}

.btn-secondary {
    background-color: #9e9e9e;
    color: #fff;
}

.btn-secondary:hover {
    background-color: #757575;
}
</style>
@endsection