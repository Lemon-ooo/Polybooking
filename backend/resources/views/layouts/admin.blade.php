<!DOCTYPE html>
<html lang="vi">
<head>
    <meta charset="UTF-8">
    <title>PolyStay Admin</title>

    {{-- Bootstrap 5 --}}
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css"
          rel="stylesheet">

    <style>
        body {
            background-color: #f5f6fa;
        }
        .sidebar {
            width: 230px;
            min-height: 100vh;
            background: #1f2937;
            color: #fff;
        }
        .sidebar a {
            color: #cbd5e1;
            text-decoration: none;
            display: block;
            padding: 10px 15px;
        }
        .sidebar a:hover {
            background: #374151;
            color: #fff;
        }
        .sidebar .active {
            background: #2563eb;
            color: #fff;
        }
        .content {
            padding: 25px;
        }
    </style>
</head>
<body>

<div class="d-flex">

    {{-- SIDEBAR --}}
    <div class="sidebar">
        <h4 class="text-center py-3 border-bottom">PolyStay</h4>

        <a href="{{ route('admin.bookings.index') }}"
           class="{{ request()->is('admin/bookings*') ? 'active' : '' }}">
            📑 Quản lý Booking
        </a>

        <a href="#">
            🛏️ Quản lý Phòng
        </a>

        <a href="#">
            💳 Thanh toán
        </a>

        <a href="#">
            ⚙️ Cài đặt
        </a>
    </div>

    {{-- MAIN CONTENT --}}
    <div class="flex-grow-1">
        {{-- TOP BAR --}}
        <nav class="navbar navbar-light bg-white shadow-sm px-4">
            <span class="navbar-brand mb-0 h6">
                Admin Panel
            </span>

            <span>
                Xin chào, Admin
            </span>
        </nav>

        <div class="content">
            @yield('content')
        </div>
    </div>

</div>

</body>
</html>
