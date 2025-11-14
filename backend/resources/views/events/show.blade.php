@extends('layouts.admin')

@section('content')
  <div class="page-container">
    <div class="header-row">
      {{-- ✅ Cập nhật tiêu đề và link Quay lại cho Event --}}
      <h2 class="page-title">ℹ️ Chi tiết Sự kiện</h2>
      <a href="{{ route('web.events.index') }}" class="btn btn-secondary">↩ Quay lại</a>
    </div>

    <div class="card">
      <div class="detail-group">
        {{-- ✅ Hiển thị các trường của $event --}}
        <p><strong>Tên sự kiện:</strong> {{ $event->name }}</p>
        <p><strong>Mô tả:</strong> {{ $event->description }}</p>
        {{-- ✅ Trường Ngày: Định dạng ngày tháng --}}
        <p><strong>Ngày diễn ra:</strong> {{ \Carbon\Carbon::parse($event->date)->format('d/m/Y') }}</p>
        {{-- ✅ Trường Địa điểm --}}
        <p><strong>Địa điểm:</strong> {{ $event->location }}</p>

        <p><strong>Hình ảnh:</strong>
          @if ($event->image)
            <img src="{{ $event->image }}" alt="Hình sự kiện" width="200">
          @else
            <em>Không có ảnh</em>
          @endif
        </p>

        {{-- Thêm thông tin thời gian tạo/cập nhật --}}
        <hr style="margin: 15px 0; border-top: 1px solid #eee;">
        <p><strong>Ngày tạo:</strong> {{ $event->created_at->format('H:i:s d/m/Y') }}</p>
        <p><strong>Cập nhật cuối:</strong> {{ $event->updated_at->format('H:i:s d/m/Y') }}</p>
      </div>
    </div>
  </div>

  {{-- Giữ nguyên style CSS --}}
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