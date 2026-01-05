<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Room extends Model
{
    protected $table = 'rooms';

    /**
     * ⚠️ QUAN TRỌNG: PK không phải id
     */
    protected $primaryKey = 'room_id';
    public $incrementing = true;
    protected $keyType = 'int';

    protected $fillable = [
        'room_type_id',
        'room_number',
        'room_status'
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
        return $this->room_status === 'trống';
        // nếu DB dùng 'available' thì đổi lại cho khớp
    }
}
