<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Amenity extends Model
{
    protected $primaryKey = 'amenity_id';
    public $incrementing = true;
    protected $keyType = 'int';

    protected $fillable = [
        'amenity_name',
        'amenity_image',
        'description',
    ];

    // amenity <-> room_type (many-to-many)
    public function roomTypes(): BelongsToMany
    {
        return $this->belongsToMany(
            RoomType::class,
            'room_type_amenity',
            'amenity_id',
            'room_type_id'
        );
    }
}
