@extends('layouts.admin')

@section('title', 'Services')

@section('content')
<div class="d-flex justify-content-between align-items-center mb-3">
    <h1>Services</h1>
    <a href="{{ route('admin.services.create') }}" class="btn btn-primary">+ New Service</a>
</div>

<table class="table table-bordered table-hover">
    <thead>
    <tr>
        <th>ID</th>
        <th>Service Name</th>
        <th>Price</th>
        <th>Image</th>
        <th>Description</th>
        <th>Actions</th>
    </tr>
    </thead>
    <tbody>
    @forelse($services as $service)
        <tr>
            <td>{{ $service->service_id }}</td>
            <td>{{ $service->service_name }}</td>
            <td>{{ number_format($service->service_price, 0) }}</td>
            <td>
                @if($service->service_image)
                    <img src="{{ asset('storage/'.$service->service_image) }}" style="max-width:60px;">
                @endif
            </td>
            <td>{{ \Illuminate\Support\Str::limit($service->description, 50) }}</td>
            <td>
                <a href="{{ route('admin.services.edit', $service->service_id) }}" class="btn btn-sm btn-warning">Edit</a>
                <form action="{{ route('admin.services.destroy', $service->service_id) }}"
                      method="POST"
                      style="display:inline-block"
                      onsubmit="return confirm('Xóa dịch vụ này?');">
                    @csrf
                    @method('DELETE')
                    <button class="btn btn-sm btn-danger" type="submit">Delete</button>
                </form>
            </td>
        </tr>
    @empty
        <tr>
            <td colspan="6">Chưa có dịch vụ nào.</td>
        </tr>
    @endforelse
    </tbody>
</table>

{{ $services->links() }}
@endsection

