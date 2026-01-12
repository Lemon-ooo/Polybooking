<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class BookingItem extends Model
{
    protected $table = 'booking_items';

    protected $primaryKey = 'booking_item_id';
    public $incrementing = true;
    protected $keyType = 'int';
    protected $fillable = [
        'booking_id',
        'room_type_id',
        'quantity',
        'number_of_nights',
        'base_price',
        'amount'
    ];
    public function roomType()
    {
        return $this->belongsTo(
            RoomType::class,
            'room_type_id',
            'room_type_id'
        );
    }
    
}
