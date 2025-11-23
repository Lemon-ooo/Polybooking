<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('penalty_charges', function (Blueprint $table) {
            $table->id('penalty_id');

            $table->unsignedBigInteger('booking_id');

            $table->text('description')->nullable();
            $table->decimal('amount', 12, 2);

            $table->timestamps();

            $table->foreign('booking_id')
                  ->references('booking_id')->on('bookings')
                  ->onDelete('cascade');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('penalty_charges');
    }
};
