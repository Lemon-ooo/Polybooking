<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Lên hạng thành viên</title>
</head>
<body style="font-family: Arial, sans-serif">

<h2>🎉 Chúc mừng {{ $user->name }}!</h2>

<p>
    Bạn vừa đạt <strong>{{ number_format($points) }}</strong> điểm
    và được nâng lên hạng:
</p>

<h3>🏆 {{ strtoupper($tier->name) }}</h3>

@if($voucher)
    <hr>
    <h3>🎁 Voucher dành tặng bạn</h3>

    <p>
        <strong>Mã:</strong> {{ $voucher->code }} <br>
        <strong>Ưu đãi:</strong>
        @if($voucher->discount_percent)
            Giảm {{ $voucher->discount_percent }}%
        @else
            Giảm {{ number_format($voucher->discount_amount) }}đ
        @endif
        <br>
        <strong>Hạn sử dụng:</strong>
        {{ \Carbon\Carbon::parse($voucher->expired_at)->format('d/m/Y') }}
    </p>
@endif

<hr>

<p>
    📍 <strong>Poly Homestay</strong><br>
    Cảm ơn bạn đã đồng hành cùng chúng tôi!
</p>

</body>
</html>