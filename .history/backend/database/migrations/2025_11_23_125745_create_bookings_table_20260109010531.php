<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
public function up()
{
    Schema::create('bookings', function (Blueprint $table) {
        $table->id();
        $table->unsignedBigInteger('user_id');

        // khách
        $table->integer('adults');
        $table->integer('children')->default(0);

        // thời gian
        $table->date('check_in');
        $table->date('check_out');
        $table->integer('nights');

        // chi phí phòng
        $table->integer('room_type_id');
        $table->integer('room_quantity');
        $table->integer('room_price');     // tổng giá phòng (base + amenities)
        $table->integer('total_price');    // tổng phải trả trước

        // thanh toán
        $table->integer('prepaid_amount')->default(0);
        $table->integer('refund_amount')->default(0);

        // trạng thái booking
        $table->enum('status', [
            'draft',
            'pending_payment',     // chờ thanh toán trước
            'paid',                // đã thanh toán
            'canceled_by_user',
            'canceled_by_admin',
            'check_in',
            'in_use',
            'check_out'
        ])->default('draft');

        $table->timestamps();
    });
}

    public function down(): void
    {
        Schema::dropIfExists('bookings');
    }
};