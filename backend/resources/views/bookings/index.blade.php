<!doctype html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>My Bookings - Polybooking</title>
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

                {{-- Nếu là admin thì có thêm nút vào admin --}}
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
    <div class="d-flex justify-content-between align-items-center mb-3">
        <h1 class="h3 mb-0">Danh sách booking của tôi</h1>
        <a href="{{ route('bookings.create') }}" class="btn btn-primary btn-sm">
            + Đặt phòng mới
        </a>
    </div>

    @if(session('success'))
        <div class="alert alert-success">{{ session('success') }}</div>
    @endif

    @if($errors->any())
        <div class="alert alert-danger">
            <ul class="mb-0">
                @foreach($errors->all() as $e)
                    <li>{{ $e }}</li>
                @endforeach
            </ul>
        </div>
    @endif

    @if($bookings->count())
        <div class="table-responsive">
            <table class="table table-bordered align-middle">
                <thead class="table-light">
                <tr>
                    <th>ID</th>
                    <th>Ngày</th>
                    <th>Số khách</th>
                    <th>Trạng thái</th>
                    <th>Tiền phòng</th>
                    <th>Tổng bill</th>
                    <th>Còn nợ</th>
                    <th>Hành động</th>
                </tr>
                </thead>
                <tbody>
                @foreach($bookings as $booking)
                    <tr>
                        <td>#{{ $booking->booking_id }}</td>
                        <td>
                            {{ $booking->check_in?->format('d/m/Y') }}
                            –
                            {{ $booking->check_out?->format('d/m/Y') }}<br>
                            <small class="text-muted">
                                @if($booking->number_of_nights)
                                    {{ $booking->number_of_nights }} đêm
                                @endif
                            </small>
                        </td>
                        <td>{{ $booking->guest_number }}</td>
                        <td>
                            @php
                                $status = $booking->status;
                                $badgeClass = [
                                    'unpaid'    => 'secondary',
                                    'paid'      => 'info',
                                    'confirmed' => 'success',
                                    'cancelled' => 'danger',
                                ][$status] ?? 'secondary';
                            @endphp
                            <span class="badge bg-{{ $badgeClass }}">{{ $status }}</span>
                        </td>
                        <td>{{ number_format($booking->room_total_amount, 0) }}</td>
                        <td>{{ number_format($booking->booking_total_amount, 0) }}</td>
                        <td>{{ number_format($booking->remaining_balance, 0) }}</td>
                        <td>
                            <a href="{{ route('bookings.show', $booking->booking_id) }}"
                               class="btn btn-sm btn-outline-primary mb-1">
                                Xem
                            </a>

                            @if($booking->status === 'unpaid')
                                <form action="{{ route('bookings.cancel', $booking->booking_id) }}"
                                      method="POST" class="d-inline"
                                      onsubmit="return confirm('Hủy booking này?');">
                                    @csrf
                                    <button type="submit" class="btn btn-sm btn-outline-danger">
                                        Hủy
                                    </button>
                                </form>
                            @endif
                        </td>
                    </tr>
                @endforeach
                </tbody>
            </table>
        </div>

        {{ $bookings->links() }}
    @else
        <p>Hiện tại bạn chưa có booking nào. Hãy <a href="{{ route('bookings.create') }}">đặt phòng ngay</a>.</p>
    @endif
</div>

</body>
</html>
