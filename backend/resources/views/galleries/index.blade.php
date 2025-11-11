@extends('layouts.admin')

@section('content')
<div class="container">
    <h1>📸 Thư viện ảnh</h1>
    <a href="{{ route('web.galleries.create') }}" class="btn btn-primary mb-3">+ Thêm ảnh mới</a>

    @forelse ($galleries as $category => $items)
        <h3 class="mt-4 mb-3 text-primary fw-bold">{{ $category }}</h3>

        <div class="gallery-row">
            @foreach ($items as $gallery)
                <div class="gallery-item">
                    <div class="card shadow-sm border-0">
                        <div class="image-container">
                            <img src="{{ asset('storage/app/' . $gallery->image_path) }}" 
                                 alt="Gallery Image" 
                                 class="card-img-top rounded">
                        </div>
                        <div class="card-body text-center p-2">
                            <p class="small text-muted mb-1">{{ $gallery->caption ?? '' }}</p>
                            <form action="{{ route('web.galleries.destroy', $gallery->gallery_id) }}" method="POST">
                                @csrf @method('DELETE')
                                <button class="btn btn-sm btn-danger">🗑️ Xóa</button>
                            </form>
                        </div>
                    </div>
                </div>
            @endforeach
        </div>
    @empty
        <p>Chưa có ảnh nào!</p>
    @endforelse
</div>

<style>
/* Container của từng category */
.gallery-row {
    display: flex;
    flex-wrap: wrap;
    gap: 20px;
}

/* Mỗi item */
.gallery-item {
    width: 250px;
}

/* Ảnh */
.image-container {
    height: 200px;
    overflow: hidden;
    border-radius: 10px;
}

.image-container img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform .3s ease;
}

/* Hiệu ứng hover zoom nhẹ */
.image-container:hover img {
    transform: scale(1.05);
}
</style>
@endsection
