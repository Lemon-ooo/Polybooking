@extends('layouts.admin')

@section('title', 'Create Service')

@section('content')
<h1>Create Service</h1>

@if ($errors->any())
    <div class="alert alert-danger">
        <ul class="mb-0">
            @foreach ($errors->all() as $error)
                <li>{{ $error }}</li>
            @endforeach
        </ul>
    </div>
@endif

<form action="{{ route('admin.services.store') }}" method="POST" enctype="multipart/form-data">
    @csrf

    <div class="mb-3">
        <label class="form-label">Service Name</label>
        <input type="text" name="service_name" class="form-control"
               value="{{ old('service_name') }}" required>
    </div>

    <div class="mb-3">
        <label class="form-label">Price</label>
        <input type="number" step="0.01" name="service_price" class="form-control"
               value="{{ old('service_price', 0) }}" required>
    </div>

    <div class="mb-3">
        <label class="form-label">Description</label>
        <textarea name="description" class="form-control" rows="3">{{ old('description') }}</textarea>
    </div>

    <div class="mb-3">
        <label class="form-label">Image</label>
        <input type="file" name="service_image" class="form-control">
    </div>

    <button class="btn btn-primary" type="submit">Save</button>
    <a href="{{ route('admin.services.index') }}" class="btn btn-secondary">Cancel</a>
</form>
@endsection
