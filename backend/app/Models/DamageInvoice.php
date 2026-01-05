<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class DamageInvoice extends Model
{
    protected $fillable = [
        'booking_id', 'damage_type_id',
        'amount', 'image'
    ];

    public function booking()
    {
        return $this->belongsTo(Booking::class);
    }

    public function damageType()
    {
        return $this->belongsTo(DamageType::class);
    }
}
