@extends('layouts.admin')

@section('content')
<div class="container">
    <h1>Danh sách Booking</h1>

    {{-- Flash message --}}
    @if (session('ok'))
        <div class="alert alert-success">{{ session('ok') }}</div>
    @endif
    @if (session('error'))
        <div class="alert alert-danger">{{ session('error') }}</div>
    @endif

    <a href="{{ route('admin.bookings.create') }}" class="btn btn-primary mb-3">
        + Tạo Booking mới
    </a>

    <table class="table table-bordered table-striped align-middle">
        <thead class="table-light">
            <tr>
                <th>ID</th>
                <th>User</th>
                <th>Tổng tiền</th>
                <th>Trạng thái (raw)</th>
                <th>Ngày tạo</th>
                <th>Hành động</th>
            </tr>
        </thead>

        <tbody>
        @forelse($bookings as $booking)
            @php
                // Đọc thẳng status từ DB, không xử lý gì
                $statusRaw = $booking->status ?? $booking->booking_status ?? null;
            @endphp

            <tr>
                <td>{{ $booking->booking_id }}</td>
                <td>{{ $booking->user?->name ?? '—' }}</td>
                <td>{{ number_format($booking->total_price, 0, ',', '.') }} VNĐ</td>
                <td>
                    {{-- Hiển thị trực tiếp giá trị status trong DB để debug --}}
                    <span class="badge bg-light text-dark">
                        {{ $statusRaw ?? 'NULL' }}
                    </span>
                </td>
                <td>{{ $booking->created_at?->format('d/m/Y H:i') ?? '—' }}</td>

                <td>
                    {{-- 👁️ Chi tiết --}}
                    <a href="{{ route('admin.bookings.show', $booking->booking_id) }}"
                       class="btn btn-sm btn-outline-primary mb-1">
                        Chi tiết
                    </a>

                    {{-- ✅ Confirm: LUÔN HIỆN --}}
                    <form action="{{ route('admin.bookings.set-status', $booking->booking_id) }}"
                          method="POST"
                          class="d-inline">
                        @csrf
                        @method('PATCH')
                        <input type="hidden" name="status" value="confirmed">
                        <button type="submit" class="btn btn-sm btn-success mb-1">
                            Confirm
                        </button>
                    </form>

                    {{-- ❌ Cancel: LUÔN HIỆN --}}
                    <form action="{{ route('admin.bookings.set-status', $booking->booking_id) }}"
                          method="POST"
                          class="d-inline"
                          onsubmit="return confirm('Hủy booking này?');">
                        @csrf
                        @method('PATCH')
                        <input type="hidden" name="status" value="cancelled">
                        <button type="submit" class="btn btn-sm btn-danger mb-1">
                            Cancel
                        </button>
                    </form>

                    {{-- 🗑️ Xóa cứng --}}
                    <form action="{{ route('admin.bookings.destroy', $booking->booking_id) }}"
                          method="POST"
                          class="d-inline"
                          onsubmit="return confirm('Xóa hoàn toàn booking này?');">
                        @csrf
                        @method('DELETE')
                        <button class="btn btn-sm btn-outline-danger mb-1">
                            Xóa
                        </button>
                    </form>
                </td>
            </tr>
        @empty
            <tr>
                <td colspan="6" class="text-center text-muted py-3">
                    Không có booking nào.
                </td>
            </tr>
        @endforelse
        </tbody>
    </table>

    {{ $bookings->links() }}
</div>
@endsection
