<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Enums\BookingStatus;

class Booking extends Model
{
    protected $table = 'bookings';
    protected $primaryKey = 'booking_id';
    public $incrementing = true;
    protected $keyType = 'int';

    protected $fillable = [
        'user_id','booking_code','total_price','status','special_request'
    ];

    protected $casts = [
        'status'      => BookingStatus::class,
        'total_price' => 'decimal:2',
        'created_at'  => 'datetime',
        'updated_at'  => 'datetime',
    ];

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id', 'id');
    }

    public function items()
    {
        return $this->hasMany(BookingRoom::class, 'booking_id', 'booking_id');
    }

    public function services()
    {
        return $this->hasMany(BookingService::class, 'booking_id', 'booking_id');
    }
    
}
