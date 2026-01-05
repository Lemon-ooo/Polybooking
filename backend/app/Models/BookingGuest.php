<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class BookingGuest extends Model
{
    /**
     * Các cột hiện có trong DB
     * - name     : tên khách
     * - age      : tuổi
     * - verified : đã xác nhận hay chưa (0/1)
     */
    protected $fillable = [
        'booking_id',
        'name',
        'age',
        'verified'
    ];

    protected $casts = [
        'verified' => 'boolean',
    ];

    public function booking()
    {
        return $this->belongsTo(Booking::class);
    }

    /* ===============================
     |  HELPER METHODS (RẤT QUAN TRỌNG)
     =============================== */

    /**
     * Xác định loại khách dựa trên tuổi
     */
    public function getGuestTypeAttribute()
    {
        return $this->age < 10 ? 'child' : 'adult';
    }

    /**
     * Đánh dấu khách đã được xác nhận khi check-in
     */
    public function verify()
    {
        $this->update(['verified' => true]);
    }
}
