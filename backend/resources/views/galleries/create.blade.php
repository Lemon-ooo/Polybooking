@extends('layouts.admin')

@section('content')
<div class="gallery-container">
    <div class="header-row">
        <h2 class="page-title">🖼️ Thêm ảnh vào Gallery</h2>
        <a href="{{ route('galleries.index') }}" class="btn btn-secondary">↩ Quay lại</a>
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
        <form action="{{ route('galleries.store') }}" method="POST" enctype="multipart/form-data" class="form-grid">
            @csrf

            {{-- Danh mục --}}
            <div class="form-group">
                <label for="gallery_category">Danh mục ảnh <span class="text-danger">*</span></label>
                <select name="gallery_category" id="gallery_category" class="input-field" required>
                    <option value="">-- Chọn danh mục --</option>
                    <option value="Lobby">🏛️ Lobby</option>
                    <option value="Accommodation">🛏️ Accommodation</option>
                    <option value="Van Lịch Restaurant">🍽️ Van Lịch Restaurant</option>
                    <option value="The Azura Skybar">🍸 The Azura Skybar</option>
                    <option value="Outdoor Cinema">🎬 Outdoor Cinema</option>
                    <option value="Chillout Swimming Pool">🏊 Chillout Swimming Pool</option>
                    <option value="Services">🛎️ Services</option>
                </select>
            </div>

            {{-- Ảnh --}}
            <div class="form-group">
                <label for="image">Chọn ảnh <span class="text-danger">*</span></label>
                <input type="file" name="image" id="image" class="input-field" accept="image/*" required>
            </div>

            {{-- Mô tả --}}
            <div class="form-group">
                <label for="caption">Mô tả ngắn</label>
                <input type="text" name="caption" id="caption" class="input-field" placeholder="Nhập mô tả ảnh...">
            </div>

            {{-- Nút --}}
            <div class="button-group">
                <button type="submit" class="btn btn-primary">💾 Lưu ảnh</button>
                <a href="{{ route('galleries.index') }}" class="btn btn-secondary">Hủy</a>
            </div>
        </form>
    </div>
</div>

<style>
.gallery-container {
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
