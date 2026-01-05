<!DOCTYPE html>
<html lang="vi">
<head>
    <meta charset="UTF-8">
    <title>Thanh toán thành công</title>

    <style>
        body {
            font-family: Arial, Helvetica, sans-serif;
            background: #f4f6f8;
        }

        .container {
            max-width: 520px;
            margin: 80px auto;
            background: #ffffff;
            border-radius: 12px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.08);
            padding: 30px;
            text-align: center;
        }

        .success-icon {
            font-size: 64px;
            color: #28a745;
            margin-bottom: 16px;
        }

        h2 {
            color: #2d3436;
            margin-bottom: 10px;
        }

        .desc {
            color: #636e72;
            font-size: 15px;
            margin-bottom: 25px;
        }

        .info-box {
            text-align: left;
            background: #f8f9fa;
            border-radius: 8px;
            padding: 15px 18px;
            margin-bottom: 25px;
        }

        .info-box p {
            margin: 6px 0;
            font-size: 14px;
        }

        .info-box span {
            font-weight: bold;
            color: #2d3436;
        }

        .btn-group {
            display: flex;
            gap: 12px;
            justify-content: center;
        }

        .btn {
            padding: 10px 18px;
            border-radius: 8px;
            text-decoration: none;
            font-size: 14px;
            font-weight: bold;
            transition: 0.2s;
        }

        .btn-primary {
            background: #0d6efd;
            color: #ffffff;
        }

        .btn-primary:hover {
            background: #0b5ed7;
        }

        .btn-outline {
            border: 2px solid #0d6efd;
            color: #0d6efd;
        }

        .btn-outline:hover {
            background: #0d6efd;
            color: #ffffff;
        }
    </style>
</head>
<body>

<div class="container">
    <div class="success-icon">✔</div>

    <h2>Thanh toán thành công</h2>

    <p class="desc">
        Giao dịch của bro đã được xử lý thành công.<br>
        Cảm ơn bro đã sử dụng dịch vụ của chúng tui.
    </p>

    <div class="info-box">
        <p>Mã booking: <span>#{{ $booking->id }}</span></p>
        <p>Tổng tiền đã thanh toán: 
            <span>{{ number_format($booking->prepaid_amount ?? $booking->total_price) }} VND</span>
        </p>
        <p>Trạng thái: <span>Đã thanh toán</span></p>
    </div>

    <div class="btn-group">
        <a href="{{ route('payment.page', $booking) }}" class="btn btn-outline">
            Xem chi tiết booking
        </a>

        <a href="{{ route('home') }}" class="btn btn-primary">
            Về trang chủ
        </a>
    </div>
</div>

</body>
</html>
