@extends('layouts.admin')

@section('content')
<h4 class="mb-3">Danh sách Booking</h4>

<table class="table table-bordered bg-white shadow-sm">
    <thead class="table-light">
        <tr>
            <th>ID</th>
            <th>Ngày</th>
            <th>Khách</th>
            <th>Trạng thái</th>
            <th></th>
        </tr>
    </thead>
    <tbody>
    @foreach ($bookings as $booking)
        <tr>
            <td>#{{ $booking->id }}</td>
            <td>{{ $booking->check_in }} → {{ $booking->check_out }}</td>
            <td>{{ $booking->adults + $booking->children }}</td>
            <td>
                <span class="badge bg-info">
                    {{ $booking->status }}
                </span>
            </td>
            <td>
                <a href="{{ route('admin.bookings.show', $booking->id) }}"
                   class="btn btn-sm btn-primary">
                    Xem
                </a>

                @if ($booking->status === 'paid')
                    <a href="{{ route('admin.bookings.checkin', $booking->id) }}"
                       class="btn btn-sm btn-success">
                        Check-in
                    </a>
                @endif
            </td>
        </tr>
    @endforeach
    </tbody>
</table>
@endsection
