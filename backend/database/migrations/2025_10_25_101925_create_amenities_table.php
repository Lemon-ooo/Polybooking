<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('amenities', function (Blueprint $table) {
            // Khóa chính
            $table->bigIncrements('amenity_id');

            // Tên tiện ích, ví dụ: "Free Wi-Fi", "Breakfast included"
            $table->string('amenity_name');

            // Ảnh / icon biểu diễn tiện ích
            $table->string('amenity_image')->nullable();

            // Mô tả chi tiết
            $table->text('description')->nullable();

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('amenities');
    }
};
