<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Event extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'description',
        'banner',
        'start_date',
        'end_date',
        'is_active',
    ];


    public function vouchers()
{
    return $this->belongsToMany(Voucher::class, 'event_voucher');
}
}
