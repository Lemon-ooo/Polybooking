@extends('layouts.admin')

@section('content')
<div class="container mt-4">
    <div class="card shadow-lg border-0 rounded-4">
        <div class="card-header bg-primary text-white d-flex justify-content-between align-items-center rounded-top-4">
            <h4 class="mb-0"><i class="bi bi-pencil-square me-2"></i>Chỉnh sửa tiện ích</h4>
            <a href="{{ route('amenities.index') }}" class="btn btn-light btn-sm">
                <i class="bi bi-arrow-left"></i> Quay lại
            </a>
        </div>

        <div class="card-body p-4">

            {{-- Thông báo lỗi --}}
            @if ($errors->any())
                <div class="alert alert-danger">
                    <ul class="mb-0">
                        @foreach ($errors->all() as $error)
                            <li>{{ $error }}</li>
                        @endforeach
                    </ul>
                </div>
            @endif

            {{-- Thông báo thành công --}}
            @if (session('success'))
                <div class="alert alert-success">
                    <i class="bi bi-check-circle-fill me-1"></i> {{ session('success') }}
                </div>
            @endif

            <form action="{{ route('amenities.update', $amenity->amenity_id) }}" method="POST" class="needs-validation" novalidate>
                @csrf
                @method('PUT')

                <div class="mb-3">
                    <label for="name" class="form-label fw-semibold">Tên tiện ích <span class="text-danger">*</span></label>
                    <input type="text" id="name" name="name" class="form-control rounded-3" 
                           value="{{ old('name', $amenity->name) }}" required>
                    <div class="invalid-feedback">Vui lòng nhập tên tiện ích.</div>
                </div>

                <div class="mb-3">
                    <label for="category" class="form-label fw-semibold">Phân loại</label>
                    <input type="text" id="category" name="category" class="form-control rounded-3"
                           value="{{ old('category', $amenity->category) }}">
                </div>

                <div class="mb-3">
                    <label for="icon_url" class="form-label fw-semibold">Icon URL</label>
                    <input type="text" id="icon_url" name="icon_url" class="form-control rounded-3"
                           value="{{ old('icon_url', $amenity->icon_url) }}">
                    @if ($amenity->icon_url)
                        <div class="mt-2">
                            <img src="{{ $amenity->icon_url }}" alt="Icon preview" width="40" height="40" class="rounded">
                            <small class="text-muted ms-2">Xem trước icon hiện tại</small>
                        </div>
                    @endif
                </div>

                <div class="mb-3">
                    <label for="description" class="form-label fw-semibold">Mô tả</label>
                    <textarea id="description" name="description" rows="4" 
                              class="form-control rounded-3">{{ old('description', $amenity->description) }}</textarea>
                </div>

                <div class="text-end">
                    <button type="submit" class="btn btn-success px-4 rounded-3 me-2">
                        <i class="bi bi-save me-1"></i> Cập nhật
                    </button>
                    <a href="{{ route('amenities.index') }}" class="btn btn-secondary px-4 rounded-3">
                        <i class="bi bi-x-circle me-1"></i> Hủy
                    </a>
                </div>
            </form>

        </div>
    </div>
</div>
@endsection
