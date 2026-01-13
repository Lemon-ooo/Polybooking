<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('voucher_user', function (Blueprint $table) {
    $table->id();

    $table->unsignedBigInteger('user_id');
    $table->unsignedBigInteger('voucher_id');
    $table->boolean('is_used')->default(false);

    $table->timestamps();

    $table->foreign('user_id')
        ->references('user_id')
        ->on('users')
        ->onDelete('cascade');

    $table->foreign('voucher_id')
        ->references('id')
        ->on('vouchers')
        ->onDelete('cascade');

    // 🔥 QUAN TRỌNG
    $table->unique(['user_id', 'voucher_id']);
});
    }

    public function down(): void
    {
        Schema::dropIfExists('voucher_user');
    }
};
