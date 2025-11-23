<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('room_type_amenity', function (Blueprint $table) {
            $table->id();

            // FK tới room_types
            $table->unsignedBigInteger('room_type_id');

            // FK tới amenities
            $table->unsignedBigInteger('amenity_id');

            // (Optional) phụ phí do amenity này gây ra
            // Nếu bro muốn tính giá chi tiết hơn có thể dùng thêm cột này
            // $table->decimal('extra_price', 12, 2)->default(0);

            $table->timestamps();

            $table->foreign('room_type_id')
                  ->references('room_type_id')
                  ->on('room_types')
                  ->onDelete('cascade');

            $table->foreign('amenity_id')
                  ->references('amenity_id')
                  ->on('amenities')
                  ->onDelete('cascade');

            // Tránh trùng 1 amenity gán 2 lần cho cùng 1 room_type
            $table->unique(['room_type_id', 'amenity_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('room_type_amenity');
    }
};
