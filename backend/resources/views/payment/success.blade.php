<h1>Thanh toán thành công!</h1>

<p>Mã booking: {{ $booking->booking_id }}</p>
<p>Tổng tiền: {{ number_format($booking->total_price) }} VND</p>
<p>Phương thức: {{ $booking->payment_method }}</p>
<p>Trạng thái: {{ $booking->payment_status }}</p>
