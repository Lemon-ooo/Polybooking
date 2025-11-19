@extends('layouts.admin')

@section('content')
<div class="container mt-4">
    <h2 class="mb-3">Chỉnh sửa Tour: {{ $tour->name }}</h2>

    {{-- Nút quay lại danh sách --}}
    <a href="{{ route('web.tours.index') }}" class="btn btn-secondary mb-3">↩ Quay lại</a>

    {{-- Hiển thị lỗi validation --}}
    @if($errors->any())
        <div class="alert alert-danger">
            <ul>
                @foreach($errors->all() as $error)
                    <li>{{ $error }}</li>
                @endforeach
            </ul>
        </div>
    @endif

    <form action="{{ route('web.tours.update', $tour->id) }}" method="POST" enctype="multipart/form-data">
        @csrf
        @method('PUT')

        <div class="mb-3">
            <label class="form-label">Tên Tour <span class="text-danger">*</span></label>
            <input type="text" name="name" class="form-control" value="{{ old('name', $tour->name) }}" required>
        </div>

        <div class="mb-3">
            <label class="form-label">Mô tả</label>
            <textarea name="description" class="form-control" rows="4">{{ old('description', $tour->description) }}</textarea>
        </div>

        <div class="mb-3">
            <label class="form-label">Ngày khởi hành <span class="text-danger">*</span></label>
            <input type="date" name="start_date" class="form-control" value="{{ old('start_date', $tour->start_date ? $tour->start_date->format('Y-m-d') : '') }}" required>
        </div>

        <div class="mb-3">
            <label class="form-label">Địa điểm <span class="text-danger">*</span></label>
            <input type="text" name="location" class="form-control" value="{{ old('location', $tour->location) }}" required>
        </div>

        <div class="mb-3">
            <label class="form-label">Giá Tour <span class="text-danger">*</span></label>
            <input type="number" name="price" class="form-control" value="{{ old('price', $tour->price) }}" min="0" required>
        </div>

        <div class="mb-3">
            <label class="form-label">Thời lượng <span class="text-danger">*</span></label>
            <input type="text" name="duration" class="form-control" value="{{ old('duration', $tour->duration) }}" required>
        </div>

        <div class="mb-3">
            <label class="form-label">Ảnh hiện tại</label>
            <div class="mb-2">
                @if($tour->image)
                    <img src="{{ asset('storage/'.$tour->image) }}" width="150" class="rounded">
                @else
                    <div class="text-muted">Chưa có ảnh</div>
                @endif
            </div>
            <label class="form-label">Tải ảnh mới (nếu muốn thay đổi)</label>
            <input type="file" name="image" class="form-control">
        </div>

        <button class="btn btn-primary">💾 Cập nhật</button>
        <a href="{{ route('web.tours.index') }}" class="btn btn-secondary">Hủy</a>
    </form>
</div>

{{-- CSS nhỏ --}}
<style>
    img {
        object-fit: cover;
        max-height: 200px;
    }
</style>
@endsection
