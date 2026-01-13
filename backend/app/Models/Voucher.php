<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Voucher extends Model
{
    protected $fillable = [
        'code', 'discount_percent', 'discount_amount',
        'min_price', 'expired_at', 'status'
    ];

    public function isValid()
    {
        return $this->status === 'active'
            && now()->lte($this->expired_at);
    }

    public function applyDiscount($price)
    {
        if ($this->discount_percent) {
            return $price * (1 - $this->discount_percent / 100);
        }

        return max(0, $price - $this->discount_amount);
    }

    public function users()
{
    return $this->belongsToMany(
        User::class,
        'voucher_user',
        'voucher_id',
        'user_id'
    );
}



public function events()
{
    return $this->belongsToMany(Event::class, 'event_voucher');
}
}
