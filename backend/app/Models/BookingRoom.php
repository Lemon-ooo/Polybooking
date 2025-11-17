<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Carbon\Carbon;

class BookingRoom extends Model
{
    protected $table = 'booking_rooms';
    protected $primaryKey = 'booking_room_id';
    public $incrementing = true;
    protected $keyType = 'int';
    public $timestamps = false; // bảng không có updated_at

    protected $fillable = [
        'booking_id',
        'room_type_id',
        'room_id',
        'check_in_date',
        'check_out_date',
        'num_guests',
        'price',
        'created_at'
    ];

    /**
     * Laravel sẽ tự động chuyển các cột ngày về đối tượng Carbon.
     */
    protected $casts = [
        'check_in_date'  => 'date',
        'check_out_date' => 'date',
        'created_at'     => 'datetime',
        'num_guests'     => 'integer',
        'price'          => 'decimal:2',
        'room_id'        => 'integer',
        'room_type_id'   => 'integer',
        'booking_id'     => 'integer',
    ];

    /* ---------------------------------------------
     * 🔹 Quan hệ với các bảng khác
     * --------------------------------------------- */

    // Mỗi booking_room thuộc về một booking
    public function booking()
    {
        return $this->belongsTo(Booking::class, 'booking_id', 'booking_id');
    }

    // Mỗi booking_room gắn với một loại phòng
    public function type()
    {
        return $this->belongsTo(RoomType::class, 'room_type_id', 'id');
    }

    // Mỗi booking_room có thể gán 1 phòng thật (room_id)
    public function room()
    {
        return $this->belongsTo(Room::class, 'room_id', 'room_id');
    }

    /* ---------------------------------------------
     * 🔹 Accessors (thuận tiện cho Blade)
     * --------------------------------------------- */

    public function getCheckInFormattedAttribute(): string
    {
        return $this->check_in_date instanceof Carbon
            ? $this->check_in_date->format('d/m/Y')
            : (string) $this->check_in_date;
    }

    public function getCheckOutFormattedAttribute(): string
    {
        return $this->check_out_date instanceof Carbon
            ? $this->check_out_date->format('d/m/Y')
            : (string) $this->check_out_date;
    }
}
