@extends('layouts.admin')

@section('title', 'Bookings')

@section('content')
    <h1 class="mb-4">Quản lý Booking</h1>

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

    {{-- Filter theo trạng thái --}}
    <form method="GET" class="row g-2 mb-3">
        <div class="col-auto">
            <label for="status" class="col-form-label">Trạng thái:</label>
        </div>
        <div class="col-auto">
            <select name="status" id="status" class="form-select form-select-sm">
                <option value="">Tất cả</option>
                <option value="unpaid"    {{ request('status') === 'unpaid' ? 'selected' : '' }}>unpaid</option>
                <option value="paid"      {{ request('status') === 'paid' ? 'selected' : '' }}>paid</option>
                <option value="confirmed" {{ request('status') === 'confirmed' ? 'selected' : '' }}>confirmed</option>
                <option value="cancelled" {{ request('status') === 'cancelled' ? 'selected' : '' }}>cancelled</option>
            </select>
        </div>
        <div class="col-auto">
            <button class="btn btn-sm btn-primary" type="submit">Lọc</button>
        </div>
    </form>

    <div class="table-responsive">
        <table class="table table-bordered align-middle">
            <thead class="table-light">
            <tr>
                <th>ID</th>
                <th>Khách hàng</th>
                <th>Ngày</th>
                <th>Khách</th>
                <th>Trạng thái</th>
                <th>Tiền phòng</th>
                <th>Tổng cuối</th>
                <th>Còn nợ</th>
                <th>Ngày tạo</th>
                <th>Hành động</th>
            </tr>
            </thead>
            <tbody>
            @forelse($bookings as $booking)
                <tr>
                    <td>#{{ $booking->booking_id }}</td>
                    <td>
                        {{ $booking->user->user_name ?? '-' }}<br>
                        <small class="text-muted">{{ $booking->user->email ?? '' }}</small>
                    </td>
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
                    <td>{{ $booking->created_at?->format('d/m/Y H:i') }}</td>
                    <td>
                        <a href="{{ route('admin.bookings.show', $booking->booking_id) }}"
                           class="btn btn-sm btn-primary mb-1">
                            Chi tiết
                        </a>

                        @if($booking->status === 'unpaid')
                            <form action="{{ route('admin.bookings.markPaid', $booking->booking_id) }}"
                                  method="POST" class="d-inline">
                                @csrf
                                <button type="submit" class="btn btn-sm btn-success"
                                        onclick="return confirm('Xác nhận đã thanh toán tiền phòng cho booking #{{ $booking->booking_id }}?')">
                                    Mark paid
                                </button>
                            </form>
                        @endif
                    </td>
                </tr>
            @empty
                <tr>
                    <td colspan="10" class="text-center">Chưa có booking nào.</td>
                </tr>
            @endforelse
            </tbody>
        </table>
    </div>

    {{ $bookings->withQueryString()->links() }}
@endsection
