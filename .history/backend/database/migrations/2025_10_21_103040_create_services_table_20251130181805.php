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
        Schema::create('services', function (Blueprint $table) {

            // Primary key
            $table->bigIncrements('service_id');

            // Tên dịch vụ: ví dụ "Ăn sáng", "Giặt ủi", "Đưa đón sân bay"
            $table->string('service_name');

            // Mô tả chi tiết dịch vụ
            $table->text('description')->nullable();

            // Giá dịch vụ (decimal chuẩn thương mại)
            $table->decimal('service_price', 12, 2)->default(0);

            // Ảnh / icon dịch vụ
            $table->string('service_image')->nullable();

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('services');
    }
};
