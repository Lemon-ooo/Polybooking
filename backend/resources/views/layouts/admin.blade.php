<!-- resources/views/layouts/admin.blade.php -->
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Polybooking Admin - @yield('title')</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    {{-- nếu dùng Bootstrap --}}
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css">
</head>
<body>
<nav class="navbar navbar-expand-lg navbar-dark bg-dark mb-4">
    <div class="container-fluid">
        <a class="navbar-brand" href="{{ route('admin.room-types.index') }}">Polybooking Admin</a>
        <div>
            <a href="{{ route('admin.room-types.index') }}" class="btn btn-outline-light btn-sm">Room Types</a>
            <a href="{{ route('admin.rooms.index') }}" class="btn btn-outline-light btn-sm">Rooms</a>
            <a href="{{ route('admin.amenities.index') }}" class="btn btn-outline-light btn-sm">Amenities</a>
            <a href="{{ route('admin.services.index') }}" class="btn btn-outline-light btn-sm">Services</a>
            
        </div>
    </div>
</nav>

<div class="container">
    @if(session('success'))
        <div class="alert alert-success">
            {{ session('success') }}
        </div>
    @endif

    @yield('content')
</div>

</body>
</html>
