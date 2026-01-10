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
        // an toàn cho API, không gây vòng lặp
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
     * ❌ SAI NGHIỆP VỤ – ĐÃ LOẠI BỎ
     * assigned_rooms KHÔNG gắn trực tiếp với room_type
     * mà gắn qua rooms → assigned_rooms
     */

    /**
     * ❌ SAI NGHIỆP VỤ – ĐÃ LOẠI BỎ
     * booking KHÔNG có room_type_id trực tiếp
     * booking → booking_items → room_type
     */

    /* =====================================================
     * BUSINESS LOGIC
     * ===================================================== */

    /**
     * Giá cơ bản / 1 phòng / 1 đêm
     * ❌ KHÔNG cộng amenities ở đây (amenities không phải lúc nào cũng tính tiền)
     */
    public function pricePerNight(): float
    {
        return (float) $this->base_price;
    }

  public function reviews()
{
    return $this->hasMany(\App\Models\Review::class, 'room_type_id', 'room_type_id');
}

/**
 * ⭐ Điểm trung bình (chỉ review hiện)
 */
public function avgRating()
{
    return $this->reviews()
        ->where('is_hidden', false)
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
