<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('assigned_rooms', function (Blueprint $table) {

            // PK
            $table->id('assigned_room_id');

            // FK
            $table->unsignedBigInteger('booking_id');
            $table->unsignedBigInteger('room_id');
            $table->unsignedBigInteger('room_type_id');

            // Thời gian booking
            $table->date('check_in');
            $table->date('check_out');

            // Trạng thái sử dụng phòng theo booking
            $table->enum('status', [
                'assigned',          // đã gán phòng (sau khi booking paid)
                'checked_in',        // đã check-in
                'in_use',            // đang ở
                'checkout_pending',  // đang xử lý checkout
                'checked_out'        // đã checkout xong
            ])->default('assigned');

            // Thời điểm thực tế
            $table->timestamp('checked_in_at')->nullable();
            $table->timestamp('checked_out_at')->nullable();

            $table->timestamps();

            // Foreign keys
            $table->foreign('booking_id')
                ->references('id')->on('bookings')
                ->onDelete('cascade');

            $table->foreign('room_id')
                ->references('room_id')->on('rooms')
                ->onDelete('cascade');

            $table->foreign('room_type_id')
                ->references('room_type_id')->on('room_types')
                ->onDelete('cascade');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('assigned_rooms');
    }
};
