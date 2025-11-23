@extends('layouts.admin')

@section('title', 'Rooms')

@section('content')
<div class="d-flex justify-content-between align-items-center mb-3">
    <h1>Rooms</h1>
    <a href="{{ route('admin.rooms.create') }}" class="btn btn-primary">+ New Room</a>
</div>

<table class="table table-bordered table-hover">
    <thead>
    <tr>
        <th>ID</th>
        <th>Room Number</th>
        <th>Room Type</th>
        <th>Status</th>
        <th>Description</th>
        <th>Actions</th>
    </tr>
    </thead>
    <tbody>
    @forelse($rooms as $room)
        <tr>
            <td>{{ $room->room_id }}</td>
            <td>{{ $room->room_number }}</td>
            <td>{{ $room->roomType->room_type_name ?? '-' }}</td>
            <td>{{ $room->room_status }}</td>
            <td>{{ \Illuminate\Support\Str::limit($room->description, 50) }}</td>
            <td>
                <a href="{{ route('admin.rooms.show', $room->room_id) }}" class="btn btn-sm btn-info">View</a>
                <a href="{{ route('admin.rooms.edit', $room->room_id) }}" class="btn btn-sm btn-warning">Edit</a>
                <form action="{{ route('admin.rooms.destroy', $room->room_id) }}"
                      method="POST"
                      style="display:inline-block"
                      onsubmit="return confirm('Xóa phòng này?');">
                    @csrf
                    @method('DELETE')
                    <button class="btn btn-sm btn-danger" type="submit">Delete</button>
                </form>
            </td>
        </tr>
    @empty
        <tr>
            <td colspan="6">Chưa có phòng nào.</td>
        </tr>
    @endforelse
    </tbody>
</table>

{{ $rooms->links() }}
@endsection
