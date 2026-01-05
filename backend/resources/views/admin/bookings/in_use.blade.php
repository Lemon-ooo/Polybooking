@extends('layouts.admin')

@section('content')
<div class="container">
    <h2>Booking đang ở</h2>

    @if(session('success'))
        <div class="alert alert-success">
            {{ session('success') }}
        </div>
    @endif

    <table class="table table-bordered">
        <thead>
            <tr>
                <th>ID</th>
                <th>Khách</th>
                <th>Ngày nhận</th>
                <th>Hành động</th>
            </tr>
        </thead>
        <tbody>
        @forelse($bookings as $b)
            <tr>
                <td>{{ $b->id }}</td>
                <td>{{ $b->adults }} NL + {{ $b->children }} TE</td>
                <td>{{ $b->check_in }}</td>
                <td>
                    <a href="{{ route('admin.bookings.checkout', $b->id) }}"
                       class="btn btn-warning btn-sm">
                        Check-out
                    </a>
                </td>
            </tr>
        @empty
            <tr>
                <td colspan="4" class="text-center text-muted">
                    Không có booking đang ở
                </td>
            </tr>
        @endforelse
        </tbody>
    </table>
</div>
@endsection
