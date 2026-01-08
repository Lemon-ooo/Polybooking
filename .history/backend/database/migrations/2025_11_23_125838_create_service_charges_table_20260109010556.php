<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
public function up()
{
    Schema::create('service_charges', function (Blueprint $table) {
        $table->id();

        // foreign key — MUST match service_invoices.id
        $table->unsignedBigInteger('service_invoice_id');

        $table->unsignedBigInteger('service_id');   // id bảng services
        $table->integer('quantity')->default(1);
        $table->integer('price');                   // giá 1 đơn vị
        $table->integer('amount');                  // quantity * price

        $table->timestamps();

        $table->foreign('service_invoice_id')
              ->references('id')
              ->on('service_invoices')
              ->onDelete('cascade');

        $table->foreign('service_id')
              ->references('service_id')
              ->on('services')
              ->onDelete('cascade');
    });
}



    public function down(): void
    {
        Schema::dropIfExists('service_charges');
    }
};