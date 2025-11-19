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
        Schema::create('tours', function (Blueprint $table) {
            $table->id();

            $table->string('name');
            $table->decimal('price', 10, 2);    // Giá tour
            $table->string('location');         // Địa điểm
            $table->date('start_date');         // Ngày bắt đầu
            $table->string('duration');         // Ví dụ: "3 ngày 2 đêm"
            $table->text('description')->nullable();
            $table->string('image')->nullable(); // Lưu URL hoặc path

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('tours');
    }
};
