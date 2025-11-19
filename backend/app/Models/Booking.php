<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Booking extends Model
{
    use HasFactory;

    protected $table = 'bookings';
    protected $primaryKey = 'booking_id';

    protected $fillable = [
        'room_id',
        'customer_name',
        'customer_phone',
        'customer_email',
        'check_in',
        'check_out',
        'total_price',
        'payment_status',
    ];

    public function room() {
        return $this->belongsTo(Room::class, 'room_id', 'room_id');
    }
}
