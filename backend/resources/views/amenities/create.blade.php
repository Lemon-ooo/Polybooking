@extends('layouts.admin')

@section('content')
<div class="page-container">
    <div class="header-row">
        <h2 class="page-title">Thêm tiện ích mới</h2>
        <a href="{{ route('web.amenities.index') }}" class="btn btn-secondary">↩ Quay lại danh sách</a>
    </div>

    @if($errors->any())
        <div class="alert alert-danger">
            <ul>
                @foreach($errors->all() as $error)
                    <li>{{ $error }}</li>
                @endforeach
            </ul>
        </div>
    @endif

    <div class="card">
        <form action="{{ route('web.amenities.store') }}" method="POST" class="form-grid" enctype="multipart/form-data">
            @csrf

            <div class="form-group">
                <label for="name">Tên tiện ích <span class="text-danger">*</span></label>
                <input type="text" name="name" id="name" class="input-field" placeholder="Nhập tên tiện ích..." value="{{ old('name') }}" required>
            </div>

            <div class="form-group">
                <label for="category">Phân loại</label>
                <input type="text" name="category" id="category" class="input-field" placeholder="Nhập phân loại (nếu có)..." value="{{ old('category') }}">
            </div>

            <div class="form-group">
                <label for="icon">Icon (Ảnh)</label>
                <input type="file" name="icon" id="icon" class="input-field" accept="image/*">
                <small>jpg, png, gif, svg, webp – tối đa 2MB</small>
            </div>

            <div class="form-group">
                <label for="description">Mô tả</label>
                <textarea name="description" id="description" class="input-field" rows="4" placeholder="Nhập mô tả (nếu có)...">{{ old('description') }}</textarea>
            </div>

            <div class="button-group">
                <button type="submit" class="btn btn-primary">Lưu tiện ích</button>
                <a href="{{ route('web.amenities.index') }}" class="btn btn-secondary">Hủy</a>
            </div>
        </form>
    </div>
</div>

<style>
/* (giữ nguyên CSS cũ của bạn) */
.page-container{background:#f4f6f9;padding:25px 35px;border-radius:8px}
.header-row{display:flex;justify-content:space-between;align-items:center;margin-bottom:20px}
.page-title{font-size:22px;font-weight:600;color:#333;border-left:5px solid #2196F3;padding-left:10px}
.card{background:#fff;border-radius:12px;padding:25px 30px;box-shadow:0 3px 8px rgba(0,0,0,.05)}
.form-grid{display:flex;flex-direction:column;gap:16px}
.form-group label{font-weight:600;color:#444;margin-bottom:6px}
.input-field{width:100%;padding:10px 12px;border:1px solid #ccc;border-radius:6px;font-size:15px;transition:.2s}
.input-field:focus{border-color:#2196F3;box-shadow:0 0 5px rgba(33,150,243,.3);outline:none}
.button-group{display:flex;gap:10px;margin-top:10px}
.btn{padding:10px 16px;border:none;border-radius:6px;cursor:pointer;font-size:15px;font-weight:500;text-decoration:none;transition:all .2s}
.btn-primary{background:#2196F3;color:#fff}
.btn-primary:hover{background:#1976D2}
.btn-secondary{background:#9e9e9e;color:#fff}
.btn-secondary:hover{background:#757575}
.alert-danger{background:#fdecea;border-left:5px solid #f44336;color:#b71c1c;padding:10px 15px;border-radius:6px;margin-bottom:20px}
</style>
@endsection