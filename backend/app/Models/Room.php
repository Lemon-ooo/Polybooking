<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Room extends Model
{
    protected $table = 'rooms';

    // Room status values (standardized)
    public const STATUS_AVAILABLE = 'available';
    public const STATUS_IN_USE   = 'in_use';
    public const STATUS_BOOKED   = 'booked';
    public const STATUS_MAINTENANCE = 'maintenance';

    /**
     * ⚠️ QUAN TRỌNG: PK không phải id
     */
    protected $primaryKey = 'room_id';
    public $incrementing = true;
    protected $keyType = 'int';

    protected $fillable = [
    'room_type_id',
    'room_number',
    'room_status',
    'description',
];


    /* =====================================================
     * RELATIONSHIPS
     * ===================================================== */

    public function roomType()
    {
        return $this->belongsTo(RoomType::class, 'room_type_id', 'room_type_id');
    }

    public function assignedRooms()
    {
        return $this->hasMany(AssignedRoom::class, 'room_id', 'room_id');
    }

    /* =====================================================
     * BUSINESS LOGIC
     * ===================================================== */

    /**
     * Kiểm tra phòng còn trống
     * Giá trị room_status nên thống nhất trong DB
     */
    public function isAvailable(): bool
    {
        return $this->room_status === self::STATUS_AVAILABLE;
        // use constant for status to keep strings standardized
    }
}