<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('assigned_rooms', function (Blueprint $table) {
            $table->id('assigned_room_id');

            $table->unsignedBigInteger('booking_id');
            $table->unsignedBigInteger('room_id');
            $table->unsignedBigInteger('room_type_id');

            $table->date('check_in');
            $table->date('check_out');

            $table->timestamps();

            // FK
            $table->foreign('booking_id')
                  ->references('booking_id')->on('bookings')
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
