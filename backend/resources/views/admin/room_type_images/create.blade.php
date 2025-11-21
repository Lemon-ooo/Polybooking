@extends('layouts.admin')

@section('title', 'Add Image')

@section('content')
<h1>Add Image for: {{ $roomType->room_type_name }}</h1>

@if ($errors->any())
    <div class="alert alert-danger">
        <ul class="mb-0">
            @foreach ($errors->all() as $err)
                <li>{{ $err }}</li>
            @endforeach
        </ul>
    </div>
@endif

<form action="{{ route('admin.room-types.images.store', $roomType->room_type_id) }}"
      method="POST"
      enctype="multipart/form-data">
    @csrf

    <div class="mb-3">
        <label class="form-label">Image file</label>
        <input type="file" name="image" class="form-control" required>
    </div>

    <div class="mb-3">
        <label class="form-label">Image Type</label>
        <select name="image_type" class="form-control" required>
            <option value="main">Main</option>
            <option value="secondary" selected>Secondary</option>
        </select>
    </div>

    <div class="mb-3">
        <label class="form-label">Sort Order</label>
        <input type="number" name="sort_order" class="form-control" value="0" min="0">
    </div>

    <button class="btn btn-primary" type="submit">Save</button>
    <a href="{{ route('admin.room-types.images.index', $roomType->room_type_id) }}" class="btn btn-secondary">Cancel</a>
</form>
@endsection
