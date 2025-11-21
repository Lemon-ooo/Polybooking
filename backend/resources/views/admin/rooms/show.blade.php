@extends('layouts.admin')

@section('title', 'Room Detail')

@section('content')
<h1>Room Detail</h1>

<div class="mb-3">
    <strong>ID:</strong> {{ $room->room_id }}
</div>
<div class="mb-3">
    <strong>Room Number:</strong> {{ $room->room_number }}
</div>
<div class="mb-3">
    <strong>Room Type:</strong> {{ $room->roomType->room_type_name ?? '-' }}
</div>
<div class="mb-3">
    <strong>Status:</strong> {{ $room->room_status }}
</div>
<div class="mb-3">
    <strong>Description:</strong><br>
    {{ $room->description }}
</div>

<a href="{{ route('admin.rooms.index') }}" class="btn btn-secondary">Back</a>
<a href="{{ route('admin.rooms.edit', $room->room_id) }}" class="btn btn-warning">Edit</a>
@endsection
