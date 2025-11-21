@extends('layouts.admin')

@section('title', 'Create Room')

@section('content')
<h1>Create Room</h1>

@if ($errors->any())
    <div class="alert alert-danger">
        <ul class="mb-0">
            @foreach ($errors->all() as $error)
                <li>{{ $error }}</li>
            @endforeach
        </ul>
    </div>
@endif

<form action="{{ route('admin.rooms.store') }}" method="POST">
    @csrf

    <div class="mb-3">
        <label class="form-label">Room Number</label>
        <input type="text" name="room_number" class="form-control"
               value="{{ old('room_number') }}" required>
    </div>

    <div class="mb-3">
        <label class="form-label">Room Type</label>
        <select name="room_type_id" class="form-control" required>
            <option value="">-- Select Room Type --</option>
            @foreach($roomTypes as $type)
                <option value="{{ $type->room_type_id }}"
                    {{ old('room_type_id') == $type->room_type_id ? 'selected' : '' }}>
                    {{ $type->room_type_name }}
                </option>
            @endforeach
        </select>
    </div>

    <div class="mb-3">
        <label class="form-label">Status</label>
        <select name="room_status" class="form-control" required>
            @foreach(['available','booked','maintenance','unavailable'] as $status)
                <option value="{{ $status }}"
                    {{ old('room_status') == $status ? 'selected' : '' }}>
                    {{ ucfirst($status) }}
                </option>
            @endforeach
        </select>
    </div>

    <div class="mb-3">
        <label class="form-label">Description</label>
        <textarea name="description" class="form-control" rows="3">{{ old('description') }}</textarea>
    </div>

    <button class="btn btn-primary" type="submit">Save</button>
    <a href="{{ route('admin.rooms.index') }}" class="btn btn-secondary">Cancel</a>
</form>
@endsection
