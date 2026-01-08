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
        Schema::create('invoices', function (Blueprint $table) {
    $table->id();

    $table->unsignedBigInteger('booking_id');
    $table->string('invoice_code')->unique();

    $table->string('customer_name');
    $table->string('customer_email');

    $table->integer('room_total')->default(0);
    $table->integer('service_total')->default(0);
    $table->integer('damage_total')->default(0);
    $table->integer('penalty_total')->default(0);

    $table->integer('grand_total')->default(0);
    $table->integer('paid_total')->default(0);
    $table->integer('due_total')->default(0);

    // 🔥 lưu chi tiết hóa đơn
    $table->json('data');

    // 🔥 đường dẫn PDF
    $table->string('pdf_path')->nullable();

    $table->timestamp('issued_at');

    $table->timestamps();
});
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('invoices');
    }
};