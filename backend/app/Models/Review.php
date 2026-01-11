<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Review extends Model
{
    protected $table = 'reviews';

    protected $primaryKey = 'id';

    protected $fillable = [
        'user_id',
        'booking_id',
        'room_type_id',
        'rating',
        'comment',
        'is_hidden',
    ];

    /**
     * USER RELATION
     */
public function user()
{
    return $this->belongsTo(User::class, 'user_id');
}


    /**
     * BOOKING RELATION
     */
    public function booking()
    {
        return $this->belongsTo(Booking::class, 'booking_id', 'id');
    }

    /**
     * ROOM TYPE RELATION
     */
    public function roomType()
    {
        return $this->belongsTo(RoomType::class, 'room_type_id', 'room_type_id');
    }
}