<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class DamageInvoice extends Model
{
    protected $fillable = [
        'booking_id',
        'damage_type_id',
        'amount',
        'image_path', // ✅ ĐỔI TÊN
    ];

    protected $appends = ['image_url'];

    public function booking()
    {
        return $this->belongsTo(Booking::class);
    }

    public function damageType()
    {
        return $this->belongsTo(DamageType::class);
    }

    public function getImageUrlAttribute()
    {
        return $this->image_path
            ? asset('storage/' . $this->image_path)
            : null;
    }
}
