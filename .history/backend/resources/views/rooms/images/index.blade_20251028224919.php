@extends('layouts.admin')

@section('content')
<div class="container">
    <div class="d-flex justify-content-between align-items-center mb-4">
        <h2>Album ảnh của phòng: {{ $room->name }}</h2>
        <a href="{{ route('rooms.index') }}" class="btn btn-secondary">Quay lại danh sách</a>
    </div>

    <!-- Form Upload -->
    <div class="card mb-4">
        <div class="card-body">
            <form action="{{ route('room.images.store', $room->room_id) }}" method="POST" enctype="multipart/form-data">

                @csrf
                <div class="mb-3">
                    <label for="images" class="form-label">Chọn ảnh để tải lên (nhiều ảnh)</label>
                    <input type="file" name="images[]" id="images" class="form-control" multiple accept="image/*" required>
                </div>
                <button type="submit" class="btn btn-primary">Tải lên</button>
            </form>
        </div>
    </div>

    <!-- Hiển thị ảnh -->
    <div class="row">
        @forelse($room->images as $image)
            <div class="col-md-3 mb-4">
                <div class="card">
                    <img src="{{ asset('storage/' . $image->image_path) }}" class="card-img-top" alt="Room image">
                    <div class="card-body p-2 text-center">
                        <form action="{{ url('/room-images/' . $image->id) }}" method="POST" onsubmit="return confirm('Bạn có chắc muốn xóa ảnh này?')">
                            @csrf
                            @method('DELETE')
                            <button type="submit" class="btn btn-danger btn-sm">Xóa</button>
                        </form>
                    </div>
                </div>
            </div>
        @empty
            <div class="col-12">
                <p class="text-muted">Chưa có ảnh nào được tải lên.</p>
            </div>
        @endforelse
    </div>
</div>
@endsection