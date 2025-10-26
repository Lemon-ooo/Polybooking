@extends('layouts.admin')

@section('content')
<div class="container">
    <h1>Danh sách phòng</h1>
    <a href="{{ route('rooms.create') }}" class="btn btn-primary mb-3">+ Thêm phòng mới</a>

    <table class="table table-bordered">
        <thead>
            <tr>
                <th>ID</th>
                <th>Số phòng</th>
                <th>Loại phòng</th>
                <th>Mô tả</th>
                <th>Giá</th>
                <th>Trạng thái</th>
                <th>Hành động</th>
            </tr>
        </thead>
        <tbody>
            @foreach($rooms as $room)
                <tr>
                    <td>{{ $room->id }}</td>
                    <td>{{ $room->room_number }}</td>
                    <td>{{ $room->roomType->name ?? '—' }}</td>
                    <td style="max-width: 250px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
            {{ $room->description ?? '—' }}
        </td> {{-- 👈 cột mô tả --}} 
                    <td>{{ number_format($room->price, 0) }} VNĐ</td>
                    <td>{{ $room->status }}</td>
                    <td>
<a href="{{ route('rooms.show', $room->room_id) }}" class="btn btn-info btn-sm">👁️ Xem</a>
<a href="{{ route('rooms.edit', $room->room_id) }}" class="btn btn-warning btn-sm">✏️ Sửa</a>
                        <form action="{{ route('rooms.destroy', $room) }}" method="POST" style="display:inline;">
                            @csrf @method('DELETE')
                            <button class="btn btn-sm btn-danger" onclick="return confirm('Xóa phòng này?')">Xóa</button>
                        </form>
                    </td>
                </tr>
            @endforeach
        </tbody>
    </table>
</div>
@endsection
