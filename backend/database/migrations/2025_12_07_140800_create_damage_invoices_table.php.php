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
    Schema::create('damage_invoices', function (Blueprint $table) {
        $table->id(); // PK DUY NHẤT
        $table->unsignedBigInteger('booking_id');
        $table->unsignedBigInteger('damage_type_id');
        $table->integer('amount');
        $table->string('image')->nullable();
        $table->timestamps();

        $table->foreign('booking_id')
              ->references('id')
              ->on('bookings')
              ->onDelete('cascade');

        $table->foreign('damage_type_id')
              ->references('id')
              ->on('damage_types');
    });
}




    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('damage_types');
    }
};
