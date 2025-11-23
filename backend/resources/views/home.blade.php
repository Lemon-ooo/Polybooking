<!doctype html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Polybooking - Home</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
</head>
<body>

<nav class="navbar navbar-expand-lg navbar-light bg-light mb-4">
    <div class="container-fluid">
        <a class="navbar-brand" href="{{ route('home') }}">Polybooking</a>

        <div class="d-flex">
            @auth
                <span class="navbar-text me-3">
                    Xin chào, {{ auth()->user()->user_name }}
                    <span class="badge bg-{{ auth()->user()->role === 'admin' ? 'danger' : 'secondary' }}">
                        {{ auth()->user()->role }}
                    </span>
                </span>

                {{-- Nếu là admin, cho nút vào admin dashboard --}}
                @if(auth()->user()->role === 'admin')
                    <a href="{{ route('admin.dashboard') }}" class="btn btn-outline-primary me-2">
                        Admin Dashboard
                    </a>
                @endif

                {{-- Chỉnh sửa tài khoản --}}
                <a href="{{ route('profile.edit') }}" class="btn btn-outline-secondary me-2">
                    Tài khoản của tôi
                </a>
                

                {{-- Logout --}}
                <form action="{{ route('logout') }}" method="POST">
                    @csrf
                    <button class="btn btn-outline-danger" type="submit">Logout</button>
                </form>
            @endauth

            @guest
                <a href="{{ route('login') }}" class="btn btn-outline-primary me-2">Login</a>
                <a href="{{ route('register') }}" class="btn btn-primary">Register</a>
            @endguest
        </div>
    </div>
</nav>

<div class="container">
    <h1 class="mb-4">Danh sách loại phòng</h1>
    <p class="text-muted">
        Đây là trang dành cho khách (customer). Admin sau khi đăng nhập sẽ vào Admin Dashboard để quản lý hệ thống.
    </p>

    <div class="row">
        @forelse($roomTypes as $type)
            <div class="col-md-4 mb-4">
                <div class="card h-100">
                    @php
                        $mainImage = $type->images->firstWhere('image_type', 'main')
                                     ?? $type->images->first();
                    @endphp

                    @if($mainImage)
                        <img src="{{ asset('storage/'.$mainImage->image_url) }}"
                             class="card-img-top"
                             alt="{{ $type->room_type_name }}">
                    @endif

                    <div class="card-body d-flex flex-column">
                        <h5 class="card-title">{{ $type->room_type_name }}</h5>
                        <p class="card-text">
                            Giá từ: <strong>{{ number_format($type->base_price, 0) }}</strong><br>
                            Tối đa khách: {{ $type->max_guests }}<br>
                            Số phòng hiện có: {{ $type->total_rooms ?? $type->rooms_count }}
                        </p>
                        <p class="card-text text-muted">
                            {{ \Illuminate\Support\Str::limit($type->description, 100) }}
                        </p>
                        <div class="mt-auto">
                            {{-- Sau này có thể thêm nút "Xem chi tiết", "Đặt phòng"... --}}
                            @auth
                                @if(auth()->user()->role === 'customer')
                                    <a href="#"
                                       class="btn btn-primary btn-sm disabled">
                                        Tạo booking 
                                    </a>
                                @endif
                            @endauth
                        </div>
                    </div>
                </div>
            </div>
        @empty
            <p>Hiện chưa có loại phòng nào.</p>
        @endforelse
    </div>
</div>

</body>
</html>
