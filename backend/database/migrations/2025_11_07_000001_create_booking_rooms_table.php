<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        // Xóa nếu còn "xác" do lỗi trước
        if (Schema::hasTable('booking_rooms')) {
            Schema::drop('booking_rooms');
        }

        Schema::create('booking_rooms', function (Blueprint $t) {
            // PK: BIGINT UNSIGNED AUTO_INCREMENT
            $t->bigIncrements('booking_room_id');

            // FK candidates: BIGINT UNSIGNED (KHÔNG auto_increment)
            $t->unsignedBigInteger('booking_id');
            $t->unsignedBigInteger('room_type_id');
            $t->unsignedBigInteger('room_id')->nullable();

            $t->date('check_in_date');
            $t->date('check_out_date');
            $t->unsignedInteger('num_guests');
            $t->decimal('price', 14, 2);
            $t->timestamp('created_at')->useCurrent();

            // Index phục vụ tra cứu
            $t->index(['room_type_id','check_in_date','check_out_date']);
            $t->index(['room_id','check_in_date','check_out_date']);

            // CHƯA addForeign tại đây để tránh errno:150
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('booking_rooms');
    }
};
