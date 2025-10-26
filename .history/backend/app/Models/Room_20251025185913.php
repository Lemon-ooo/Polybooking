<?php

namespace App\Models;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Room extends Model
{
    use HasFactory;
        protected $table = 'rooms';
    protected $primaryKey = 'room_id'; // ✅ rất quan trọng!
    public $timestamps = true; // nếu bảng có created_at, updated_at
     protected $fillable = [
        'room_number',
        'room_type_id',
        'description',
        'price',
        'status',
    ];

    public function roomType()
    {
        return $this->belongsTo(RoomType::class);
    }
    public function amenities()
{
    return $this->belongsToMany(
        Amenity::class,       // model liên kết
        'room_amenity',       // tên bảng pivot
        'room_id',            // khóa ngoại của Room
        'amenity_id'          // khóa ngoại của Amenity
    );
}




}
