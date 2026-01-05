@extends('layouts.admin')

@section('content')

<h2>Check-in Booking #{{ $booking->id }}</h2>

<hr>

{{-- Thông tin booking --}}
<div style="margin-bottom:20px">
    <p><strong>Khách hàng:</strong> {{ $booking->user->name ?? 'N/A' }}</p>
    <p><strong>Ngày check-in:</strong> {{ $booking->check_in }}</p>
    <p><strong>Ngày check-out:</strong> {{ $booking->check_out }}</p>
    <p><strong>Số người:</strong> {{ $booking->adults }} người lớn, {{ $booking->children }} trẻ em</p>
</div>

{{-- FORM CHECK-IN --}}
<form method="POST"
      action="{{ route('admin.bookings.checkin.confirm', $booking->id) }}">
    @csrf

    <table border="1" cellpadding="8" cellspacing="0" width="100%">
        <thead>
            <tr>
                <th>#</th>
                <th>Loại khách</th>
                <th>Tên khách</th>
                <th>Tuổi</th>
                <th>Đã xác minh</th>
            </tr>
        </thead>

        <tbody>
        @foreach ($guests as $index => $guest)
            <tr>
                <td>{{ $index + 1 }}</td>

                 <td>
            @if ($index < $adults)
                Người lớn
            @else
                Trẻ em
            @endif
                </td>

                <td>
                    <input type="text"
                           name="guests[{{ $guest->id }}][name]"
                           value="{{ $guest->name }}"
                           placeholder="Nhập tên khách"
                           required>
                </td>

                <td>
                    <input type="number"
                           name="guests[{{ $guest->id }}][age]"
                           value="{{ $guest->age }}"
                           min="0"
                           required>
                </td>

                <td style="text-align:center">
                    <input type="checkbox"
                           name="guests[{{ $guest->id }}][verified]"
                           value="1"
                           {{ $guest->verified ? 'checked' : '' }}>
                </td>
            </tr>
        @endforeach
        </tbody>
    </table>

    <br>

    {{-- ACTION --}}
    <button type="submit"
            onclick="return confirm('Xác nhận check-in cho booking này?')"
            class="btn btn-success">
        ✅ Xác nhận Check-in
    </button>

    <a href="{{ route('admin.bookings.index') }}"
       class="btn btn-secondary">
        ⬅ Quay lại
    </a>

</form>

@endsection
