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
        Schema::create('room_type_images', function (Blueprint $table) {

            // Khóa chính
            $table->bigIncrements('image_id');

            // FK → room_types
            $table->unsignedBigInteger('room_type_id');

            // Đường dẫn ảnh (URL hoặc path uploads)
            $table->string('image_url');

            // Loại ảnh: main | secondary
            $table->enum('image_type', ['main', 'secondary'])->default('secondary');

            // Thứ tự hiển thị (optional, dùng để sắp ảnh)
            $table->unsignedInteger('sort_order')->default(0);

            $table->timestamps();

            // Khóa ngoại
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
        Schema::dropIfExists('room_type_images');
    }
};
