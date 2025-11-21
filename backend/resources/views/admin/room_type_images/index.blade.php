@extends('layouts.admin')

@section('title', 'Room Type Images')

@section('content')
<h1>Images of: {{ $roomType->room_type_name }}</h1>

<a href="{{ route('admin.room-types.images.create', $roomType->room_type_id) }}" class="btn btn-primary mb-3">
    + Add Image
</a>

<table class="table table-bordered">
    <thead>
    <tr>
        <th>ID</th>
        <th>Preview</th>
        <th>Type</th>
        <th>Sort Order</th>
        <th>Actions</th>
    </tr>
    </thead>
    <tbody>
    @forelse($images as $img)
        <tr>
            <td>{{ $img->image_id }}</td>
            <td>
                <img src="{{ asset('storage/'.$img->image_url) }}" style="max-width:120px;">
            </td>
            <td>{{ $img->image_type }}</td>
            <td>{{ $img->sort_order }}</td>
            <td>
                <a href="{{ route('admin.room-types.images.edit', [$roomType->room_type_id, $img->image_id]) }}"
                   class="btn btn-sm btn-warning">Edit</a>
                <form action="{{ route('admin.room-types.images.destroy', [$roomType->room_type_id, $img->image_id]) }}"
                      method="POST" style="display:inline-block"
                      onsubmit="return confirm('Xóa ảnh này?');">
                    @csrf
                    @method('DELETE')
                    <button class="btn btn-sm btn-danger" type="submit">Delete</button>
                </form>
            </td>
        </tr>
    @empty
        <tr>
            <td colspan="5">Chưa có ảnh nào.</td>
        </tr>
    @endforelse
    </tbody>
</table>

<a href="{{ route('admin.room-types.index') }}" class="btn btn-secondary">Back to Room Types</a>
@endsection
