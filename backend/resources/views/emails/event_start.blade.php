<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Sự kiện mới</title>
</head>
<body style="font-family: Arial, sans-serif">

    <h2>🎉 {{ $event->title }}</h2>

    {{-- Banner --}}
    @if($event->banner)
        <img
            src="{{ asset('storage/' . $event->banner) }}"
            alt="Event Banner"
            style="max-width:100%;margin-bottom:15px;border-radius:6px"
        >
    @endif

    <p><strong>Thời gian diễn ra:</strong></p>
    <p>
        {{ \Carbon\Carbon::parse($event->start_date)->format('d/m/Y') }}
        →
        {{ \Carbon\Carbon::parse($event->end_date)->format('d/m/Y') }}
    </p>

    @if($event->description)
        <p>{{ $event->description }}</p>
    @endif

    {{-- ================= VOUCHER ================= --}}
    @if(isset($vouchers) && $vouchers->count())
        <hr>

        <h3>🎁 Voucher dành riêng cho sự kiện</h3>

        <ul style="padding-left: 18px">
            @foreach($vouchers as $voucher)
                <li style="margin-bottom: 10px">
                    <strong>Mã:</strong> {{ $voucher->code }} <br>

                    <strong>Ưu đãi:</strong>
                    @if($voucher->discount_percent)
                        Giảm {{ $voucher->discount_percent }}%
                    @else
                        Giảm {{ number_format($voucher->discount_amount) }}đ
                    @endif
                    <br>

                    <strong>Đơn tối thiểu:</strong>
                    {{ number_format($voucher->min_price) }}đ <br>

                    <strong>Hạn sử dụng:</strong>
                    {{ \Carbon\Carbon::parse($voucher->expired_at)->format('d/m/Y') }}
                </li>
            @endforeach
        </ul>
    @endif

    <hr>

    <p>
        📍 <strong>Poly Homestay</strong> <br>
        Hẹn gặp bạn trong sự kiện!
    </p>

</body>
</html>
