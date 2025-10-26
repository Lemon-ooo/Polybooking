<!doctype html>
<html lang="vi">
<head>
  <meta charset="utf-8">
  <title>Polybooking – Client</title>
  <meta name="viewport" content="width=device-width, initial-scale=1">
</head>
<body style="font-family:system-ui;margin:0;background:#f6f7fb">
  <header style="background:#fff;border-bottom:1px solid #e5e7eb;padding:12px 24px;display:flex;justify-content:space-between">
    <strong>Polybooking – Client</strong>
    <nav>
      <a href="{{ route('client.rooms.index') }}">Danh sách phòng</a>
      <form method="POST" action="{{ route('logout') }}" style="display:inline">
        @csrf
        <button type="submit">Đăng xuất</button>
      </form>
    </nav>
  </header>
  <main style="max-width:1100px;margin:0 auto;padding:24px">
    @yield('content')
  </main>
</body>
</html>
