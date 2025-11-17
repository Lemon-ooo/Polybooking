@extends('layouts.admin')

@section('content')
<div class="container">
    <h1>Danh sách Booking</h1>

    <a href="{{ route('admin.bookings.create') }}" class="btn btn-primary mb-3">
        + Tạo Booking mới
    </a>

    <table class="table table-bordered table-striped align-middle">
        <thead class="table-light">
            <tr>
                
                <th>ID</th>
                <th>User</th>
                <th>Tổng tiền</th>
                <th>Trạng thái</th>
                <th>Ngày tạo</th>
                <th>Hành động</th>
            </tr>
        </thead>

        <tbody>
            @foreach($bookings as $booking)

                <tr>
                    <td>
                        @php
                            $st = $booking->status; // hoặc booking_status tùy DB bro

                            switch ($st) {
                                case 'pending':      $badge='bg-secondary'; $text='Đang chờ'; break;
                                case 'confirmed':    $badge='bg-primary';   $text='Đã xác nhận'; break;
                                case 'checked_in':   $badge='bg-success';   $text='Đã nhận phòng'; break;
                                case 'checked_out':  $badge='bg-dark';      $text='Đã trả phòng'; break;
                                case 'cancelled':    $badge='bg-danger';    $text='Đã hủy'; break;
                                default:             $badge='bg-light';     $text=$st;
                            }
                        @endphp

                        <span class="badge {{ $badge }}">{{ $text }}</span>
                    </td>

                    <td>{{ $booking->booking_id }}</td>
                    <td>{{ $booking->user?->name ?? '—' }}</td>
                    <td>{{ number_format($booking->total_price, 0, ',', '.') }} VNĐ</td>
                    <td><span class="badge {{ $badge }}">{{ $text }}</span></td>
                    <td>{{ $booking->created_at?->format('d/m/Y H:i') }}</td>
                    
                    <td>
    {{-- 👁️ Chi tiết --}}
    <a href="{{ route('admin.bookings.show', $booking->booking_id) }}"
       class="btn btn-sm btn-outline-primary mb-1">
        Chi tiết
    </a>

    {{-- ✏️ Sửa (nếu bro có trang edit) --}}
    <a href="{{ url('admin/bookings/'.$booking->booking_id.'/edit') }}"
       class="btn btn-sm btn-warning mb-1">
        Sửa
    </a>

    {{-- ✅ Confirm --}}
    @if($booking->status === 'pending')
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
    @endif

    {{-- ❌ Cancel (cho pending & confirmed) --}}
    @if(in_array($booking->status, ['pending','confirmed']))
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
    @endif

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
            @endforeach
        </tbody>
    </table>

    {{ $bookings->links() }}
</div>
@endsection
