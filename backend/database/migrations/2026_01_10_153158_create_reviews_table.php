<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('reviews', function (Blueprint $table) {
    $table->id();

    $table->unsignedBigInteger('user_id');
    $table->unsignedBigInteger('booking_id');
    $table->unsignedBigInteger('room_type_id');

    $table->tinyInteger('rating'); // 1–5
    $table->text('comment')->nullable();

    $table->boolean('is_hidden')->default(false);

    $table->timestamps();

    // 1 user chỉ review 1 lần / room_type / booking
    $table->unique(['user_id', 'booking_id', 'room_type_id']);
});
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('reviews');
    }
};
