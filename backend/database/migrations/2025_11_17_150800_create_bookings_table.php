<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('bookings', function (Blueprint $table) {
            $table->id('booking_id');
            $table->unsignedBigInteger('room_id');
            $table->string('customer_name');
            $table->string('customer_phone');
            $table->string('customer_email')->nullable();
            $table->date('check_in');
            $table->date('check_out');
            $table->decimal('total_price', 10, 2);
            $table->string('payment_status')->default('pending'); // pending, paid, failed
            $table->timestamps();

            $table->foreign('room_id')->references('room_id')->on('rooms')->onDelete('cascade');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('bookings');
    }
};
