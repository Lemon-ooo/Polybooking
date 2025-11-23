<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Carbon\Carbon;

class Booking extends Model
{
    use HasFactory;

    protected $primaryKey = 'booking_id';
    public $incrementing = true;
    protected $keyType = 'int';

    protected $fillable = [
        'user_id',
        'check_in',
        'check_out',
        'guest_number',
        'room_total_amount',
        'service_total_amount',
        'penalty_total_amount',
        'booking_total_amount',
        'remaining_balance',
        'status',
    ];

    protected $casts = [
        'check_in'  => 'date',
        'check_out' => 'date',
    ];

    // Trạng thái booking
    public const STATUS_UNPAID    = 'unpaid';
    public const STATUS_PAID      = 'paid';
    public const STATUS_CONFIRMED = 'confirmed';
    public const STATUS_CANCELLED = 'cancelled';

    /*
    |--------------------------------------------------------------------------
    | Quan hệ
    |--------------------------------------------------------------------------
    */

    // User đặt booking
    public function user()
    {
        return $this->belongsTo(User::class, 'user_id', 'user_id');
    }

    // Các loại phòng trong booking (room_type + quantity)
    public function items()
    {
        return $this->hasMany(BookingItem::class, 'booking_id', 'booking_id');
    }

    // Phòng cụ thể được gán sau khi thanh toán
    public function assignedRooms()
    {
        return $this->hasMany(AssignedRoom::class, 'booking_id', 'booking_id');
    }

    // Dịch vụ phát sinh
    public function serviceCharges()
    {
        return $this->hasMany(ServiceCharge::class, 'booking_id', 'booking_id');
    }

    // Phí phạt
    public function penaltyCharges()
    {
        return $this->hasMany(PenaltyCharge::class, 'booking_id', 'booking_id');
    }

    /*
    |--------------------------------------------------------------------------
    | Accessors & Helpers
    |--------------------------------------------------------------------------
    */

    // Số đêm ở = check_out - check_in
    public function getNumberOfNightsAttribute(): ?int
    {
        if (!$this->check_in || !$this->check_out) {
            return null;
        }

        return $this->check_in->diffInDays($this->check_out);
    }

    // Tính lại các tổng (room_total, service_total, penalty_total, booking_total, remaining)
    public function recalculateTotals(): void
    {
        $roomTotal     = $this->items()->sum('amount');
        $serviceTotal  = $this->serviceCharges()->sum('amount');
        $penaltyTotal  = $this->penaltyCharges()->sum('amount');

        $this->room_total_amount      = $roomTotal;
        $this->service_total_amount   = $serviceTotal;
        $this->penalty_total_amount   = $penaltyTotal;
        $this->booking_total_amount   = $roomTotal + $serviceTotal + $penaltyTotal;
        $this->remaining_balance      = $serviceTotal + $penaltyTotal;

        $this->save();
    }

    // Check có thể hủy không (business rule: chỉ khi unpaid)
    public function canBeCancelled(): bool
    {
        return $this->status === self::STATUS_UNPAID;
    }
}
