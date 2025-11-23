<!doctype html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Đặt phòng - Polybooking</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
</head>
<body>

{{-- NAVBAR GIỐNG HOME --}}
<nav class="navbar navbar-expand-lg navbar-light bg-light mb-4">
    <div class="container-fluid">
        <a class="navbar-brand" href="{{ route('home') }}">Polybooking</a>

        <div class="d-flex">
            @auth
                <a href="{{ route('home') }}" class="btn btn-outline-secondary btn-sm me-2">
                    Home
                </a>

                <a href="{{ route('bookings.index') }}" class="btn btn-outline-primary btn-sm me-2">
                    My Bookings
                </a>

                @if(auth()->user()->role === 'admin')
                    <a href="{{ route('admin.dashboard') }}" class="btn btn-outline-dark btn-sm me-2">
                        Admin Dashboard
                    </a>
                @endif

                <a href="{{ route('profile.edit') }}" class="btn btn-outline-secondary btn-sm me-2">
                    Tài khoản
                </a>

                <form action="{{ route('logout') }}" method="POST" class="mb-0">
                    @csrf
                    <button class="btn btn-outline-danger btn-sm" type="submit">Logout</button>
                </form>
            @endauth

            @guest
                <a href="{{ route('login') }}" class="btn btn-outline-primary btn-sm me-2">Login</a>
                <a href="{{ route('register') }}" class="btn btn-primary btn-sm">Register</a>
            @endguest
        </div>
    </div>
</nav>

<div class="container">
    <h1 class="h3 mb-3">Đặt phòng mới</h1>

    @if($errors->any())
        <div class="alert alert-danger">
            <ul class="mb-0">
                @foreach($errors->all() as $e)
                    <li>{{ $e }}</li>
                @endforeach
            </ul>
        </div>
    @endif

    @if($message = $errors->first('booking_error'))
        <div class="alert alert-danger">{{ $message }}</div>
    @endif

    <form action="{{ route('bookings.store') }}" method="POST">
        @csrf

        <div class="row mb-3">
            <div class="col-md-4 mb-2">
                <label class="form-label">Check-in</label>
                <input type="date" name="check_in" class="form-control"
                       value="{{ old('check_in') }}" required>
            </div>
            <div class="col-md-4 mb-2">
                <label class="form-label">Check-out</label>
                <input type="date" name="check_out" class="form-control"
                       value="{{ old('check_out') }}" required>
            </div>
            <div class="col-md-4 mb-2">
                <label class="form-label">Số khách</label>
                <input type="number" name="guest_number" class="form-control"
                       min="1" value="{{ old('guest_number', 1) }}" required>
            </div>
        </div>

        <h5 class="mt-4 mb-2">Chọn loại phòng và số lượng</h5>
        <p class="text-muted">
            Hệ thống sẽ tự kiểm tra sức chứa và số phòng trống theo ngày.  
            Bạn chỉ cần nhập số lượng phòng cho từng loại (0 nếu không chọn).
        </p>

        <div class="table-responsive mb-3">
            <table class="table table-bordered align-middle">
                <thead class="table-light">
                <tr>
                    <th>Loại phòng</th>
                    <th>Mô tả</th>
                    <th>Max khách/phòng</th>
                    <th>Giá cơ bản / đêm</th>
                    <th>Số phòng muốn đặt</th>
                </tr>
                </thead>
                <tbody>
                @forelse($roomTypes as $rt)
                    <tr>
                        {{-- Hidden room_type_ids[] giữ thứ tự với quantities[] --}}
                        <input type="hidden" name="room_type_ids[]" value="{{ $rt->room_type_id }}">

                        <td>
                            <strong>{{ $rt->room_type_name }}</strong><br>
                            <small class="text-muted">ID: {{ $rt->room_type_id }}</small>
                        </td>
                        <td style="max-width: 260px;">
                            {{ \Illuminate\Support\Str::limit($rt->description, 120) }}
                        </td>
                        <td>{{ $rt->max_guests }}</td>
                        <td>{{ number_format($rt->base_price, 0) }}</td>
                        <td style="width: 160px;">
                            <input type="number"
                                   name="quantities[]"
                                   class="form-control"
                                   min="0"
                                   value="{{ old('quantities.' . $loop->index, 0) }}">
                            <small class="text-muted">
                                Để 0 nếu không muốn chọn loại phòng này.
                            </small>
                        </td>
                    </tr>
                @empty
                    <tr>
                        <td colspan="5" class="text-center text-muted">
                            Hiện chưa có loại phòng nào để đặt.
                        </td>
                    </tr>
                @endforelse
                </tbody>
            </table>
        </div>

        <button type="submit" class="btn btn-primary">
            Tạo booking (trạng thái unpaid)
        </button>
        <a href="{{ route('bookings.index') }}" class="btn btn-outline-secondary ms-2">
            Quay lại danh sách
        </a>
    </form>
</div>

</body>
</html>
