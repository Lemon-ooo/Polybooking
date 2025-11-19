@extends('layouts.admin')

@section('content')
<div class="container mt-4">
    <h2 class="mb-3">Danh sách Tour</h2>

    {{-- Nút thêm tour mới --}}
    <a href="{{ route('web.tours.create') }}" class="btn btn-primary mb-3">+ Thêm Tour</a>

    {{-- Hiển thị thông báo thành công --}}
    @if(session('success'))
        <div class="alert alert-success">{{ session('success') }}</div>
    @endif

    <table class="table table-bordered table-striped">
        <thead>
            <tr>
                <th>Tên Tour</th>
                <th>Mô tả</th>
                <th>Ngày khởi hành</th>
                <th>Địa điểm</th>
                <th>Giá</th>
                <th>Ảnh</th>
                <th>Hành động</th>
            </tr>
        </thead>
        <tbody>
            @forelse($tours as $tour)
                <tr>
                    <td>{{ $tour->name }}</td>
                    <td>{{ Str::limit($tour->description, 50) }}</td>
                    <td>{{ $tour->start_date ? $tour->start_date->format('d/m/Y') : '-' }}</td>
                    <td>{{ $tour->location }}</td>
                    <td>{{ number_format($tour->price) }} đ</td>
                    <td>
                        @if($tour->image)
                            <img src="{{ asset('storage/'.$tour->image) }}" width="80" alt="{{ $tour->name }}">
                        @else
                            -
                        @endif
                    </td>
                    <td>
                        <a href="{{ route('web.tours.show', $tour->id) }}" class="btn btn-info btn-sm">Xem</a>
                        <a href="{{ route('web.tours.edit', $tour->id) }}" class="btn btn-warning btn-sm">Sửa</a>
                        <form action="{{ route('web.tours.destroy', $tour->id) }}" method="POST" style="display:inline-block;">
                            @csrf
                            @method('DELETE')
                            <button type="submit" class="btn btn-danger btn-sm"
                                onclick="return confirm('Bạn có chắc chắn muốn xóa tour này không?')">
                                Xóa
                            </button>
                        </form>
                    </td>
                </tr>
            @empty
                <tr>
                    <td colspan="7" class="text-center">Chưa có tour nào</td>
                </tr>
            @endforelse
        </tbody>
    </table>
</div>

{{-- Optional: CSS nhỏ cho table --}}
<style>
    .table img {
        border-radius: 5px;
    }
</style>
@endsection
