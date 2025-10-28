@extends('layouts.admin')

@section('content')
<div class="container">
    <h1>🆕 Thêm ảnh vào Gallery</h1>

    <form action="{{ route('galleries.store') }}" method="POST" enctype="multipart/form-data" class="w-50">
        @csrf
        <div class="mb-3">
            <label class="form-label">Danh mục ảnh</label>
            <input type="text" name="gallery_category" class="form-control" required>
        </div>

        <div class="mb-3">
            <label class="form-label">Ảnh</label>
            <input type="file" name="image" class="form-control" accept="image/*" required>
        </div>

        <div class="mb-3">
            <label class="form-label">Mô tả ngắn</label>
            <input type="text" name="caption" class="form-control">
        </div>

        <button class="btn btn-success">💾 Lưu</button>
    </form>
</div>
@endsection
