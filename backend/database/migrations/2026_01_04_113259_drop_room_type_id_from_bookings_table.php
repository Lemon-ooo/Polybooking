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
        if (Schema::hasColumn('bookings', 'room_type_id')) {
            $table->dropColumn('room_type_id');
        }
    });
}

public function down()
{
    Schema::table('bookings', function (Blueprint $table) {
        $table->unsignedBigInteger('room_type_id');
    });
}

};
