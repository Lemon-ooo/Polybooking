<!DOCTYPE html>
<html lang="vi">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Chi tiết Dịch vụ</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
</head>
<body class="bg-light">

<div class="container mt-5">
    <h2 class="mb-4">Chi tiết Dịch vụ</h2>

    <p><strong>Tên:</strong> {{ $service->name }}</p>
    <p><strong>Mô tả:</strong> {{ $service->description }}</p>
    <p><strong>Giá:</strong> {{ number_format($service->price, 0, ',', '.') }} VND</p>
    <p><strong>Hình ảnh:</strong>
        @if ($service->image)
            <img src="{{ $service->image }}" alt="Hình" width="200">
        @else
            <em>Không có ảnh</em>
        @endif
    </p>

    <a href="{{ route('admin.services.index') }}" class="btn btn-secondary">Quay lại</a>
</div>

</body>
</html>