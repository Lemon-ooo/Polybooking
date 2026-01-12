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

    protected $appends = ['total_rooms', 'avg_rating', 'total_reviews'];

    /** Virtual Fields */
    public function getTotalRoomsAttribute()
    {
        return $this->rooms()->count();
    }

    public function getAvgRatingAttribute()
    {
        return round($this->avgRating() ?? 0, 1);
    }

    public function getTotalReviewsAttribute()
    {
        return $this->totalReviews();
    }

    /** Relationships */

    public function rooms(): HasMany
    {
        return $this->hasMany(Room::class, 'room_type_id', 'room_type_id');
    }

    public function amenities(): BelongsToMany
    {
        return $this->belongsToMany(
            Amenity::class,
            'room_type_amenity',
            'room_type_id',
            'amenity_id'
        );
    }

    public function images(): HasMany
    {
        return $this->hasMany(RoomTypeImage::class, 'room_type_id', 'room_type_id');
    }

    public function bookingItems(): HasMany
    {
        return $this->hasMany(BookingItem::class, 'room_type_id', 'room_type_id');
    }

    public function reviews(): HasMany
    {
        return $this->hasMany(Review::class, 'room_type_id', 'room_type_id');
    }

    /** Calculators */
    public function avgRating()
    {
        return $this->reviews()
            ->where('is_hidden', 0)
            ->avg('rating');
    }

    public function totalReviews()
    {
        return $this->reviews()
            ->where('is_hidden', 0)
            ->count();
    }
}