<!-- filepath: c:\xampp\htdocs\Polybooking\backend\resources\views\admin\events\create.blade.php -->
@extends('layouts.admin')

@section('content')
<div class="container">
    <h1 class="mb-4">Tạo Event mới</h1>

    @if ($errors->any())
        <div class="alert alert-danger">
            <ul>
                @foreach ($errors->all() as $error)
                    <li>{{ $error }}</li>
                @endforeach
            </ul>
        </div>
    @endif

    <form action="{{ route('web.events.store') }}" method="POST" enctype="multipart/form-data">
        @csrf

        <div class="mb-3">
            <label for="name" class="form-label">Tên Event</label>
            <input type="text" class="form-control @error('name') is-invalid @enderror" id="name" name="name" value="{{ old('name') }}" required>
            @error('name') <span class="invalid-feedback">{{ $message }}</span> @enderror
        </div>

        <div class="mb-3">
            <label for="description" class="form-label">Mô tả</label>
            <textarea class="form-control @error('description') is-invalid @enderror" id="description" name="description" rows="5" required>{{ old('description') }}</textarea>
            @error('description') <span class="invalid-feedback">{{ $message }}</span> @enderror
        </div>

        <div class="row">
            <div class="col-md-6 mb-3">
                <label for="start_date" class="form-label">Ngày bắt đầu</label>
                <input type="datetime-local" class="form-control @error('start_date') is-invalid @enderror" id="start_date" name="start_date" value="{{ old('start_date') }}" required>
                @error('start_date') <span class="invalid-feedback">{{ $message }}</span> @enderror
            </div>

            <div class="col-md-6 mb-3">
                <label for="end_date" class="form-label">Ngày kết thúc</label>
                <input type="datetime-local" class="form-control @error('end_date') is-invalid @enderror" id="end_date" name="end_date" value="{{ old('end_date') }}" required>
                @error('end_date') <span class="invalid-feedback">{{ $message }}</span> @enderror
            </div>
        </div>

        <div class="mb-3">
            <label for="location" class="form-label">Địa điểm</label>
            <input type="text" class="form-control @error('location') is-invalid @enderror" id="location" name="location" value="{{ old('location') }}" required>
            @error('location') <span class="invalid-feedback">{{ $message }}</span> @enderror
        </div>

        <div class="mb-3">
            <label for="image" class="form-label">Hình ảnh</label>
            <input type="file" class="form-control @error('image') is-invalid @enderror" id="image" name="image" accept="image/*">
            @error('image') <span class="invalid-feedback">{{ $message }}</span> @enderror
        </div>

        <div class="mb-3">
            <label for="status" class="form-label">Trạng thái</label>
            <select class="form-select @error('status') is-invalid @enderror" id="status" name="status" required>
                <option value="">-- Chọn trạng thái --</option>
                <option value="upcoming" {{ old('status') === 'upcoming' ? 'selected' : '' }}>Sắp tới</option>
                <option value="ongoing" {{ old('status') === 'ongoing' ? 'selected' : '' }}>Đang diễn ra</option>
                <option value="completed" {{ old('status') === 'completed' ? 'selected' : '' }}>Đã kết thúc</option>
            </select>
            @error('status') <span class="invalid-feedback">{{ $message }}</span> @enderror
        </div>

        <div class="mb-3">
            <button type="submit" class="btn btn-success">Tạo Event</button>
            <a href="{{ route('web.events.index') }}" class="btn btn-secondary">Hủy</a>
        </div>
    </form>
</div>
@endsection