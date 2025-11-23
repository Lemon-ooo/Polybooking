<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class ServiceCharge extends Model
{
    use HasFactory;

    protected $primaryKey = 'service_charge_id';
    public $incrementing = true;
    protected $keyType = 'int';

    protected $fillable = [
        'booking_id',
        'service_id',
        'quantity',
        'price',
        'amount',
    ];

    protected $casts = [
        'price'  => 'decimal:2',
        'amount' => 'decimal:2',
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

    public function service()
    {
        return $this->belongsTo(Service::class, 'service_id', 'service_id');
    }

    /*
    |--------------------------------------------------------------------------
    | Helpers
    |--------------------------------------------------------------------------
    */

    public function recalculateAmount(): void
    {
        $this->amount = $this->price * $this->quantity;
        $this->save();
    }
}
