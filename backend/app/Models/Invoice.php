<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Invoice extends Model
{
    protected $fillable = [
        'booking_id',
        'invoice_code',
        'customer_name',
        'customer_email',
        'room_total',
        'service_total',
        'damage_total',
        'penalty_total',
        'grand_total',
        'paid_total',
        'due_total',
        'data',
        'pdf_path',
        'issued_at',
    ];

    protected $casts = [
        'data' => 'array',
        'issued_at' => 'datetime',
    ];

    public function booking()
    {
        return $this->belongsTo(Booking::class);
    }
}