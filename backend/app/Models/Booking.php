<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\User;

class Booking extends Model
{
    // ================== BOOKING STATUS ==================
    public const STATUS_PENDING_PAYMENT = 'pending_payment';
    public const STATUS_PAID            = 'paid';
    public const STATUS_CHECK_IN        = 'check_in';
    public const STATUS_CHECK_OUT       = 'check_out';
    public const STATUS_CANCELED        = 'canceled';

    protected $fillable = [
        'user_id', 'adults', 'children',
        'check_in', 'check_out', 'nights',
        'room_type_id', 'room_quantity', 'room_price', 'total_price',
        'prepaid_amount', 'refund_amount',
        'status'
    ];

    /*
    |--------------------------------------------------------------------------
    | RELATIONSHIPS
    |--------------------------------------------------------------------------
    */

    // ✅ USER ĐẶT PHÒNG (BỔ SUNG – FIX LỖI ADMIN)
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    // Khách trong booking
    public function guests()
    {
        return $this->hasMany(BookingGuest::class);
    }

    // Loại phòng
    public function roomType()
    {
        return $this->belongsTo(
            RoomType::class,
            'room_type_id',   // FK ở bookings
            'room_type_id'    // PK ở room_types
        );
    }

    // Phòng được gán khi check-in
    public function assignedRooms()
    {
        return $this->hasMany(AssignedRoom::class);
    }

    // Hóa đơn dịch vụ
    public function serviceInvoice()
    {
        return $this->hasOne(ServiceInvoice::class);
    }

    // Hóa đơn hư hỏng
    public function damageInvoices()
    {
        return $this->hasMany(DamageInvoice::class);
    }

    // Phạt
    public function penalties()
    {
        return $this->hasMany(Penalty::class);
    }

    // Thanh toán (NÊN CÓ vì admin đang dùng)
    public function payments()
    {
        return $this->hasMany(Payment::class);
    }

    /*
    |--------------------------------------------------------------------------
    | BUSINESS LOGIC
    |--------------------------------------------------------------------------
    */

    public function calculateTotalRoomPrice()
    {
        return $this->room_price * $this->room_quantity * $this->nights;
    }

    public function isCheckInDay()
    {
        return now()->toDateString() === $this->check_in;
    }

    public function isCheckOutDay()
    {
        return now()->toDateString() === $this->check_out;
    }
}
