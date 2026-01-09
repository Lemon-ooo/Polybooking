<!DOCTYPE html>
<html lang="vi">
<head>
    <meta charset="UTF-8">
    <title>Hóa đơn</title>
</head>
<body style="font-family: Arial, sans-serif; background:#f7f7f7; padding:20px">

<div style="max-width:600px; margin:auto; background:#ffffff; padding:24px; border-radius:8px">
    <h2 style="color:#333;">🧾 Hóa đơn thanh toán</h2>

    <p>
        Xin chào
        <strong>{{ $invoice['customer']['name'] ?? 'Quý khách' }}</strong>,
    </p>

    <p>
        Hóa đơn <strong>{{ $invoice['invoice_code'] }}</strong> của bạn đã được xuất.
    </p>

    <p>
        📎 File <strong>PDF hóa đơn</strong> được đính kèm trong email này.
    </p>

    <hr>

    <table width="100%" cellpadding="6">
        <tr>
            <td>Tổng tiền:</td>
            <td align="right"><strong>{{ number_format($invoice['summary']['total']) }} VND</strong></td>
        </tr>
        <tr>
            <td>Đã thanh toán:</td>
            <td align="right">{{ number_format($invoice['summary']['paid']) }} VND</td>
        </tr>
        <tr>
            <td>Phí dịch vụ phát sinh:</td>
            <td align="right" style="color:red">
                {{ number_format($invoice['summary']['due']) }} VND
            </td>
        </tr>
    </table>

    <hr>

    <p style="font-size:14px; color:#666">
        Cảm ơn bạn đã sử dụng dịch vụ của chúng tôi ❤️<br>
        Nếu có thắc mắc, vui lòng liên hệ lễ tân hoặc hotline.
    </p>
</div>

</body>
</html>
