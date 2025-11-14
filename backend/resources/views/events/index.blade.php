<!-- filepath: c:\xampp\htdocs\Polybooking\backend\resources\views\admin\events\index.blade.php -->
@extends('layouts.admin')

@section('content')
<div class="container">
    <div class="row mb-4">
        <div class="col-md-8">
            <h1>Danh sách Events</h1>
        </div>
        <div class="col-md-4 text-end">
            <a href="{{ route('web.events.create') }}" class="btn btn-primary">+ Tạo Event mới</a>
        </div>
    </div>

    @if ($message = Session::get('success'))
        <div class="alert alert-success alert-dismissible fade show" role="alert">
            {{ $message }}
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        </div>
    @endif

    <div class="table-responsive">
        <table class="table table-striped table-hover">
            <thead class="table-dark">
                <tr>
                    <th>ID</th>
                    <th>Tên Event</th>
                    <th>Địa điểm</th>
                    <th>Ngày bắt đầu</th>
                    <th>Ngày kết thúc</th>
                    <th>Trạng thái</th>
                    <th>Hành động</th>
                </tr>
            </thead>
            <tbody>
                @forelse ($events as $event)
                    <tr>
                        <td>{{ $event->id }}</td>
                        <td>{{ $event->name }}</td>
                        <td>{{ $event->location }}</td>
                        <td>{{ $event->start_date->format('d/m/Y H:i') }}</td>
                        <td>{{ $event->end_date->format('d/m/Y H:i') }}</td>
                        <td>
                            <span class="badge bg-{{ $event->status === 'upcoming' ? 'info' : ($event->status === 'ongoing' ? 'warning' : 'success') }}">
                                {{ ucfirst($event->status) }}
                            </span>
                        </td>
                        <td>
                            <a href="{{ route('web.events.show', $event->id) }}" class="btn btn-sm btn-info">Xem</a>
                            <a href="{{ route('web.events.edit', $event->id) }}" class="btn btn-sm btn-warning">Sửa</a>
                            <form action="{{ route('web.events.destroy', $event->id) }}" method="POST" style="display:inline;">
                                @csrf
                                @method('DELETE')
                                <button type="submit" class="btn btn-sm btn-danger" onclick="return confirm('Bạn chắc chắn muốn xóa?')">Xóa</button>
                            </form>
                        </td>
                    </tr>
                @empty
                    <tr>
                        <td colspan="7" class="text-center text-muted">Không có event nào</td>
                    </tr>
                @endforelse
            </tbody>
        </table>
    </div>

    <div class="d-flex justify-content-center">
        {{ $events->links() }}
    </div>
</div>
@endsection