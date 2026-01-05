<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Penalty extends Model
{
    protected $fillable = [
        'booking_id', 'days_late', 'amount'
    ];

    public function booking()
    {
        return $this->belongsTo(Booking::class);
    }
}
