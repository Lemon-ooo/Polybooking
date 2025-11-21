@extends('layouts.admin')

@section('title', 'Create Amenity')

@section('content')
<h1>Create Amenity</h1>

@if ($errors->any())
    <div class="alert alert-danger">
        <ul class="mb-0">
            @foreach ($errors->all() as $error)
                <li>{{ $error }}</li>
            @endforeach
        </ul>
    </div>
@endif

<form action="{{ route('admin.amenities.store') }}" method="POST" enctype="multipart/form-data">
    @csrf

    <div class="mb-3">
        <label class="form-label">Amenity Name</label>
        <input type="text" name="amenity_name" class="form-control" value="{{ old('amenity_name') }}" required>
    </div>

    <div class="mb-3">
        <label class="form-label">Description</label>
        <textarea name="description" class="form-control" rows="3">{{ old('description') }}</textarea>
    </div>

    <div class="mb-3">
        <label class="form-label">Image</label>
        <input type="file" name="amenity_image" class="form-control">
    </div>

    <button class="btn btn-primary" type="submit">Save</button>
    <a href="{{ route('admin.amenities.index') }}" class="btn btn-secondary">Cancel</a>
</form>
@endsection
