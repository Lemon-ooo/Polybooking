<?php

namespace Database\Seeders;

use App\Models\Booking;
use Illuminate\Database\Seeder;

class BookingSeeder extends Seeder
{
    public function run(): void
    {
        Booking::create([
            'room_id' => 1,  
            'customer_name' => 'Test User',
            'customer_phone' => '0123456789',
            'customer_email' => 'test@example.com',
            'check_in' => '2025-01-20',
            'check_out' => '2025-01-22',
            'total_price' => 2000000,
            'payment_status' => 'pending',
        ]);
    }
}
