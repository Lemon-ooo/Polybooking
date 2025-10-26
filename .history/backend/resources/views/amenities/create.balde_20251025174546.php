@extends('layouts.admin')

@section('content')
<h2>Thêm tiện ích mới</h2>

<form action="{{ route('amenities.store') }}" method="POST">
    @csrf
    <label>Tên tiện ích:</label><br>
    <input type="text" name="name" required><br><br>

    <label>Phân loại:</label><br>
    <input type="text" name="category"><br><br>

    <label>Icon URL:</label><br>
    <input type="text" name="icon_url"><br><br>

    <label>Mô tả:</label><br>
    <textarea name="description" rows="4"></textarea><br><br>

    <button type="submit" class="btn">Lưu</button>
    <a href="{{ route('amenities.index') }}" class="btn">Quay lại</a>
</form>
@endsection
