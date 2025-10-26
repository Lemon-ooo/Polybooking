@extends('layouts.admin')

@section('content')
<h2>Chỉnh sửa tiện ích</h2>

<form action="{{ route('amenities.update', $amenity->amenity_id) }}" method="POST">
    @csrf
    @method('PUT')

    <label>Tên tiện ích:</label><br>
    <input type="text" name="name" value="{{ $amenity->name }}" required><br><br>

    <label>Phân loại:</label><br>
    <input type="text" name="category" value="{{ $amenity->category }}"><br><br>

    <label>Icon URL:</label><br>
    <input type="text" name="icon_url" value="{{ $amenity->icon_url }}"><br><br>

    <label>Mô tả:</label><br>
    <textarea name="description" rows="4">{{ $amenity->description }}</textarea><br><br>

    <button type="submit" class="btn">Cập nhật</button>
    <a href="{{ route('amenities.index') }}" class="btn">Quay lại</a>
</form>
@endsection
