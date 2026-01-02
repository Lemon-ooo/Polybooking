<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CheckoutPhoto extends Model
{
    protected $fillable = [
        'booking_id',
        'image_path'
    ];

    public function booking()
    {
        return $this->belongsTo(Booking::class);
    }
}
