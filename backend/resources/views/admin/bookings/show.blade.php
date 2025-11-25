@extends('layouts.admin')

@section('title', 'Booking #'.$booking->booking_id)

@section('content')
    <h1 class="mb-4">Booking #{{ $booking->booking_id }}</h1>

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

    @if($message = $errors->first('booking_error'))
        <div class="alert alert-danger">{{ $message }}</div>
    @endif
    @if($message = $errors->first('service_error'))
        <div class="alert alert-danger">{{ $message }}</div>
    @endif
    @if($message = $errors->first('penalty_error'))
        <div class="alert alert-danger">{{ $message }}</div>
    @endif

    {{-- Thông tin tổng quan --}}
    <div class="row mb-4">
        <div class="col-md-6 mb-3">
            <div class="card">
                <div class="card-header">
                    Thông tin booking
                </div>
                <div class="card-body">
                    <p><strong>ID:</strong> #{{ $booking->booking_id }}</p>
                    <p>
                        <strong>Khách hàng:</strong>
                        {{ $booking->user->user_name ?? '-' }}<br>
                        <small class="text-muted">{{ $booking->user->email ?? '' }}</small>
                    </p>
                    <p>
                        <strong>Ngày:</strong><br>
                        Check-in: {{ $booking->check_in?->format('d/m/Y') }}<br>
                        Check-out: {{ $booking->check_out?->format('d/m/Y') }}<br>
                        Số đêm: {{ $booking->number_of_nights ?? '-' }}
                    </p>
                    <p>
                        <strong>Số khách:</strong> {{ $booking->guest_number }}
                    </p>
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
                        <form action="{{ route('admin.bookings.markPaid', $booking->booking_id) }}"
                              method="POST">
                            @csrf
                            <button type="submit" class="btn btn-success"
                                    onclick="return confirm('Xác nhận đã thanh toán tiền phòng cho booking này?')">
                                Mark as paid
                            </button>
                        </form>
                    @endif
                </div>
            </div>
        </div>

        <div class="col-md-6 mb-3">
            <div class="card">
                <div class="card-header">
                    Tổng tiền
                </div>
                <div class="card-body">
                    <p>
                        <strong>Tiền phòng:</strong>
                        {{ number_format($booking->room_total_amount, 0) }}
                    </p>
                    <p>
                        <strong>Dịch vụ:</strong>
                        {{ number_format($booking->service_total_amount, 0) }}
                    </p>
                    <p>
                        <strong>Phí phạt:</strong>
                        {{ number_format($booking->penalty_total_amount, 0) }}
                    </p>
                    <hr>
                    <p>
                        <strong>Tổng bill:</strong>
                        {{ number_format($booking->booking_total_amount, 0) }}
                    </p>
                    <p>
                        <strong>Khách còn phải trả (dịch vụ + phạt):</strong>
                        {{ number_format($booking->remaining_balance, 0) }}
                    </p>
                </div>
            </div>
        </div>
    </div>

    {{-- 1. Các loại phòng & gán phòng --}}
    <div class="card mb-4">
        <div class="card-header">
            Loại phòng trong booking &amp; gán phòng cụ thể
        </div>
        <div class="card-body">

            @if($booking->status === 'paid' || $booking->status === 'confirmed')
                <form action="{{ route('admin.bookings.assignRooms', $booking->booking_id) }}"
                      method="POST">
                    @csrf

                    <div class="table-responsive">
                        <table class="table table-bordered align-middle">
                            <thead class="table-light">
                            <tr>
                                <th>Booking Item ID</th>
                                <th>Loại phòng</th>
                                <th>SL phòng</th>
                                <th>Giá cơ bản</th>
                                <th>Số đêm</th>
                                <th>Thành tiền</th>
                                <th>Chọn phòng để gán</th>
                            </tr>
                            </thead>
                            <tbody>
                            @foreach($booking->items as $item)
                                @php
                                    $rt      = $item->roomType;
                                    $rtRooms = $rt ? $rt->rooms : collect();
                                @endphp
                                <tr>
                                    <td>{{ $item->booking_item_id }}</td>
                                    <td>
                                        {{ $rt->room_type_name ?? 'N/A' }}<br>
                                        <small class="text-muted">
                                            Max guests: {{ $rt->max_guests ?? '-' }}
                                        </small>
                                    </td>
                                    <td>{{ $item->quantity }}</td>
                                    <td>{{ number_format($item->base_price, 0) }}</td>
                                    <td>{{ $item->number_of_nights }}</td>
                                    <td>{{ number_format($item->amount, 0) }}</td>
                                    <td style="min-width: 260px;">
                                        <small class="text-muted d-block mb-1">
                                            Chọn đúng {{ $item->quantity }} phòng thuộc loại này
                                        </small>

                                        @for($i = 0; $i < $item->quantity; $i++)
                                            <select name="assigned_rooms[{{ $item->booking_item_id }}][]"
                                                    class="form-select form-select-sm mb-1">
                                                <option value="">-- Chọn phòng --</option>
                                                @foreach($rtRooms as $room)
                                                    <option value="{{ $room->room_id }}">
                                                        #{{ $room->room_number }}
                                                        ({{ $room->room_status }})
                                                    </option>
                                                @endforeach
                                            </select>
                                        @endfor
                                    </td>
                                </tr>
                            @endforeach
                            </tbody>
                        </table>
                    </div>

                    <button type="submit" class="btn btn-primary">
                        Gán phòng &amp; xác nhận booking
                    </button>
                </form>
            @else
                <p class="text-muted mb-0">
                    Chỉ có thể gán phòng khi booking đang ở trạng thái <strong>paid</strong> hoặc <strong>confirmed</strong>.
                </p>
            @endif

        </div>
    </div>

    {{-- Danh sách phòng đã gán --}}
    <div class="card mb-4">
        <div class="card-header">
            Phòng đã gán
        </div>
        <div class="card-body">
            @if($booking->assignedRooms->count())
                <div class="table-responsive">
                    <table class="table table-bordered align-middle">
                        <thead class="table-light">
                        <tr>
                            <th>ID</th>
                            <th>Phòng</th>
                            <th>Loại phòng</th>
                            <th>Ngày</th>
                        </tr>
                        </thead>
                        <tbody>
                        @foreach($booking->assignedRooms as $ar)
                            <tr>
                                <td>{{ $ar->assigned_room_id }}</td>
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
                <p class="text-muted mb-0">Chưa gán phòng nào.</p>
            @endif
        </div>
    </div>

    <div class="row">
        {{-- 2. Dịch vụ phát sinh --}}
        <div class="col-md-6 mb-4">
            <div class="card h-100">
                <div class="card-header">
                    Dịch vụ phát sinh
                </div>
                <div class="card-body">
                    {{-- Form thêm dịch vụ --}}
                    <form action="{{ route('admin.bookings.serviceCharges.add', $booking->booking_id) }}"
                          method="POST" class="mb-3">
                        @csrf

                        <div class="mb-2">
                            <label class="form-label">Dịch vụ</label>
                            <select name="service_id" class="form-select form-select-sm" required>
                                <option value="">-- Chọn dịch vụ --</option>
                                @foreach($services as $service)
                                    <option value="{{ $service->service_id }}">
                                        {{ $service->service_name ?? ('Service '.$service->service_id) }}
                                        @if(isset($service->service_price))
                                            ({{ number_format($service->service_price, 0) }})
                                        @endif
                                    </option>
                                @endforeach
                            </select>
                        </div>

                        <div class="mb-2">
                            <label class="form-label">Số lượng</label>
                            <input type="number" name="quantity" value="1" min="1"
                                   class="form-control form-control-sm" required>
                        </div>

                        <div class="mb-2">
                            <label class="form-label">
                                Đơn giá (optional - bỏ trống để dùng giá mặc định)
                            </label>
                            <input type="number" step="0.01" min="0"
                                   name="price" class="form-control form-control-sm">
                        </div>

                        <button type="submit" class="btn btn-sm btn-primary">
                            Thêm dịch vụ
                        </button>
                    </form>

                    {{-- Danh sách service charges --}}
                    @if($booking->serviceCharges->count())
                        <div class="table-responsive">
                            <table class="table table-bordered table-sm align-middle">
                                <thead class="table-light">
                                <tr>
                                    <th>ID</th>
                                    <th>Dịch vụ</th>
                                    <th>SL</th>
                                    <th>Đơn giá</th>
                                    <th>Thành tiền</th>
                                    <th></th>
                                </tr>
                                </thead>
                                <tbody>
                                @foreach($booking->serviceCharges as $sc)
                                    <tr>
                                        <td>{{ $sc->service_charge_id }}</td>
                                        <td>{{ $sc->service->sevice_name ?? ('Service '.$sc->service_id) }}</td>
                                        <td>{{ $sc->quantity }}</td>
                                        <td>{{ number_format($sc->price, 0) }}</td>
                                        <td>{{ number_format($sc->amount, 0) }}</td>
                                        <td>
                                            <form action="{{ route('admin.bookings.serviceCharges.delete', [$booking->booking_id, $sc->service_charge_id]) }}"
                                                  method="POST"
                                                  onsubmit="return confirm('Xóa dịch vụ này?');">
                                                @csrf
                                                @method('DELETE')
                                                <button class="btn btn-sm btn-outline-danger">
                                                    Xóa
                                                </button>
                                            </form>
                                        </td>
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

        {{-- 3. Phí phạt --}}
        <div class="col-md-6 mb-4">
            <div class="card h-100">
                <div class="card-header">
                    Phí phạt
                </div>
                <div class="card-body">
                    {{-- Form thêm penalty --}}
                    <form action="{{ route('admin.bookings.penalties.add', $booking->booking_id) }}"
                          method="POST" class="mb-3">
                        @csrf

                        <div class="mb-2">
                            <label class="form-label">Mô tả</label>
                            <textarea name="description" rows="2" class="form-control form-control-sm"
                                      placeholder="VD: Làm hỏng đồ, bẩn phòng, check-out trễ..."></textarea>
                        </div>

                        <div class="mb-2">
                            <label class="form-label">Số tiền phạt</label>
                            <input type="number" step="0.01" min="0.01"
                                   name="amount" class="form-control form-control-sm" required>
                        </div>

                        <button type="submit" class="btn btn-sm btn-warning">
                            Thêm phí phạt
                        </button>
                    </form>

                    {{-- Danh sách penalty --}}
                    @if($booking->penaltyCharges->count())
                        <div class="table-responsive">
                            <table class="table table-bordered table-sm align-middle">
                                <thead class="table-light">
                                <tr>
                                    <th>ID</th>
                                    <th>Mô tả</th>
                                    <th>Số tiền</th>
                                    <th></th>
                                </tr>
                                </thead>
                                <tbody>
                                @foreach($booking->penaltyCharges as $pen)
                                    <tr>
                                        <td>{{ $pen->penalty_id }}</td>
                                        <td>{{ $pen->description }}</td>
                                        <td>{{ number_format($pen->amount, 0) }}</td>
                                        <td>
                                            <form action="{{ route('admin.bookings.penalties.delete', [$booking->booking_id, $pen->penalty_id]) }}"
                                                  method="POST"
                                                  onsubmit="return confirm('Xóa phí phạt này?');">
                                                @csrf
                                                @method('DELETE')
                                                <button class="btn btn-sm btn-outline-danger">
                                                    Xóa
                                                </button>
                                            </form>
                                        </td>
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

@endsection
