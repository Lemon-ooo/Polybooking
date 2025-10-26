@extends('layouts.admin')

@section('content')
<h2>Danh sách tiện ích</h2>

@if (session('success'))
    <div class="alert">{{ session('success') }}</div>
@endif

<a href="{{ route('amenities.create') }}" class="btn">+ Thêm tiện ích</a>

<table>
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
                    @if($item->icon_url)
                        <img src="{{ $item->icon_url }}" width="30">
                    @else
                        —
                    @endif
                </td>
                <td>{{ Str::limit($item->description, 50) }}</td>
                <td>
                    <a href="{{ route('amenities.edit', $item->amenity_id) }}" class="btn">Sửa</a>
                    <form action="{{ route('amenities.destroy', $item->amenity_id) }}" method="POST" style="display:inline;">
                        @csrf
                        @method('DELETE')
                        <button class="btn" style="background:#e53935;">Xóa</button>
                    </form>
                </td>
            </tr>
        @endforeach
    </tbody>
</table>

{{ $amenities->links() }}
@endsection
