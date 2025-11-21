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
        Schema::create('rooms', function (Blueprint $table) {
            // Khóa chính
            $table->bigIncrements('room_id');

            // Số phòng, ví dụ: 101, 102, 201...
            $table->string('room_number')->unique();

            // Khóa ngoại tới room_types.room_type_id
            $table->unsignedBigInteger('room_type_id');

            // Trạng thái phòng: available, booked, maintenance,...
            $table->string('room_status')->default('available');

            // Mô tả
            $table->text('description')->nullable();

            $table->timestamps();

            // Thiết lập khóa ngoại đúng với room_types
            $table->foreign('room_type_id')
                  ->references('room_type_id')
                  ->on('room_types')
                  ->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('rooms');
    }
};
