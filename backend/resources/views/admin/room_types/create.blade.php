@extends('layouts.admin')

@section('title', 'Create Room Type')

@section('content')
<h1>Create Room Type</h1>

@if ($errors->any())
    <div class="alert alert-danger">
        <ul class="mb-0">
            @foreach ($errors->all() as $error)
                <li>{{ $error }}</li>
            @endforeach
        </ul>
    </div>
@endif

<form action="{{ route('admin.room-types.store') }}" method="POST" enctype="multipart/form-data">
    @csrf

    <div class="mb-3">
        <label class="form-label">Room Type Name</label>
        <input type="text" name="room_type_name" class="form-control"
               value="{{ old('room_type_name') }}" required>
    </div>

    <div class="mb-3">
        <label class="form-label">Base Price</label>
        <input type="number" step="0.01" name="base_price" class="form-control"
               value="{{ old('base_price', 0) }}" required>
    </div>

    <div class="mb-3">
        <label class="form-label">Max Guests</label>
        <input type="number" name="max_guests" class="form-control"
               value="{{ old('max_guests', 1) }}" required min="1">
    </div>

    <div class="mb-3">
        <label class="form-label">Description</label>
        <textarea name="description" class="form-control" rows="3">{{ old('description') }}</textarea>
    </div>

    <div class="mb-3">
        <label class="form-label">Main Image</label>
        <input type="file" name="room_type_image" class="form-control">
    </div>

    <div class="mb-3">
        <label class="form-label">Amenities</label>
        <div class="row">
            @foreach($amenities as $amenity)
                <div class="col-md-3">
                    <div class="form-check">
                        <input class="form-check-input"
                               type="checkbox"
                               name="amenity_ids[]"
                               value="{{ $amenity->amenity_id }}"
                               id="amenity_{{ $amenity->amenity_id }}">
                        <label class="form-check-label" for="amenity_{{ $amenity->amenity_id }}">
                            {{ $amenity->amenity_name }}
                        </label>
                    </div>
                </div>
            @endforeach
        </div>
    </div>

    <button class="btn btn-primary" type="submit">Save</button>
    <a href="{{ route('admin.room-types.index') }}" class="btn btn-secondary">Cancel</a>
</form>
@endsection
