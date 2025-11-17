<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('bookings', function (Blueprint $table) {
            $table->bigIncrements('booking_id'); // PK chuẩn
            $table->unsignedBigInteger('user_id'); // FK users
            $table->string('booking_code')->unique();
            $table->decimal('total_price', 14, 2)->default(0);
            $table->string('status', 20)->default('pending');
            $table->text('special_request')->nullable();
            $table->timestamps();

            // nếu cần ràng buộc FK users
            // $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('bookings');
    }
};
