@extends('layouts.admin')

@section('content')
<div class="container mt-4">
    <h2 class="mb-3">Chi tiết Tour: {{ $tour->name }}</h2>

    {{-- Nút quay lại danh sách --}}
    <a href="{{ route('web.tours.index') }}" class="btn btn-secondary mb-3">↩ Quay lại</a>

    {{-- Thông báo thành công --}}
    @if(session('success'))
        <div class="alert alert-success">{{ session('success') }}</div>
    @endif

    <div class="card p-4 mb-4">
        <div class="row">
            <div class="col-md-4">
                @if($tour->image)
                    <img src="{{ asset('storage/'.$tour->image) }}" alt="{{ $tour->name }}" class="img-fluid rounded">
                @else
                    <div class="text-center py-5 bg-light rounded">Chưa có ảnh</div>
                @endif
            </div>
            <div class="col-md-8">
                <h4>{{ $tour->name }}</h4>
                <p><strong>Mô tả:</strong> {{ $tour->description ?? '-' }}</p>
                <p><strong>Ngày khởi hành:</strong> {{ $tour->start_date ? $tour->start_date->format('d/m/Y') : '-' }}</p>
                <p><strong>Địa điểm:</strong> {{ $tour->location }}</p>
                <p><strong>Giá:</strong> {{ number_format($tour->price) }} đ</p>
                <p><strong>Thời lượng:</strong> {{ $tour->duration }}</p>

                <div class="mt-3">
                    <a href="{{ route('web.tours.edit', $tour->id) }}" class="btn btn-warning">✏ Sửa</a>

                    <form action="{{ route('web.tours.destroy', $tour->id) }}" method="POST" style="display:inline-block;">
                        @csrf
                        @method('DELETE')
                        <button type="submit" class="btn btn-danger"
                            onclick="return confirm('Bạn có chắc chắn muốn xóa tour này không?')">
                            🗑 Xóa
                        </button>
                    </form>
                </div>
            </div>
        </div>
    </div>
</div>

{{-- CSS nhỏ --}}
<style>
    .card img {
        max-height: 250px;
        object-fit: cover;
    }
</style>
@endsection
