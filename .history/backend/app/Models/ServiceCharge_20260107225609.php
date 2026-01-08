<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ServiceCharge extends Model
{
    protected $fillable = [
        'service_invoice_id', 'service_id',
        'quantity', 'price', 'amount'
    ];

    public function invoice()
    {
        return $this->belongsTo(ServiceInvoice::class, 'service_invoice_id');
    }
}
