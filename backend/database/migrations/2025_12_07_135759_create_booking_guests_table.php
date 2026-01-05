<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
public function up()
{
    Schema::create('booking_guests', function (Blueprint $table) {
        $table->id();
        $table->unsignedBigInteger('booking_id');
        $table->string('name')->nullable();
        $table->integer('age')->nullable(); 
        $table->boolean('verified')->default(false);
        $table->timestamps();

        $table->foreign('booking_id')->references('id')->on('bookings')->onDelete('cascade');
    });
}


    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('booking_guests');
    }
};
