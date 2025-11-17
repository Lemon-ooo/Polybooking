<h1>Thanh toán phòng {{ $booking->room->room_number }}</h1>

<p>Khách hàng: {{ $booking->customer_name }}</p>
<p>Ngày nhận: {{ $booking->check_in }}</p>
<p>Ngày trả: {{ $booking->check_out }}</p>
<p>Tổng tiền: {{ number_format($booking->total_price) }} VND</p>

<form action="{{ route('payment.process', $booking->booking_id) }}" method="POST">
    @csrf
    <p>Chọn phương thức thanh toán:</p>
    <select name="payment_method" required>
        <option value="fake">Thanh toán giả (manual)</option>
        <option value="vnpay">VNPay (fake)</option>
        <option value="momo">MoMo (fake)</option>
        <option value="paypal">PayPal (fake)</option>
    </select>
    <br><br>
    <button type="submit">Thanh toán ngay</button>
</form>
