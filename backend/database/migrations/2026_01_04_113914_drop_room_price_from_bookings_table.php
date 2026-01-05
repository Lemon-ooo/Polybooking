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
    Schema::table('bookings', function (Blueprint $table) {
        if (Schema::hasColumn('bookings', 'room_price')) {
            $table->dropColumn('room_price');
        }
    });
}

public function down()
{
    Schema::table('bookings', function (Blueprint $table) {
        $table->integer('room_price')->default(0);
    });
}

};
