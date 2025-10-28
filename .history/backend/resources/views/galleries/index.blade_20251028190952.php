@extends('layouts.admin')

@section('content')
<div class="container">
    <h1>📸 Thư viện ảnh</h1>
    <a href="{{ route('galleries.create') }}" class="btn btn-primary mb-3">+ Thêm ảnh mới</a>

    <div class="row g-3">
        @forelse($galleries as $gallery)
            <div class="col-md-3">
                <div class="card shadow-sm">
                    <img src="{{ asset('storage/' . $gallery->image_path) }}" alt="Gallery Image" width="300">

                    <div class="card-body text-center">
                        <h6 class="text-muted mb-1">{{ $gallery->gallery_category }}</h6>
                        <p class="small">{{ $gallery->caption ?? '' }}</p>
                        <form action="{{ route('galleries.destroy', $gallery->gallery_id) }}" method="POST">
                            @csrf @method('DELETE')
                            <button class="btn btn-sm btn-danger">🗑️ Xóa</button>
                        </form>
                    </div>
                </div>
            </div>
        @empty
            <p>Chưa có ảnh nào!</p>
        @endforelse
    </div>
</div>
@endsection
