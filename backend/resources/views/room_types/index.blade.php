@extends('layouts.admin')

@section('content')
<div class="container mt-4">
    <h2 class="mb-4 fw-bold text-primary">Danh sách loại phòng</h2>

    {{-- Thông báo --}}
    @if(session('success'))
        <div class="alert alert-success shadow-sm">
            {{ session('success') }}
        </div>
    @endif

    {{-- Nút thêm mới --}}
    <div class="mb-3">
        <a href="{{ route('web.room-types.create') }}" class="btn btn-primary">
            + Thêm mới
        </a>
    </div>

    {{-- Bảng danh sách --}}
    <div class="card shadow-sm">
        <div class="card-body p-0">
            <table class="table table-hover align-middle mb-0">
                <thead class="table-light">
                    <tr>
                        <th style="width: 50px;">ID</th>
                        <th>Tên</th>
                        <th>Mô tả</th>
                        <th>Giá cơ bản (VNĐ)</th>
                        <th style="width: 200px;">Hành động</th>
                    </tr>
                </thead>
                <tbody>
                    @forelse($roomTypes as $roomType)
                        <tr>
                            <td>{{ $roomType->id }}</td>
                            <td class="fw-semibold">{{ $roomType->name }}</td>
                            <td>{{ $roomType->description ?? '—' }}</td>
                            <td>{{ number_format($roomType->base_price, 2) }}</td>
                            <td>
                                <a href="{{ route('web.room-types.show', $roomType) }}" class="btn btn-sm btn-info text-white">Xem</a>
                                <a href="{{ route('web.room-types.edit', $roomType) }}" class="btn btn-sm btn-warning text-white">Sửa</a>
                                <form action="{{ route('web.room-types.destroy', $roomType) }}" method="POST" style="display:inline;" onsubmit="return confirm('Bạn có chắc muốn xóa loại phòng này?');">
                                    @csrf
                                    @method('DELETE')
                                    <button type="submit" class="btn btn-sm btn-danger">Xóa</button>
                                </form>
                            </td>
                        </tr>
                    @empty
                        <tr>
                            <td colspan="5" class="text-center text-muted py-4">Chưa có loại phòng nào.</td>
                        </tr>
                    @endforelse
                </tbody>
            </table>
        </div>
    </div>
</div>
@endsection
