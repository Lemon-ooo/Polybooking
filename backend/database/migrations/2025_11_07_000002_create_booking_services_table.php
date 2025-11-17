<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        // Dọn "xác" nếu có
        if (Schema::hasTable('booking_services')) {
            Schema::drop('booking_services');
        }

        Schema::create('booking_services', function (Blueprint $t) {
            // Khớp với bookings.booking_id (bigint unsigned) và services.id (bigint unsigned)
            $t->unsignedBigInteger('booking_id');
            $t->unsignedBigInteger('service_id');

            $t->unsignedInteger('quantity')->default(1);
            $t->decimal('price', 14, 2);

            // Khóa chính kép
            $t->primary(['booking_id', 'service_id']);

            // Index hỗ trợ
            $t->index('booking_id');
            $t->index('service_id');

            // TUYỆT ĐỐI: không addForeign ở đây
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('booking_services');
    }
};
