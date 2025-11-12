@extends('layouts.admin')

@section('content')
<h2>Danh sách tiện ích</h2>

@if (session('success'))
    <div class="alert alert-success">{{ session('success') }}</div>
@endif

<a href="{{ route('web.amenities.create') }}" class="btn btn-primary">+ Thêm tiện ích</a>

<table class="table">
    <thead>
        <tr>
            <th>ID</th>
            <th>Tên tiện ích</th>
            <th>Phân loại</th>
            <th>Icon</th>
            <th>Mô tả</th>
            <th>Hành động</th>
        </tr>
    </thead>
    <tbody>
        @foreach ($amenities as $item)
            <tr>
                <td>{{ $item->amenity_id }}</td>
                <td>{{ $item->name }}</td>
                <td>{{ $item->category ?? '-' }}</td>
                <td>
                    @if($item->icon_path)
                        <img src="{{ $item->iconUrl }}" width="40" style="border-radius:6px; border:1px solid #ddd;">
                    @else
                        —
                    @endif
                </td>
                <td>{{ Str::limit($item->description, 50) }}</td>
                <td>
                    <a href="{{ route('web.amenities.edit', $item->amenity_id) }}" class="btn btn-sm btn-warning">Sửa</a>
                    <form action="{{ route('web.amenities.destroy', $item->amenity_id) }}" method="POST" style="display:inline;">
                        @csrf
                        @method('DELETE')
                        <button type="submit" class="btn btn-sm btn-danger" onclick="return confirm('Xóa thật nhé?')">Xóa</button>
                    </form>
                </td>
            </tr>
        @endforeach
    </tbody>
</table>

{{ $amenities->links() }}
@endsection