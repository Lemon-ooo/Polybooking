<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class RoomTypeAmenity extends Model
{
    protected $fillable = ['room_type_id', 'name', 'price'];

    public function roomType()
    {
        return $this->belongsTo(RoomType::class);
    }
}
