<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class BookingService extends Model
{
    protected $table = 'booking_services';
    public $timestamps = false;

    // composite key => tắt incrementing và primaryKey null
    protected $primaryKey = null;
    public $incrementing = false;

    protected $fillable = ['booking_id','service_id','quantity','price'];

    public function booking()
    {
        return $this->belongsTo(Booking::class, 'booking_id', 'booking_id');
    }

    // services.id
    public function service()
    {
        return $this->belongsTo(Service::class, 'service_id', 'id');
    }
}
