@extends('layouts.admin')

@section('content')
<div class="page-container">
    <div class="header-row">
        <h2 class="page-title">ℹ️ Chi tiết Dịch vụ</h2>
        <a href="{{ route('web.services.index') }}" class="btn btn-secondary">↩ Quay lại</a>
    </div>

    <div class="card">
        <div class="detail-group">
            <p><strong>Tên:</strong> {{ $service->name }}</p>
            <p><strong>Mô tả:</strong> {{ $service->description }}</p>
            <p><strong>Giá:</strong> {{ number_format($service->price, 0, ',', '.') }} VND</p>
            <p><strong>Hình ảnh:</strong>
                @if ($service->image)
                    <img src="{{ $service->image }}" alt="Hình" width="200">
                @else
                    <em>Không có ảnh</em>
                @endif
            </p>
        </div>
    </div>
</div>

<style>
.page-container {
    background: #f4f6f9;
    padding: 25px 35px;
    border-radius: 8px;
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
    padding: 25px 30px;
    box-shadow: 0 3px 8px rgba(0, 0, 0, 0.05);
}

.detail-group p {
    font-size: 15px;
    margin-bottom: 12px;
    color: #444;
}

.detail-group strong {
    font-weight: 600;
    color: #333;
    margin-right: 8px;
}

.btn {
    padding: 10px 16px;
    border: none;
    border-radius: 6px;
    cursor: pointer;
    font-size: 15px;
    font-weight: 500;
    text-decoration: none;
    transition: all 0.2s ease;
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