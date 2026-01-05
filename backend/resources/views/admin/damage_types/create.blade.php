@extends('layouts.admin')

@section('content')
<div class="container">
    <h2>Thêm loại thiệt hại</h2>

    <form action="{{ route('admin.damage_types.store') }}" method="POST">
        @csrf

        <label>Tên loại hư hại</label>
        <input type="text" name="name" class="form-control" required>

        <label>Giá</label>
        <input type="number" name="price" class="form-control" required>

        <label>Mô tả</label>
        <textarea name="description" class="form-control"></textarea>

        <button class="btn btn-success mt-3">Lưu</button>
    </form>
</div>
@endsection
