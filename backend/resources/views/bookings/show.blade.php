<!doctype html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Booking #{{ $booking->booking_id }} - Polybooking</title>
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
    <div class="d-flex justify-content-between align-items-center mb-3">
        <h1 class="h4 mb-0">
            Booking #{{ $booking->booking_id }}
        </h1>
        <a href="{{ route('bookings.index') }}" class="btn btn-outline-secondary btn-sm">
            &larr; Quay lại danh sách
        </a>
    </div>

    @if(session('success'))
        <div class="alert alert-success">{{ session('success') }}</div>
    @endif

    @if($message = $errors->first('booking_error'))
        <div class="alert alert-danger">{{ $message }}</div>
    @endif

    {{-- Tổng quan --}}
    <div class="row mb-4">
        <div class="col-md-6 mb-3">
            <div class="card">
                <div class="card-header">
                    Thông tin booking
                </div>
                <div class="card-body">
                    <p><strong>ID:</strong> #{{ $booking->booking_id }}</p>
                    <p>
                        <strong>Ngày:</strong><br>
                        Check-in: {{ $booking->check_in?->format('d/m/Y') }}<br>
                        Check-out: {{ $booking->check_out?->format('d/m/Y') }}<br>
                        Số đêm: {{ $booking->number_of_nights ?? '-' }}
                    </p>
                    <p><strong>Số khách:</strong> {{ $booking->guest_number }}</p>
                    <p>
                        @php
                            $status = $booking->status;
                            $badgeClass = [
                                'unpaid'    => 'secondary',
                                'paid'      => 'info',
                                'confirmed' => 'success',
                                'cancelled' => 'danger',
                            ][$status] ?? 'secondary';
                        @endphp
                        <strong>Trạng thái:</strong>
                        <span class="badge bg-{{ $badgeClass }}">{{ $status }}</span>
                    </p>

                    @if($booking->status === 'unpaid')
                        <form action="{{ route('bookings.cancel', $booking->booking_id) }}"
                              method="POST"
                              onsubmit="return confirm('Hủy booking này?');">
                            @csrf
                            <button class="btn btn-outline-danger btn-sm" type="submit">
                                Hủy booking
                            </button>
                        </form>
                    @endif
                </div>
            </div>
        </div>

        {{-- Tổng tiền --}}
        <div class="col-md-6 mb-3">
            <div class="card">
                <div class="card-header">
                    Tổng tiền
                </div>
                <div class="card-body">
                    <p>
                        <strong>Tiền phòng (đã thanh toán trước):</strong><br>
                        {{ number_format($booking->room_total_amount, 0) }}
                    </p>
                    <p>
                        <strong>Dịch vụ phát sinh:</strong><br>
                        {{ number_format($booking->service_total_amount, 0) }}
                    </p>
                    <p>
                        <strong>Phí phạt:</strong><br>
                        {{ number_format($booking->penalty_total_amount, 0) }}
                    </p>
                    <hr>
                    <p>
                        <strong>Tổng bill:</strong><br>
                        {{ number_format($booking->booking_total_amount, 0) }}
                    </p>
                    <p>
                        <strong>Phần còn phải trả khi check-out (dịch vụ + phạt):</strong><br>
                        {{ number_format($booking->remaining_balance, 0) }}
                    </p>
                </div>
            </div>
        </div>
    </div>

    {{-- Loại phòng đã đặt --}}
    <div class="card mb-4">
        <div class="card-header">
            Loại phòng trong booking
        </div>
        <div class="card-body">
            @if($booking->items->count())
                <div class="table-responsive">
                    <table class="table table-bordered align-middle">
                        <thead class="table-light">
                        <tr>
                            <th>Loại phòng</th>
                            <th>SL phòng</th>
                            <th>Max khách/phòng</th>
                            <th>Giá cơ bản / đêm</th>
                            <th>Số đêm</th>
                            <th>Thành tiền</th>
                        </tr>
                        </thead>
                        <tbody>
                        @foreach($booking->items as $item)
                            @php
                                $rt = $item->roomType;
                            @endphp
                            <tr>
                                <td>{{ $rt->room_type_name ?? ('RoomType '.$item->room_type_id) }}</td>
                                <td>{{ $item->quantity }}</td>
                                <td>{{ $rt->max_guests ?? '-' }}</td>
                                <td>{{ number_format($item->base_price, 0) }}</td>
                                <td>{{ $item->number_of_nights }}</td>
                                <td>{{ number_format($item->amount, 0) }}</td>
                            </tr>
                        @endforeach
                        </tbody>
                    </table>
                </div>
            @else
                <p class="text-muted mb-0">Không có loại phòng nào trong booking.</p>
            @endif
        </div>
    </div>

    {{-- Phòng cụ thể (nếu admin đã gán) --}}
    <div class="card mb-4">
        <div class="card-header">
            Phòng được gán
        </div>
        <div class="card-body">
            @if($booking->assignedRooms->count())
                <div class="table-responsive">
                    <table class="table table-bordered align-middle">
                        <thead class="table-light">
                        <tr>
                            <th>Phòng</th>
                            <th>Loại phòng</th>
                            <th>Thời gian lưu trú</th>
                        </tr>
                        </thead>
                        <tbody>
                        @foreach($booking->assignedRooms as $ar)
                            <tr>
                                <td>
                                    #{{ $ar->room->room_number ?? $ar->room_id }}<br>
                                    <small class="text-muted">
                                        Trạng thái: {{ $ar->room->room_status ?? '-' }}
                                    </small>
                                </td>
                                <td>{{ $ar->roomType->room_type_name ?? $ar->room_type_id }}</td>
                                <td>
                                    {{ $ar->check_in?->format('d/m/Y') }}
                                    –
                                    {{ $ar->check_out?->format('d/m/Y') }}
                                </td>
                            </tr>
                        @endforeach
                        </tbody>
                    </table>
                </div>
            @else
                <p class="text-muted mb-0">
                    Phòng cụ thể sẽ được gán sau khi thanh toán được xác nhận.
                </p>
            @endif
        </div>
    </div>

    <div class="row">
        {{-- Dịch vụ phát sinh --}}
        <div class="col-md-6 mb-4">
            <div class="card h-100">
                <div class="card-header">
                    Dịch vụ phát sinh
                </div>
                <div class="card-body">
                    @if($booking->serviceCharges->count())
                        <div class="table-responsive">
                            <table class="table table-bordered table-sm align-middle">
                                <thead class="table-light">
                                <tr>
                                    <th>Dịch vụ</th>
                                    <th>SL</th>
                                    <th>Đơn giá</th>
                                    <th>Thành tiền</th>
                                </tr>
                                </thead>
                                <tbody>
                                @foreach($booking->serviceCharges as $sc)
                                    <tr>
                                        <td>{{ $sc->service->service_name ?? ('Service '.$sc->service_id) }}</td>
                                        <td>{{ $sc->quantity }}</td>
                                        <td>{{ number_format($sc->price, 0) }}</td>
                                        <td>{{ number_format($sc->amount, 0) }}</td>
                                    </tr>
                                @endforeach
                                </tbody>
                            </table>
                        </div>
                    @else
                        <p class="text-muted mb-0">Chưa có dịch vụ phát sinh.</p>
                    @endif
                </div>
            </div>
        </div>

        {{-- Phí phạt --}}
        <div class="col-md-6 mb-4">
            <div class="card h-100">
                <div class="card-header">
                    Phí phạt
                </div>
                <div class="card-body">
                    @if($booking->penaltyCharges->count())
                        <div class="table-responsive">
                            <table class="table table-bordered table-sm align-middle">
                                <thead class="table-light">
                                <tr>
                                    <th>Mô tả</th>
                                    <th>Số tiền</th>
                                </tr>
                                </thead>
                                <tbody>
                                @foreach($booking->penaltyCharges as $pen)
                                    <tr>
                                        <td>{{ $pen->description }}</td>
                                        <td>{{ number_format($pen->amount, 0) }}</td>
                                    </tr>
                                @endforeach
                                </tbody>
                            </table>
                        </div>
                    @else
                        <p class="text-muted mb-0">Chưa có phí phạt.</p>
                    @endif
                </div>
            </div>
        </div>
    </div>

</div>

</body>
</html>
