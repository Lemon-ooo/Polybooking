@extends('layouts.admin')

@section('content')
<div class="container">
    <h1>Danh sách phòng</h1>
    <a href="{{ route('rooms.create') }}" class="btn btn-primary mb-3">+ Thêm phòng mới</a>

    <table class="table table-bordered table-striped align-middle">
        <thead class="table-light">
            <tr>
                <th>ID</th>
                <th>Số phòng</th>
                <th>Loại phòng</th>
                <th>Mô tả</th>
                <th>Giá</th>
                <th>Trạng thái</th>
<<<<<<< HEAD
                <th>Tiện ích</th> {{-- 👈 thêm cột tiện ích --}}
=======
                <th>Ảnh phòng</th>
>>>>>>> origin/toanndph49547
                <th>Hành động</th>
            </tr>
        </thead>
        <tbody>
            @foreach($rooms as $room)
                <tr>
                    <td>{{ $room->room_id }}</td>
                    <td>{{ $room->room_number }}</td>
                    <td>{{ $room->roomType->name ?? '—' }}</td>
                    <td style="max-width: 250px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
                        {{ $room->description ?? '—' }}
                    </td>
                    <td>{{ number_format($room->price, 0) }} VNĐ</td>
                    <td>{{ ucfirst($room->status) }}</td>
                    
                    {{-- ✅ Hiển thị tiện ích --}}
                    <td>
<<<<<<< HEAD
                        @if($room->amenities && $room->amenities->count() > 0)
                            <div class="d-flex flex-wrap" style="gap: 4px;">
                                @foreach($room->amenities as $amenity)
                                    <span class="badge bg-success text-white">{{ $amenity->name }}</span>
                                @endforeach
                            </div>
                        @else
                            <span class="text-muted">Không có</span>
                        @endif
                    </td>

                    {{-- Hành động --}}
                    <td class="text-center">
                        <a href="{{ route('rooms.show', $room->room_id) }}" class="btn btn-info btn-sm">👁️ Xem</a>
                        <a href="{{ route('rooms.edit', $room->room_id) }}" class="btn btn-warning btn-sm">✏️ Sửa</a>
                        <form action="{{ route('rooms.destroy', $room->room_id) }}" method="POST" style="display:inline-block;">
=======
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
>>>>>>> origin/toanndph49547
                            @csrf @method('DELETE')
                            <button class="btn btn-danger btn-sm" onclick="return confirm('Xóa phòng này?')">🗑️ Xóa</button>
                        </form>
                    </td>
                </tr>
            @endforeach
        </tbody>
    </table>
</div>

<style>
.badge {
    font-size: 12px;
    border-radius: 6px;
    padding: 5px 8px;
}
</style>
@endsection
