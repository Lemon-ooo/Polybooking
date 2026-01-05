@extends('admin.layouts.admin')

@section('content')
<h4>Checkout Booking #{{ $booking->id }}</h4>

<div class="card shadow-sm">
    <div class="card-body">

        <p><b>Tổng tiền:</b>
            {{ number_format(
                $booking->room_price +
                $booking->service_total +
                $booking->damage_total
            ) }} đ
        </p>

        <p><b>Đã thanh toán:</b>
            {{ number_format($booking->paid_amount) }} đ
        </p>

        <form method="POST"
              action="{{ route('admin.bookings.checkout', $booking->id) }}"
              enctype="multipart/form-data">
            @csrf

            <label class="form-label">
                Ảnh tình trạng phòng
            </label>
            <input type="file"
                   name="photos[]"
                   multiple
                   required
                   class="form-control mb-3">

            <button class="btn btn-warning">
                CHECKOUT
            </button>
        </form>

    </div>
</div>
@endsection
