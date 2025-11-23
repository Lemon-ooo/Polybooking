@extends('layouts.admin')

@section('title', 'Room Types')

@section('content')
<div class="d-flex justify-content-between align-items-center mb-3">
    <h1>Room Types</h1>
    <a href="{{ route('admin.room-types.create') }}" class="btn btn-primary">+ New Room Type</a>
</div>

<table class="table table-bordered table-hover">
    <thead>
    <tr>
        <th>ID</th>
        <th>Name</th>
        <th>Base Price</th>
        <th>Total Rooms</th>
        <th>Max Guests</th>
       
        <th>Actions</th>
    </tr>
    </thead>
    <tbody>
    @forelse($roomTypes as $type)
        <tr>
            <td>{{ $type->room_type_id }}</td>
            <td>{{ $type->room_type_name }}</td>
            <td>{{ number_format($type->base_price, 0) }}</td>
            <td>{{ $type->total_rooms }}</td>
            <td>{{ $type->max_guests }}</td>
            <td>
                <a href="{{ route('admin.room-types.show', $type->room_type_id) }}" class="btn btn-sm btn-info">View</a>
                <a href="{{ route('admin.room-types.edit', $type->room_type_id) }}" class="btn btn-sm btn-warning">Edit</a>

                {{-- Nút quản lý ảnh cho từng room_type --}}
                <a href="{{ route('admin.room-types.images.index', $type->room_type_id) }}"
                class="btn btn-sm btn-secondary">
                    Images
                </a>

                <form action="{{ route('admin.room-types.destroy', $type->room_type_id) }}"
                    method="POST"
                    style="display:inline-block"
                    onsubmit="return confirm('Xóa loại phòng này?');">
                    @csrf
                    @method('DELETE')
                    <button class="btn btn-sm btn-danger" type="submit">Delete</button>
                </form>
            </td>


        </tr>
    @empty
        <tr>
            <td colspan="7">Chưa có loại phòng nào.</td>
        </tr>
    @endforelse
    </tbody>
</table>

{{ $roomTypes->links() }}
@endsection
