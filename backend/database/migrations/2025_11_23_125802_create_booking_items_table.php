<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('booking_items', function (Blueprint $table) {
            $table->id('booking_item_id');

            $table->unsignedBigInteger('booking_id');
            $table->unsignedBigInteger('room_type_id');

            $table->integer('quantity');
            $table->integer('number_of_nights');
            $table->decimal('base_price', 12, 2);
            $table->decimal('amount', 12, 2);

            $table->timestamps();

            // FK
            $table->foreign('booking_id')
                  ->references('booking_id')->on('bookings')
                  ->onDelete('cascade');

            $table->foreign('room_type_id')
                  ->references('room_type_id')->on('room_types')
                  ->onDelete('cascade');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('booking_items');
    }
};
