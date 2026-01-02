<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class RoomType extends Model
{
   protected $table = 'room_types';

    protected $primaryKey = 'room_type_id';

    public $incrementing = true;

    protected $keyType = 'int';

    protected $fillable = [
        'room_type_name',
        'room_type_image',
        'base_price',
        'max_guests',
        'description',
    ];

    // 🔥 Thêm vào đây
    protected $appends = ['total_rooms'];

    // 🔥 Hàm này auto + 1 field ảo "total_rooms" vào JSON và trong view
    public function getTotalRoomsAttribute()
    {
        return $this->rooms()->count();
    }

    // Quan hệ 1-n: 1 room_type có nhiều rooms
    public function rooms(): HasMany
    {
        return $this->hasMany(Room::class, 'room_type_id');
    }

    // Quan hệ n-n: room_type ↔ amenities
    public function amenities(): BelongsToMany
    {
        return $this->belongsToMany(
            Amenity::class,
            'room_type_amenity',
            'room_type_id',
            'amenity_id'
        );
    }

    // Quan hệ 1-n: room_type → roomTypeImages
    public function images(): HasMany
    {
        return $this->hasMany(RoomTypeImage::class, 'room_type_id');
    }
    public function bookingItems()
{
    return $this->hasMany(BookingItem::class, 'room_type_id', 'room_type_id');
}

public function assignedRooms()
{
    return $this->hasMany(AssignedRoom::class, 'room_type_id', 'room_type_id');
}
public function totalPricePerRoom()
    {
        return $this->base_price + $this->amenities->sum('price');

    }
    public function bookings()
{
    return $this->hasMany(Booking::class, 'room_type_id');
}


}

