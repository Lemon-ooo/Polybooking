<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Relations\Pivot;

class RoomAmenity extends Pivot
{
    public $timestamps = false; // ✅ Tắt created_at và updated_at
}
