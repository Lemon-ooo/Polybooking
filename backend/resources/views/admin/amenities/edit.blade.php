@extends('layouts.admin')

@section('title', 'Edit Amenity')

@section('content')
<h1>Edit Amenity</h1>

@if ($errors->any())
    <div class="alert alert-danger">
        <ul class="mb-0">
            @foreach ($errors->all() as $error)
                <li>{{ $error }}</li>
            @endforeach
        </ul>
    </div>
@endif

<form action="{{ route('admin.amenities.update', $amenity->amenity_id) }}"
      method="POST"
      enctype="multipart/form-data">
    @csrf
    @method('PUT')

    <div class="mb-3">
        <label class="form-label">Amenity Name</label>
        <input type="text" name="amenity_name" class="form-control"
               value="{{ old('amenity_name', $amenity->amenity_name) }}" required>
    </div>

    <div class="mb-3">
        <label class="form-label">Description</label>
        <textarea name="description" class="form-control" rows="3">
            {{ old('description', $amenity->description) }}
        </textarea>
    </div>

    <div class="mb-3">
        <label class="form-label">Image</label><br>
        @if($amenity->amenity_image)
            <img src="{{ asset('storage/'.$amenity->amenity_image) }}" style="max-width:120px;" class="mb-2">
        @endif
        <input type="file" name="amenity_image" class="form-control">
    </div>

    <button class="btn btn-primary" type="submit">Update</button>
    <a href="{{ route('admin.amenities.index') }}" class="btn btn-secondary">Cancel</a>
</form>
@endsection
