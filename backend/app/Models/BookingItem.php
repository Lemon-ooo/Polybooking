<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class BookingItem extends Model
{
    protected $table = 'booking_items';

    protected $primaryKey = 'booking_item_id';

    protected $fillable = [
        'booking_id',
        'room_type_id',
        'quantity',
        'price',
    ];
}
