<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
public function up()
{
    Schema::create('damage_types', function (Blueprint $table) {
        $table->id();   // PK
        $table->string('name');  // tên lỗi: vỡ kính, cháy nệm, hư TV...
        $table->integer('price'); // giá tiền cố định
        $table->text('description')->nullable(); // mô tả chi tiết
        $table->timestamps();
    });
}

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('damage_types');
    }
};
