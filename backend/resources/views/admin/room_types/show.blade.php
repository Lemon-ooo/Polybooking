@extends('layouts.admin')

@section('title', 'Room Type Detail')

@section('content')
<h1>Room Type Detail</h1>

<div class="mb-3">
    <strong>ID:</strong> {{ $roomType->room_type_id }}
</div>
<div class="mb-3">
    <strong>Name:</strong> {{ $roomType->room_type_name }}
</div>
<div class="mb-3">
    <strong>Base Price:</strong> {{ number_format($roomType->base_price, 0) }}
</div>
<div class="mb-3">
    <strong>Total Rooms:</strong> {{ $roomType->total_rooms }}
</div>
<div class="mb-3">
    <strong>Max Guests:</strong> {{ $roomType->max_guests }}
</div>
<div class="mb-3">
    <strong>Description:</strong><br>
    {{ $roomType->description }}
</div>
<div class="mb-3">
    <strong>Main Image:</strong><br>
    @if($roomType->room_type_image)
        <img src="{{ asset('storage/'.$roomType->room_type_image) }}" alt="" style="max-width: 300px">
    @else
        <em>No image</em>
    @endif
</div>
<div class="mb-3">
    <strong>Amenities:</strong><br>
    @foreach($roomType->amenities as $amenity)
        <span class="badge bg-info text-dark">{{ $amenity->amenity_name }}</span>
    @endforeach
</div>
<a href="{{ route('admin.room-types.images.index', $roomType->room_type_id) }}"
   class="btn btn-outline-primary">
    Manage Images
</a>

<a href="{{ route('admin.room-types.index') }}" class="btn btn-secondary">Back</a>
<a href="{{ route('admin.room-types.edit', $roomType->room_type_id) }}" class="btn btn-warning">Edit</a>
@endsection
