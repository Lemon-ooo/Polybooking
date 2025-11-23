@extends('layouts.admin')

@section('title', 'Amenities')

@section('content')
<div class="d-flex justify-content-between align-items-center mb-3">
    <h1>Amenities</h1>
    <a href="{{ route('admin.amenities.create') }}" class="btn btn-primary">+ New Amenity</a>
</div>

<table class="table table-bordered table-hover">
    <thead>
    <tr>
        <th>ID</th>
        <th>Name</th>
        <th>Image</th>
        <th>Description</th>
        <th>Actions</th>
    </tr>
    </thead>
    <tbody>
    @forelse($amenities as $amenity)
        <tr>
            <td>{{ $amenity->amenity_id }}</td>
            <td>{{ $amenity->amenity_name }}</td>
            <td>
                @if($amenity->amenity_image)
                    <img src="{{ asset('storage/'.$amenity->amenity_image) }}" style="max-width:60px;">
                @endif
            </td>
            <td>{{ \Illuminate\Support\Str::limit($amenity->description, 50) }}</td>
            <td>
                <a href="{{ route('admin.amenities.edit', $amenity->amenity_id) }}" class="btn btn-sm btn-warning">Edit</a>
                <form action="{{ route('admin.amenities.destroy', $amenity->amenity_id) }}"
                      method="POST"
                      style="display:inline-block"
                      onsubmit="return confirm('Xóa tiện ích này?');">
                    @csrf
                    @method('DELETE')
                    <button class="btn btn-sm btn-danger" type="submit">Delete</button>
                </form>
            </td>
        </tr>
    @empty
        <tr>
            <td colspan="5">Chưa có tiện ích nào.</td>
        </tr>
    @endforelse
    </tbody>
</table>

{{ $amenities->links() }}
@endsection
