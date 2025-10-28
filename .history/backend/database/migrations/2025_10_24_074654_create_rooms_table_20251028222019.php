<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('room_images', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('room_id'); // liên kết với rooms.room_id
            $table->string('image_path');
            $table->timestamps();

            // Sửa tại đây — tham chiếu tới 'room_id' thay vì 'id'
            $table->foreign('room_id')
      ->references('room_id')
      ->on('rooms')
      ->onDelete('cascade');

        });
    }

    public function down(): void
    {
        Schema::dropIfExists('room_images');
    }
};
