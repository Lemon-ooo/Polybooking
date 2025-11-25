<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class BookingItem extends Model
{
    use HasFactory;

    protected $primaryKey = 'booking_item_id';
    public $incrementing = true;
    protected $keyType = 'int';

    protected $fillable = [
        'booking_id',
        'room_type_id',
        'quantity',
        'number_of_nights',
        'base_price',
        'amount',
    ];

    protected $casts = [
        'base_price' => 'decimal:2',
        'amount'     => 'decimal:2',
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

    public function roomType()
    {
        return $this->belongsTo(RoomType::class, 'room_type_id', 'room_type_id');
    }

    /*
    |--------------------------------------------------------------------------
    | Helpers
    |--------------------------------------------------------------------------
    */

    // Tính lại amount = base_price * nights * quantity
    public function recalculateAmount(): void
    {
        $this->amount = $this->base_price * $this->number_of_nights * $this->quantity;
        $this->save();
    }
}
