{{-- resources/views/admin/bookings/show.blade.php --}}
@extends('layouts.admin')

@section('content')
<div class="container">
    <h1>Chi tiết booking #{{ $booking->booking_id }}</h1>

    {{-- Thông báo --}}
    @if (session('ok'))
        <div class="alert alert-success">{{ session('ok') }}</div>
    @endif
    @if (session('error'))
        <div class="alert alert-danger">{{ session('error') }}</div>
    @endif
    @if ($errors->any())
        <div class="alert alert-danger">
            <ul class="mb-0">
                @foreach ($errors->all() as $e)
                    <li>{{ $e }}</li>
                @endforeach
            </ul>
        </div>
    @endif
    <div class="mb-3 d-flex gap-2">
    <a href="{{ route('admin.bookings.index') }}" class="btn btn-outline-secondary">
        ⬅ Danh sách
    </a>

    @if($booking->status === 'pending')
        <form action="{{ route('admin.bookings.set-status', $booking->booking_id) }}"
              method="POST" class="d-inline">
            @csrf
            @method('PATCH')
            <input type="hidden" name="status" value="confirmed">
            <button type="submit" class="btn btn-success">
                ✅ Confirm booking
            </button>
        </form>
    @endif

    @if(in_array($booking->status, ['pending','confirmed']))
        <form action="{{ route('admin.bookings.set-status', $booking->booking_id) }}"
              method="POST" class="d-inline"
              onsubmit="return confirm('Hủy booking này?');">
            @csrf
            @method('PATCH')
            <input type="hidden" name="status" value="cancelled">
            <button type="submit" class="btn btn-danger">
                ❌ Cancel booking
            </button>
        </form>
    @endif
</div>

    {{-- Thông tin chung --}}
    <div class="card mb-3">
        <div class="card-header">Thông tin chung</div>
        <div class="card-body row g-3">
            <div class="col-md-4">
                <label class="form-label fw-bold">Mã booking</label>
                <div>{{ $booking->booking_code }}</div>
            </div>
            <div class="col-md-4">
                <label class="form-label fw-bold">Người đặt</label>
                <div>-{{ $booking->user?->name ?? '—' }} (ID: {{ $booking->user_id }})</div>
            </div>
            <div class="col-md-4">
                @php
                    $status = $booking->status instanceof \BackedEnum ? $booking->status->value : $booking->status;
                    $badgeClass = match($status) {
                        'pending'     => 'bg-secondary',
                        'confirmed'   => 'bg-primary',
                        'checked_in'  => 'bg-info text-dark',
                        'checked_out' => 'bg-success',
                        'cancelled'   => 'bg-danger',
                        default       => 'bg-secondary',
                    };
                @endphp
                <label class="form-label fw-bold">Trạng thái</label>
                <div><span class="badge {{ $badgeClass }}">-{{ ucfirst($status) }}</span></div>
            </div>
            <div class="col-md-12">
                <label class="form-label fw-bold">Yêu cầu đặc biệt</label>
                <div>-{{ $booking->special_request ?? '—' }}</div>
            </div>
            <div class="col-md-4">
                <label class="form-label fw-bold">Tổng tiền</label>
                <div>-{{ number_format($booking->total_price, 0, ',', '.') }} VNĐ</div>
            </div>
            <div class="col-md-4">
                <label class="form-label fw-bold">Ngày tạo</label>
                <div>-{{ $booking->created_at?->format('d/m/Y H:i') ?? '—' }}</div>
            </div>
        </div>
    </div>

    {{-- Danh sách phòng (booking_rooms) --}}
    <div class="card mb-3">
        <div class="card-header">Danh sách phòng</div>
        <div class="card-body table-responsive">
            <table class="table table-bordered align-middle">
                <thead class="table-light">
                    <tr>
                        <th>ID</th>
                        <th>Loại phòng</th>
                        <th>Phòng gán</th>
                        <th>Khoảng ngày</th>
                        <th>Số khách</th>
                        <th>Giá/đêm</th>
                        <th>Gán phòng</th>
                    </tr>
                </thead>
                <tbody>
                    @forelse ($booking->items as $it)
                        <tr>
                            <td>{{ $it->booking_room_id }}</td>
                            <td>{{ $it->type?->name ?? ('Type#'.$it->room_type_id) }}</td>
                            <td>{{ $it->room?->room_number ?? '—' }}</td>
                            <td>
                                {{-- do BookingRoom đã cast date nên có thể format() --}}
                                {{ $it->check_in_date?->format('d/m') ?? $it->check_in_date }}
                                –
                                {{ $it->check_out_date?->format('d/m/Y') ?? $it->check_out_date }}
                            </td>
                            <td>{{ $it->num_guests }}</td>
                            <td>{{ number_format($it->price, 0, ',', '.') }} VNĐ</td>
                            <td>
                                <form method="POST"
                                      action="{{ route('admin.booking-rooms.assign-room', ['bookingRoom' => $it->booking_room_id]) }}"
                                      class="d-flex gap-2">

                                    @csrf
                                    @method('PATCH')

                                    @php
                                        // Lấy danh sách phòng thuộc đúng room_type
                                        $rooms = \App\Models\Room::where('room_type_id', $it->room_type_id)
                                            ->orderBy('room_number')
                                            ->get();
                                    @endphp

                                    <select name="room_id" class="form-select form-select-sm" style="max-width: 180px;">
                                        <option value="">-- Chọn phòng --</option>
                                        @foreach($rooms as $room)
                                            <option value="{{ $room->room_id }}"
                                                @selected($it->room_id == $room->room_id)>
                                                {{ $room->room_number }} ({{ ucfirst($room->status) }})
                                            </option>
                                        @endforeach
                                    </select>

                                    <button class="btn btn-sm btn-outline-primary" type="submit">
                                        Lưu
                                    </button>
                                </form>
                            </td>
                        </tr>
                    @empty
                        <tr>
                            <td colspan="7" class="text-center text-muted">Không có phòng nào trong booking này.</td>
                        </tr>
                    @endforelse
                </tbody>
            </table>
        </div>
    </div>

    {{-- Dịch vụ kèm (nếu có) --}}
    <div class="card mb-3">
        <div class="card-header">Dịch vụ kèm</div>
        <div class="card-body table-responsive">
            <table class="table table-bordered align-middle">
                <thead class="table-light">
                    <tr>
                        <th>Service ID</th>
                        <th>Tên dịch vụ</th>
                        <th>Số lượng</th>
                        <th>Đơn giá</th>
                        <th>Thành tiền</th>
                    </tr>
                </thead>
                <tbody>
                    @forelse ($booking->services as $sv)
                        <tr>
                            <td>{{ $sv->service_id }}</td>
                            <td>{{ $sv->service?->name ?? ('Service#'.$sv->service_id) }}</td>
                            <td>{{ $sv->quantity }}</td>
                            <td>{{ number_format($sv->price, 0, ',', '.') }} VNĐ</td>
                            <td>{{ number_format($sv->quantity * $sv->price, 0, ',', '.') }} VNĐ</td>
                        </tr>
                    @empty
                        <tr>
                            <td colspan="5" class="text-center text-muted">Không có dịch vụ kèm.</td>
                        </tr>
                    @endforelse
                </tbody>
            </table>
        </div>
    </div>
    <form action="{{ route('admin.bookings.destroy', $booking->booking_id) }}"
      method="POST"
      onsubmit="return confirm('Bạn chắc chắn muốn xóa booking này?');">
    @csrf
    @method('DELETE')
    <button class="btn btn-danger">Xóa Booking</button>
</form>
    <div class="d-flex justify-content-between">
        <a href="{{ route('admin.bookings.index') }}" class="btn btn-outline-secondary">⬅ Quay lại danh sách</a>
    </div>
</div>
@endsection
