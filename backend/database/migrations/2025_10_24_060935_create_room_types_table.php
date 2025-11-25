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
        Schema::create('room_types', function (Blueprint $table) {

            // Primary key
            $table->bigIncrements('room_type_id');

            // Tên loại phòng hiển thị, ví dụ "Phòng Deluxe", "Phòng Standard"
            $table->string('room_type_name');

            // Ảnh đại diện loại phòng
            $table->string('room_type_image')->nullable();

            // Giá cơ bản
            $table->decimal('base_price', 12, 2)->default(0);

            // Tổng số phòng thuộc loại này
            // $table->unsignedInteger('total_rooms')->default(1);

            // Số khách tối đa mỗi phòng
            $table->unsignedInteger('max_guests')->default(1);

            // Mô tả chi tiết
            $table->text('description')->nullable();

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('room_types');
    }
};
