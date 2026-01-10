<h2>Xin chào {{ $booking->user->name }}</h2>

<p>Bạn đã thanh toán thành công booking <b>#{{ $booking->id }}</b>.</p>

<h3>Thông tin booking</h3>
<ul>
    <li>Check-in: {{ $booking->check_in }}</li>
    <li>Check-out: {{ $booking->check_out }}</li>
    <li>Số đêm: {{ $booking->nights }}</li>
    <li>Tổng tiền: {{ number_format($booking->total_price) }} VND</li>
    <li>Trạng thái: {{ strtoupper($booking->status) }}</li>
</ul>

<h3>Chi tiết phòng</h3>
<ul>
@foreach ($booking->items as $item)
    <li>
        {{ $item->roomType->room_type_name }}  
        × {{ $item->quantity }} phòng  
        ({{ number_format($item->amount) }} VND)
    </li>
@endforeach
</ul>

<p>Cảm ơn bạn đã sử dụng dịch vụ của chúng tôi ❤️</p>
