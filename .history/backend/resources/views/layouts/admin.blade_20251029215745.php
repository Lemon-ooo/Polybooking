<!DOCTYPE html>
<html lang="vi">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Admin - Polybooking</title>
    <style>
        body {
        margin: 0;
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        background-color: #f4f6f8;
        color: #333;
    }

    /* HEADER */
    .header {
        background-color: #2196F3;
        color: white;
        padding: 15px 30px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        font-weight: bold;
        font-size: 20px;
        box-shadow: 0 2px 5px rgba(0,0,0,0.1);
    }

    /* SIDEBAR */
    .sidebar {
        width: 220px;
        background-color: #263238;
        color: #cfd8dc;
        height: 100vh;
        position: fixed;
        top: 0;
        left: 0;
        padding-top: 70px;
    }

    .sidebar h3 {
        color: #fff;
        font-size: 18px;
        margin-left: 20px;
        margin-bottom: 15px;
    }

    .sidebar a {
        display: block;
        color: #cfd8dc;
        padding: 10px 20px;
        text-decoration: none;
        transition: all 0.3s ease;
    }

    .sidebar a:hover {
        background-color: #37474f;
        color: #fff;
    }

    /* CONTENT */
    .content {
        margin-left: 240px;
        padding: 30px;
    }

    .content h2 {
        color: #333;
        font-size: 24px;
        margin-bottom: 20px;
    }

    .btn {
        display: inline-block;
        padding: 8px 15px;
        background-color: #2196F3;
        color: white;
        text-decoration: none;
        border-radius: 5px;
        font-size: 14px;
        transition: background-color 0.3s ease;
    }

    .btn:hover {
        background-color: #1976D2;
    }

    /* TABLE */
    table {
        width: 100%;
        border-collapse: collapse;
        background: white;
        border-radius: 10px;
        box-shadow: 0 2px 5px rgba(0,0,0,0.1);
        overflow: hidden;
    }

    th, td {
        padding: 12px 15px;
        text-align: left;
        border-bottom: 1px solid #eee;
    }

    th {
        background-color: #f5f5f5;
        font-weight: bold;
    }

    tr:hover {
        background-color: #f9f9f9;
    }

    .alert {
        background-color: #e3f2fd;
        border-left: 4px solid #2196F3;
        padding: 10px 15px;
        border-radius: 5px;
        margin-bottom: 15px;
        color: #0d47a1;
    }
    </style>
</head>
<body>
    <div class="header">
    <h2>Admin</h2>
    <!-- Tạm thời bỏ nút Đăng xuất -->
   {{-- <a href="{{ route('logout') }}" style="color: white;">Đăng xuất</a> --}}

</div>

    <div class="sidebar">
        <h3>Menu</h3>
        <a href="{{ route('room-types.index') }}">Quản lý loại phòng</a>
        <a href="{{ route('rooms.index') }}">Quản lý phòng</a> 
        <a href="{{ route('services.index') }}">Dịch vụ</a> 
<a href="{{ route('rooms.index') }}">Album ảnh phòng</a>

        <a href="{{ route('rooms.index') }}">Quản lý phòng</a>
        <a href="{{ route('amenities.index') }}">Quản lý tiện ích</a>
        <a href="{{ route('galleries.index') }}">🖼️ Quản lý Gallery</a>
        <a href="#">Quản lý booking</a>
        <a href="#">Báo cáo</a>
    </div>

    <div class="content">
        @yield('content')
    </div>
</body>
</html>