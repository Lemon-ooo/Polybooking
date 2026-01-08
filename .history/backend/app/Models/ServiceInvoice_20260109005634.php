<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ServiceInvoice extends Model
{
    protected $table = 'service_invoices';

    protected $fillable = [
        'booking_id',
        'total_amount',
    ];

    /**
     * Booking sở hữu service invoice
     */
    public function booking()
    {
        return $this->belongsTo(Booking::class, 'booking_id', 'id');
    }

    /**
     * 🔥 CÁC DỊCH VỤ CHI TIẾT TRONG HÓA ĐƠN
     */
    public function charges()
    {
        return $this->hasMany(ServiceCharge::class, 'service_invoice_id', 'id');
    }
}