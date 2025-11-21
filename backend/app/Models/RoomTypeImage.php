<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class RoomTypeImage extends Model
{
    protected $primaryKey = 'image_id';
    public $incrementing = true;
    protected $keyType = 'int';

    protected $fillable = [
        'room_type_id',
        'image_url',
        'image_type',
        'sort_order',
    ];

    public function roomType(): BelongsTo
    {
        return $this->belongsTo(RoomType::class, 'room_type_id');
    }
}
