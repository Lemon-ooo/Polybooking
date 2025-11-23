<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Room extends Model
{
    protected $primaryKey = 'room_id';
    public $incrementing = true;
    protected $keyType = 'int';

    protected $fillable = [
        'room_number',
        'room_status',
        'description',
        'room_type_id',
    ];

    // room -> thuộc về room_type
    public function roomType(): BelongsTo
    {
        return $this->belongsTo(RoomType::class, 'room_type_id');
    }
    public function assignedRooms()
{
    return $this->hasMany(AssignedRoom::class, 'room_id', 'room_id');
}

}
