@extends('layouts.admin')

@section('content')
<div class="page-container">
    <div class="header-row">
        <h2 class="page-title">📋 Danh sách Dịch vụ</h2>
        <a href="{{ route('services.create') }}" class="btn btn-primary">➕ Thêm dịch vụ mới</a>
    </div>

    <div class="card">
        <table class="table table-bordered table-striped">
            <thead class="table-dark">
                <tr>
                    <th>ID</th>
                    <th>Tên dịch vụ</th>
                    <th>Mô tả</th>
                    <th>Giá</th>
                    <th>Hình ảnh</th>
                    <th>Hành động</th>
                </tr>
            </thead>
            <tbody>
                @forelse ($services as $service)
                    <tr>
                        <td>{{ $service->id }}</td>
                        <td>{{ $service->name }}</td>
                        <td>{{ $service->description }}</td>
                        <td>{{ number_format($service->price, 0, ',', '.') }} VND</td>
                        <td>
                            @if ($service->image)
                                <img src="{{ $service->image }}" alt="Hình" width="60">
                            @else
                                <em>Không có ảnh</em>
                            @endif
                        </td>
                        <td>
                            <div class="button-group">
                                <a href="{{ route('services.show', $service->id) }}" class="btn btn-primary">xem</a>
                                <a href="{{ route('services.edit', $service->id) }}" class="btn btn-primary">✏️ Sửa</a>
                                <form action="{{ route('services.destroy', $service->id) }}" method="POST" style="display:inline;">
                                    @csrf
                                    @method('DELETE')
                                    <button type="submit" class="btn btn-danger" onclick="return confirm('Bạn có chắc chắn muốn xóa?')">🗑️ Xóa</button>
                                </form>
                            </div>
                        </td>
                    </tr>
                @empty
                    <tr>
                        <td colspan="6" class="text-center text-muted">Chưa có dịch vụ nào</td>
                    </tr>
                @endforelse
            </tbody>
        </table>
    </div>
</div>

<style>
.page-container {
    background: #f4f6f9;
    padding: 25px 35px;
    border-radius: 8px;
}

.header-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
}

.page-title {
    font-size: 22px;
    font-weight: 600;
    color: #333;
    border-left: 5px solid #2196F3;
    padding-left: 10px;
}

.card {
    background: #fff;
    border-radius: 12px;
    padding: 25px 30px;
    box-shadow: 0 3px 8px rgba(0, 0, 0, 0.05);
}

.table {
    width: 100%;
    border-collapse: collapse;
}

.table th, .table td {
    padding: 12px;
    text-align: left;
}

.table-dark {
    background-color: #343a40;
    color: #000; /* Changed from #fff to #000 for black text */
}

.button-group {
    display: flex;
    gap: 10px;
}

.btn {
    padding: 10px 16px;
    border: none;
    border-radius: 6px;
    cursor: pointer;
    font-size: 15px;
    font-weight: 500;
    text-decoration: none;
    transition: all 0.2s ease;
}

.btn-primary {
    background-color: #2196F3;
    color: #fff;
}

.btn-primary:hover {
    background-color: #1976D2;
}

.btn-danger {
    background-color: #f44336;
    color: #fff;
}

.btn-danger:hover {
    background-color: #d32f2f;
}
</style>
@endsection