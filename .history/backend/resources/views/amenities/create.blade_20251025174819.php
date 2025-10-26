@extends('layouts.admin')

@section('content')
<h2>Thêm tiện ích mới</h2>

<form action="{{ route('amenities.store') }}" method="POST">
    @csrf

    <div>
        <label for="name">Tên tiện ích</label>
        <input type="text" id="name" name="name" required>
    </div>

    <div>
        <label for="category">Phân loại</label>
        <input type="text" id="category" name="category">
    </div>

    <div>
        <label for="icon_url">Icon URL</label>
        <input type="text" id="icon_url" name="icon_url">
    </div>

    <div>
        <label for="description">Mô tả</label>
        <textarea id="description" name="description"></textarea>
    </div>

    <button type="submit">Lưu</button>
</form>
@endsection
