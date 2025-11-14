<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Amenity extends Model
{
    use HasFactory;

    protected $primaryKey = 'amenity_id';
    public $timestamps = false;

    // ĐÃ ĐỔI: icon_url → icon_path
    protected $fillable = [
        'name',
        'category',
        'icon_path',      // <-- mới
        'description',
    ];

    public function rooms()
    {
        return $this->belongsToMany(
            Room::class,
            'room_amenity',
            'amenity_id',
            'room_id'
        );
    }

    /**
     * Accessor: tự động trả về URL đầy đủ của ảnh
     * Dùng: $amenity->iconUrl  (trong Blade)
     */
    public function getIconUrlAttribute()
    {
        if ($this->icon_path) {
            return asset('storage/' . $this->icon_path);
        }

        // Nếu không có ảnh thì trả về placeholder hoặc null
        return asset('images/no-image.png'); // bạn có thể tạo file placeholder hoặc để null
        // return null;
    }
}