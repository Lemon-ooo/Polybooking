@extends('layouts.admin')

@section('content')
<div class="container mt-4">
    <h2 class="mb-3">➕ Thêm Tour Mới</h2>

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

    <form action="{{ route('web.tours.store') }}" method="POST" enctype="multipart/form-data">
        @csrf

        <div class="mb-3">
            <label class="form-label">Tên Tour <span class="text-danger">*</span></label>
            <input type="text" name="name" class="form-control" value="{{ old('name') }}" required>
        </div>

        <div class="mb-3">
            <label class="form-label">Mô tả</label>
            <textarea name="description" class="form-control" rows="4">{{ old('description') }}</textarea>
        </div>

        <div class="mb-3">
            <label class="form-label">Ngày khởi hành <span class="text-danger">*</span></label>
            <input type="date" name="start_date" class="form-control" value="{{ old('start_date') }}" required>
        </div>

        <div class="mb-3">
            <label class="form-label">Địa điểm <span class="text-danger">*</span></label>
            <input type="text" name="location" class="form-control" value="{{ old('location') }}" required>
        </div>

        <div class="mb-3">
            <label class="form-label">Giá Tour <span class="text-danger">*</span></label>
            <input type="number" name="price" class="form-control" value="{{ old('price') }}" min="0" required>
        </div>

        <div class="mb-3">
            <label class="form-label">Thời lượng <span class="text-danger">*</span></label>
            <input type="text" name="duration" class="form-control" value="{{ old('duration') }}" required>
        </div>

        <div class="mb-3">
            <label class="form-label">Ảnh Tour</label>
            <input type="file" name="image" class="form-control">
        </div>

        <button class="btn btn-primary">💾 Lưu</button>
        <a href="{{ route('web.tours.index') }}" class="btn btn-secondary">Hủy</a>
    </form>
</div>

{{-- CSS nhỏ --}}
<style>
    .alert-danger {
        background-color: #fdecea;
        border-left: 5px solid #f44336;
        color: #b71c1c;
        padding: 10px 15px;
        border-radius: 6px;
        margin-bottom: 20px;
    }
</style>
@endsection
