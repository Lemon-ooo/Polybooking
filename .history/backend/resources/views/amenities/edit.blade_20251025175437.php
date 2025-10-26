@extends('layouts.admin')

@section('content')
<h2>Chỉnh sửa tiện ích</h2>

@if ($errors->any())
    <div class="alert alert-danger">
        <ul>
            @foreach ($errors->all() as $error)
                <li>{{ $error }}</li>
            @endforeach
        </ul>
    </div>
@endif

@if (session('success'))
    <div class="alert alert-success">{{ session('success') }}</div>
@endif

<form action="{{ route('amenities.update', $amenity->amenity_id) }}" method="POST">
    @csrf
    @method('PUT')

    <div style="margin-bottom: 10px;">
        <label for="name">Tên tiện ích:</label><br>
        <input type="text" id="name" name="name" value="{{ old('name', $amenity->name) }}" required>
    </div>

    <div style="margin-bottom: 10px;">
        <label for="category">Phân loại:</label><br>
        <input type="text" id="category" name="category" value="{{ old('category', $amenity->category) }}">
    </div>

    <div style="margin-bottom: 10px;">
        <label for="icon_url">Icon URL:</label><br>
        <input type="text" id="icon_url" name="icon_url" value="{{ old('icon_url', $amenity->icon_url) }}">
    </div>

    <div style="margin-bottom: 10px;">
        <label for="description">Mô tả:</label><br>
        <textarea id="description" name="description" rows="4">{{ old('description', $amenity->description) }}</textarea>
    </div>

    <button type="submit" class="btn">💾 Cập nhật</button>
    <a href="{{ route('amenities.index') }}" class="btn" style="background:#9e9e9e;">↩ Quay lại</a>
</form>
@endsection
