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
        if (Schema::hasColumn('bookings', 'room_quantity')) {
            $table->dropColumn('room_quantity');
        }
    });
}

public function down()
{
    Schema::table('bookings', function (Blueprint $table) {
        $table->integer('room_quantity')->default(1);
    });
}

};
