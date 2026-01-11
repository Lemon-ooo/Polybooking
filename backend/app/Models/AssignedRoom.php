<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use App\Models\Booking;

class AssignedRoom extends Model
{
    use HasFactory;

    // statuses (match migration)
    public const STATUS_ASSIGNED = 'assigned';
    public const STATUS_CHECKED_IN = 'checked_in';
    public const STATUS_IN_USE = 'in_use';
    public const STATUS_CHECKOUT_PENDING = 'checkout_pending';
    public const STATUS_CHECKED_OUT = 'checked_out';

    protected $primaryKey = 'assigned_room_id';
    public $incrementing = true;
    protected $keyType = 'int';

    protected $fillable = [
        'booking_id',
        'room_id',
        'room_type_id',
        'check_in',
        'check_out',
        'status',
        'checked_in_at',
        'checked_out_at'
    ];

    protected $casts = [
        'check_in'  => 'date',
        'check_out' => 'date',
    ];

    /*
    |--------------------------------------------------------------------------
    | Quan hệ
    |--------------------------------------------------------------------------
    */

    public function booking()
    {
        return $this->belongsTo(Booking::class, 'booking_id', 'booking_id');
    }

    public function room()
    {
        return $this->belongsTo(Room::class, 'room_id', 'room_id');
    }

    public function roomType()
    {
        return $this->belongsTo(RoomType::class, 'room_type_id', 'room_type_id');
    }
}
