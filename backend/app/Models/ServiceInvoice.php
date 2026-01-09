<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ServiceInvoice extends Model
{
    protected $table = 'service_invoices';

    protected $fillable = [
        'booking_id',
        'total_amount',
        'status',
    ];

    // 🔥 GẮN booking
    public function booking()
    {
        return $this->belongsTo(Booking::class, 'booking_id', 'id');
    }

    // 🔥 GẮN service charges
    public function charges()
    {
        return $this->hasMany(ServiceCharge::class, 'service_invoice_id', 'id');
    }
}
