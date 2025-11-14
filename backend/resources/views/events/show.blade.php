<!-- filepath: c:\xampp\htdocs\Polybooking\backend\resources\views\admin\events\show.blade.php -->
@extends('layouts.admin')

@section('content')
<div class="container">
    <div class="row mb-4">
        <div class="col-md-8">
            <h1>{{ $event->name }}</h1>
        </div>
        <div class="col-md-4 text-end">
            <a href="{{ route('web.events.edit', $event->id) }}" class="btn btn-warning">Sửa</a>
            <a href="{{ route('web.events.index') }}" class="btn btn-secondary">Quay lại</a>
        </div>
    </div>

    <div class="card">
        <div class="card-body">
            @if ($event->image)
                <div class="mb-3">
                    <img src="{{ asset('storage/' . $event->image) }}" alt="{{ $event->name }}" style="max-width: 100%; height: auto;">
                </div>
            @endif

            <div class="mb-3">
                <strong>Mô tả:</strong>
                <p>{{ $event->description }}</p>
            </div>

            <div class="row">
                <div class="col-md-6">
                    <strong>Ngày bắt đầu:</strong>
                    <p>{{ $event->start_date->format('d/m/Y H:i') }}</p>
                </div>
                <div class="col-md-6">
                    <strong>Ngày kết thúc:</strong>
                    <p>{{ $event->end_date->format('d/m/Y H:i') }}</p>
                </div>
            </div>

            <div class="mb-3">
                <strong>Địa điểm:</strong>
                <p>{{ $event->location }}</p>
            </div>

            <div class="mb-3">
                <strong>Trạng thái:</strong>
                <p>
                    <span class="badge bg-{{ $event->status === 'upcoming' ? 'info' : ($event->status === 'ongoing' ? 'warning' : 'success') }}">
                        {{ ucfirst($event->status) }}
                    </span>
                </p>
            </div>
        </div>
    </div>
</div>
@endsection