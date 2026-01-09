<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\ServiceInvoice;

class ServiceCharge extends Model
{
    protected $table = 'service_charges';

    protected $fillable = [
        'service_invoice_id',
        'service_id',
        'quantity',
        'price',
        'amount',
    ];

    /**
     * Hóa đơn dịch vụ
     */
     public function invoice()
    {
        return $this->belongsTo(ServiceInvoice::class, 'service_invoice_id', 'id');
    }

    // 🔥 QUAN TRỌNG: thêm cái này
    public function service()
    {
        return $this->belongsTo(Service::class, 'service_id', 'service_id');
    }

    public function booking()
{
    return $this->hasOneThrough(
        Booking::class,
        ServiceInvoice::class,
        'id',              // service_invoices.id
        'id',              // bookings.id
        'service_invoice_id',
        'booking_id'
    );
}
}