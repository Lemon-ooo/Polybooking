<!doctype html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>@yield('title', 'Admin') - Polybooking</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
</head>
<body>

<nav class="navbar navbar-expand-lg navbar-dark bg-dark mb-4">
    <div class="container-fluid">
        <a class="navbar-brand" href="{{ route('admin.dashboard') }}">Polybooking Admin</a>

        <div class="d-flex align-items-center">

            <a href="{{ route('admin.dashboard') }}" class="btn btn-outline-light btn-sm me-2">Dashboard</a>
            <a href="{{ route('admin.room-types.index') }}" class="btn btn-outline-light btn-sm me-2">Room Types</a>
            <a href="{{ route('admin.rooms.index') }}" class="btn btn-outline-light btn-sm me-2">Rooms</a>
            <a href="{{ route('admin.amenities.index') }}" class="btn btn-outline-light btn-sm me-2">Amenities</a>
            <a href="{{ route('admin.services.index') }}" class="btn btn-outline-light btn-sm me-2">Services</a>
            <a href="{{ route('admin.users.index') }}" class="btn btn-outline-light btn-sm me-3">Users</a>
            <a href="{{ route('admin.bookings.index') }}" class="btn btn-outline-light btn-sm me-3">Bookings</a>

            @auth
                <span class="navbar-text text-light me-3">
                    {{ auth()->user()->user_name }}
                    <span class="badge bg-{{ auth()->user()->role === 'admin' ? 'danger' : 'secondary' }}">
                        {{ auth()->user()->role }}
                    </span>
                </span>

                <form action="{{ route('logout') }}" method="POST" class="mb-0">
                    @csrf
                    <button class="btn btn-outline-danger btn-sm" type="submit">
                        Logout
                    </button>
                </form>
            @endauth
        </div>
    </div>
</nav>

<div class="container">
    @if(session('success'))
        <div class="alert alert-success mt-2">
            {{ session('success') }}
        </div>
    @endif

    @yield('content')
</div>

</body>
</html>
