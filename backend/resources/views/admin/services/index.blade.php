<!DOCTYPE html>
<html lang="vi">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Quản lý Dịch vụ</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
</head>
<body class="bg-light">

<div class="container mt-5">
    <h2 class="mb-4">Danh sách Dịch vụ</h2>

    <!-- Nút thêm mới -->
    <a href="{{ route('admin.services.create') }}" class="btn btn-primary mb-3">Thêm dịch vụ mới</a>

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
                        <a href="{{ route('admin.services.edit', $service->id) }}" class="btn btn-warning btn-sm">Sửa</a>
                        <form action="{{ route('admin.services.destroy', $service->id) }}" method="POST" style="display:inline;">
                            @csrf
                            @method('DELETE')
                            <button type="submit" class="btn btn-danger btn-sm" onclick="return confirm('Bạn có chắc chắn muốn xóa?')">Xóa</button>
                        </form>
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

</body>
</html>