@extends('layouts.admin')

@section('content')
<div class="page-container">
    <div class="header-row">
        <h2 class="page-title">✏️ Sửa Dịch vụ</h2>
        <a href="{{ route('web.services.index') }}" class="btn btn-secondary">↩ Quay lại</a>
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
       <form action="{{ route('web.services.update', $service->id) }}" method="POST" enctype="multipart/form-data" class="form-grid">
    @csrf
    @method('PUT')
            <div class="form-group">
                <label for="name">Tên dịch vụ <span class="text-danger">*</span></label>
                <input type="text" class="input-field" id="name" name="name" value="{{ old('name', $service->name) }}" required>
            </div>
            <div class="form-group">
                <label for="description">Mô tả</label>
                <textarea class="input-field" id="description" name="description" rows="3">{{ old('description', $service->description) }}</textarea>
            </div>
            <div class="form-group">
                <label for="price">Giá (VNĐ) <span class="text-danger">*</span></label>
                <input type="number" class="input-field" id="price" name="price" value="{{ old('price', $service->price) }}" min="0" step="0.01" required>
            </div>
            <div class="form-group">
    <label for="image">Hình ảnh</label>
    <input type="file" class="input-field" id="image" name="image" accept="image/*">
    
    @if(old('image') || (isset($service) && $service->image))
        <div style="margin-top: 10px;">
            <p><strong>Ảnh hiện tại:</strong></p>
            <img src="{{ asset(old('image') ?? $service->image) }}" width="150" style="border-radius: 8px;">
        </div>
    @endif
</div>
            <div class="button-group">
                <button type="submit" class="btn btn-primary">💾 Cập nhật</button>
                <a href="{{ route('web.services.index') }}" class="btn btn-secondary">Hủy</a>
            </div>
        </form>
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

.form-grid {
    display: flex;
    flex-direction: column;
    gap: 16px;
}

.form-group label {
    font-weight: 600;
    color: #444;
    margin-bottom: 6px;
}

.input-field {
    width: 100%;
    padding: 10px 12px;
    border: 1px solid #ccc;
    border-radius: 6px;
    font-size: 15px;
    transition: 0.2s;
}

.input-field:focus {
    border-color: #2196F3;
    box-shadow: 0 0 5px rgba(33,150,243,0.3);
    outline: none;
}

.button-group {
    display: flex;
    gap: 10px;
    margin-top: 10px;
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