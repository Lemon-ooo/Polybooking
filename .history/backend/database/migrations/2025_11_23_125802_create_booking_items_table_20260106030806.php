<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
{
    Schema::create('booking_items', function (Blueprint $table) {
        $table->bigIncrements('booking_item_id');

        $table->unsignedBigInteger('booking_id');
        $table->unsignedBigInteger('room_type_id');

        $table->integer('quantity');
        $table->integer('price');

        $table->timestamps();

        $table->foreign('booking_id')
              ->references('id')
              ->on('bookings')
              ->onDelete('cascade');

        $table->foreign('room_type_id')
              ->references('room_type_id')
              ->on('room_types');
    });
}

public function down()
{
    Schema::dropIfExists('booking_items');
}

};
