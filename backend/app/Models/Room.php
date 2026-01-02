<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Room extends Model
{
    protected $fillable = ['room_type_id', 'room_number', 'room_status'];

    public function roomType()
    {
        return $this->belongsTo(RoomType::class);
    }

    public function assignedRooms()
    {
        return $this->hasMany(AssignedRoom::class);
    }

    public function isAvailable()
    {
        return $this->room_status === 'trống';
    }
}
