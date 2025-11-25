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

            $table->unsignedBigInteger('user_id');

            $table->date('check_in');
            $table->date('check_out');

            $table->integer('guest_number');

            // Tiền phòng (đã thanh toán online)
            $table->decimal('room_total_amount', 12, 2)->default(0);

            // Dịch vụ phát sinh
            $table->decimal('service_total_amount', 12, 2)->default(0);

            // Phí phạt
            $table->decimal('penalty_total_amount', 12, 2)->default(0);

            // Tổng cuối = room + service + penalty
            $table->decimal('booking_total_amount', 12, 2)->default(0);

            // Khách còn nợ (dịch vụ + phạt)
            $table->decimal('remaining_balance', 12, 2)->default(0);

            $table->enum('status', ['unpaid', 'paid', 'confirmed', 'cancelled'])
                ->default('unpaid');

            $table->timestamps();

            // FK
            $table->foreign('user_id')
                  ->references('user_id')->on('users')
                  ->onDelete('cascade');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('bookings');
    }
};
