<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class RoomType extends Model
{
    protected $table = 'room_types';

    /**
     * ⚠️ QUAN TRỌNG: PK không phải id
     */
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

    /**
     * Field ảo: tổng số phòng theo loại
     */
    protected $appends = ['total_rooms'];

    public function getTotalRoomsAttribute()
    {
        return $this->rooms()->count();
    }

    /* =====================================================
     * RELATIONSHIPS
     * ===================================================== */

    // 1 room_type → nhiều rooms
    public function rooms(): HasMany
    {
        return $this->hasMany(Room::class, 'room_type_id', 'room_type_id');
    }

    // n-n: room_type ↔ amenities
    public function amenities(): BelongsToMany
    {
        return $this->belongsToMany(
            Amenity::class,
            'room_type_amenity',
            'room_type_id',
            'amenity_id'
        );
    }

    // 1 room_type → nhiều images
    public function images(): HasMany
    {
        return $this->hasMany(RoomTypeImage::class, 'room_type_id', 'room_type_id');
    }

    // 1 room_type → nhiều booking_items
    public function bookingItems(): HasMany
    {
        return $this->hasMany(BookingItem::class, 'room_type_id', 'room_type_id');
    }

    /**
     * ⭐ Quan hệ Review
     */
    public function reviews()
{
    return $this->hasMany(Review::class, 'room_type_id');
}


    /**
     * ⭐ Điểm trung bình (chỉ review hiện)
     */
    public function avgRating()
    {
        return $this->reviews()
            ->where('is_hidden', 0)
            ->avg('rating');
    }

    /**
     * 🔢 Tổng số review (chỉ review hiện)
     */
    public function totalReviews()
    {
        return $this->reviews()
            ->where('is_hidden', 0)
            ->count();
    }
}