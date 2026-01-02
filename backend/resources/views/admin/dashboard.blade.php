@extends('layouts.admin')

@section('content')
<div class="container">

    <h2 class="mb-4">📊 Dashboard quản trị</h2>

    {{-- DOANH THU --}}
    <div class="row">
        <div class="col-md-3">
            <div class="card p-3 bg-success text-white">
                <h4>Hôm nay</h4>
                <h3>{{ number_format($revenue_today) }} VNĐ</h3>
            </div>
        </div>

        <div class="col-md-3">
            <div class="card p-3 bg-info text-white">
                <h4>Tháng này</h4>
                <h3>{{ number_format($revenue_month) }} VNĐ</h3>
            </div>
        </div>

        <div class="col-md-3">
            <div class="card p-3 bg-primary text-white">
                <h4>Năm nay</h4>
                <h3>{{ number_format($revenue_year) }} VNĐ</h3>
            </div>
        </div>

        <div class="col-md-3">
            <div class="card p-3 bg-dark text-white">
                <h4>Tổng doanh thu</h4>
                <h3>{{ number_format($revenue_total) }} VNĐ</h3>
            </div>
        </div>
    </div>

    <hr>

    {{-- LOẠI PHÒNG POPULAR --}}
    <h3 class="mt-4">🏨 Loại phòng được đặt nhiều nhất</h3>

    <table class="table table-bordered">
        <tr>
            <th>Loại phòng</th>
            <th>Số lượt đặt</th>
        </tr>

        @foreach($top_room_types as $item)
            <tr>
                <td>{{ $item->roomType->name }}</td>
                <td>{{ $item->count }}</td>
            </tr>
        @endforeach
    </table>

    {{-- DỊCH VỤ POPULAR --}}
    <h3 class="mt-4">🧾 Dịch vụ sử dụng nhiều nhất</h3>

    <table class="table table-bordered">
        <tr>
            <th>Dịch vụ</th>
            <th>Tổng số lượng</th>
        </tr>

        @foreach($top_services as $s)
            <tr>
                <td>{{ $s->service->name ?? 'Chưa rõ' }}</td>
                <td>{{ $s->qty }}</td>
            </tr>
        @endforeach
    </table>

    {{-- THIỆT HẠI --}}
    <h3 class="mt-4">💥 Thống kê thiệt hại</h3>

    <div class="alert alert-danger">
        <strong>Tổng phí thiệt hại:</strong> {{ number_format($damage_total) }} VNĐ
    </div>

    <table class="table table-bordered">
        <tr>
            <th>Loại thiệt hại</th>
            <th>Số lần xảy ra</th>
        </tr>

        @foreach($damage_common as $d)
            <tr>
                <td>{{ $d->damageType->name }}</td>
                <td>{{ $d->total }}</td>
            </tr>
        @endforeach
    </table>

</div>
@endsection
