<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ServiceInvoice extends Model
{
    protected $fillable = ['booking_id', 'total_amount'];

    public function booking()
    {
        return $this->belongsTo(Booking::class);
    }

    public function charges()
    {
        return $this->hasMany(ServiceCharge::class);
    }
}
