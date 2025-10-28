@extends('layouts.admin')

@section('content')
<div class="container">
    <h1>📸 Thư viện ảnh</h1>
    <a href="{{ route('galleries.create') }}" class="btn btn-primary mb-3">+ Thêm ảnh mới</a>

    @forelse ($galleries as $category => $items)
        <h3 class="mt-4 mb-3 text-primary fw-bold">{{ $category }}</h3>

        <div class="d-flex flex-wrap gap-3">
            @foreach ($items as $gallery)
                <div class="card shadow-sm border-0" style="width: 250px;">
                    <img src="{{ asset('storage/' . $gallery->image_path) }}" 
                         alt="Gallery Image" 
                         class="card-img-top rounded" 
                         style="height:200px; object-fit:cover;">
                    <div class="card-body text-center p-2">
                        <p class="small text-muted mb-1">{{ $gallery->caption ?? '' }}</p>
                        <form action="{{ route('galleries.destroy', $gallery->gallery_id) }}" method="POST">
                            @csrf @method('DELETE')
                            <button class="btn btn-sm btn-danger">🗑️ Xóa</button>
                        </form>
                    </div>
                </div>
            @endforeach
        </div>
    @empty
        <p>Chưa có ảnh nào!</p>
    @endforelse
</div>
@endsection
