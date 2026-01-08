<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('bookings', function (Blueprint $table) {

            // Giá gốc trước khi áp dụng voucher
            $table->integer('subtotal_price')
                  ->after('total_price');

            // Mã voucher đã áp dụng (snapshot)
            $table->string('voucher_code')
                  ->nullable()
                  ->after('subtotal_price');

            // Số tiền được giảm
            $table->integer('voucher_discount')
                  ->default(0)
                  ->after('voucher_code');
        });
    }

    public function down(): void
    {
        Schema::table('bookings', function (Blueprint $table) {
            $table->dropColumn([
                'subtotal_price',
                'voucher_code',
                'voucher_discount'
            ]);
        });
    }
};
