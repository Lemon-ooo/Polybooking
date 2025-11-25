<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('service_charges', function (Blueprint $table) {
            $table->id('service_charge_id');

            $table->unsignedBigInteger('booking_id');
            $table->unsignedBigInteger('service_id');

            $table->integer('quantity')->default(1);
            $table->decimal('price', 12, 2);
            $table->decimal('amount', 12, 2); // price × quantity

            $table->timestamps();

            // FK
            $table->foreign('booking_id')
                  ->references('booking_id')->on('bookings')
                  ->onDelete('cascade');

            $table->foreign('service_id')
                  ->references('service_id')->on('services')
                  ->onDelete('cascade');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('service_charges');
    }
};
