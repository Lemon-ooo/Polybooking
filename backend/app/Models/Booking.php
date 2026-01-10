<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\User;
use App\Models\Review;

class Booking extends Model
{
    protected $table = 'bookings';

    /**
     * ⚠️ Nếu PK của bookings KHÔNG phải là id
     * (ví dụ booking_id) thì BẮT BUỘC bật dòng dưới
     */
    // protected $primaryKey = 'booking_id';

    // ================== BOOKING STATUS ==================
    public const STATUS_PENDING_PAYMENT = 'pending_payment';
    public const STATUS_PAID            = 'paid';
    public const STATUS_CHECK_IN      = 'check_in';
    public const STATUS_CHECK_OUT     = 'check_out';
    public const STATUS_CANCELED        = 'canceled';

    /**
     * ⚠️ Fillable PHẢI khớp DB schema
     * DB đang có adults, children → API phải map đúng
     */
    protected $fillable = [
        'user_id',
        'adults',
        'children',
        'check_in',
        'check_out',
        'nights',
        'subtotal_price',      // Tổng tiền trước giảm
        'voucher_code',        // Mã voucher áp dụng
        'voucher_discount',    // Số tiền giảm

        'total_price',
        'status',
    ];

    /* =====================================================
     * RELATIONSHIPS
     * ===================================================== */
    public function items()
    {
        return $this->hasMany(
            BookingItem::class,
            'booking_id',
            'id'
        );
    }
    // User đặt booking
    public function user()
{
    return $this->belongsTo(User::class, 'user_id', 'user_id');
}
    public function bookingItems()
    {
        return $this->hasMany(BookingItem::class, 'booking_id');
    }
    public function damages()
    {
        return $this->hasMany(DamageType::class, 'booking_id', 'id');
    }
    // Các phòng được gán khi check-in
    public function assignedRooms()
    {
        return $this->hasMany(AssignedRoom::class, 'booking_id', 'id');
    }

    // Dịch vụ phát sinh
    public function serviceCharges()
    {
        return $this->hasMany(ServiceCharge::class, 'booking_id', 'id');
    }

    // Phạt / hư hỏng
    public function penaltyCharges()
    {
        return $this->hasMany(PenaltyCharge::class, 'booking_id', 'id');
    }

    // Thanh toán
    public function payments()
    {
        return $this->hasMany(Payment::class, 'booking_id', 'id');
    }

    /* =====================================================
     * BUSINESS LOGIC (NHẸ – AN TOÀN)
     * ===================================================== */

    public function isCheckedIn(): bool
    {
        return $this->status === self::STATUS_CHECK_IN;
    }

    public function isCheckedOut(): bool
    {
        return $this->status === self::STATUS_CHECK_OUT;
    }

    public function voucher()
    {
        return $this->belongsTo(Voucher::class);
    }

    public function review()
{
    return $this->hasOne(Review::class, 'booking_id', 'id');
}
}
