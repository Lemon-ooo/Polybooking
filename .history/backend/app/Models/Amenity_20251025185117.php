<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Amenity extends Model
{
    use HasFactory;

    protected $primaryKey = 'amenity_id';

    protected $fillable = [
        'name',
        'category',
        'icon_url',
        'description',
    ];
    public function rooms()
{
    return $this->belongsToMany(Room::class, 'room_amenity', 'amenity_id', 'room_id')
                ->using(RoomAmenity::class);
}


}
