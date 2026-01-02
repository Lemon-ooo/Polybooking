@extends('layouts.admin')

@section('content')
<div class="container">
    <h2>Danh sách loại thiệt hại</h2>

    <a href="{{ route('admin.damage_types.create') }}" class="btn btn-success mb-3">+ Thêm loại hư hại</a>

    <table class="table table-bordered">
        <tr>
            <th>ID</th>
            <th>Tên</th>
            <th>Giá</th>
            <th>Mô tả</th>
            <th>Hành động</th>
        </tr>

        @foreach($items as $i)
            <tr>
                <td>{{ $i->id }}</td>
                <td>{{ $i->name }}</td>
                <td>{{ number_format($i->price) }} VNĐ</td>
                <td>{{ $i->description }}</td>
                <td>
                    <a href="{{ route('admin.damage_types.edit', $i->id) }}" class="btn btn-warning btn-sm">Sửa</a>

                    <form action="{{ route('admin.damage_types.destroy', $i->id) }}" method="POST" style="display: inline;">
                        @csrf
                        @method('DELETE')
                        <button class="btn btn-danger btn-sm">Xóa</button>
                    </form>
                </td>
            </tr>
        @endforeach
    </table>
</div>
@endsection
