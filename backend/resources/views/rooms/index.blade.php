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
                <th>Ảnh phòng</th>
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
                    </td>
                    <td>{{ number_format($room->price, 0) }} VNĐ</td>
                    <td>{{ $room->status }}</td>
                    <td>
                        @php
                            $imagePath = $room->images->first()->image_path ?? null;
                        @endphp

                        @if ($imagePath)
                            <img src="{{ asset('storage/' . $imagePath) }}"
                                 alt="Ảnh phòng {{ $room->room_number }}"
                                 width="100" height="80"
                                 style="object-fit: cover; cursor: pointer; border-radius: 5px;"
                                 onclick="window.location='{{ route('room.images.index', $room->id) }}'">
                        @else
                            <img src="{{ asset('images/no-image.png') }}"
                                 alt="Không có ảnh"
                                 width="100" height="80"
                                 style="object-fit: cover; opacity: 0.7; cursor: pointer;"
                                 onclick="window.location='{{ route('room.images.index', $room->id) }}'">
                        @endif
                    </td>

                    <td>
                        <a href="{{ route('rooms.show', $room->id) }}" class="btn btn-info btn-sm">👁️ Xem</a>
                        <a href="{{ route('rooms.edit', $room) }}" class="btn btn-sm btn-warning">Sửa</a>
                        <a href="{{ route('room.images.index', $room->id) }}" class="btn btn-sm btn-secondary">🖼️ Album ảnh</a>
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
