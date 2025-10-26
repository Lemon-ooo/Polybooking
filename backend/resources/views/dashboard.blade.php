<!doctype html>
<html>
<head><meta charset="utf-8"><title>Dashboard</title></head>
<body>
    <h1>Xin chào, {{ auth()->user()->name }}</h1>

    <form method="POST" action="{{ route('logout') }}">
        @csrf
        <button type="submit">Logout</button>
    </form>
</body>
</html>
