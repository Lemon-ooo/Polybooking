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
    Schema::create('room_type_amenities', function (Blueprint $table) {

        $table->id();

        // foreign key CHUẨN
        $table->unsignedBigInteger('room_type_id');

        $table->string('name');
        $table->integer('price')->default(0);

        $table->timestamps();

        $table->foreign('room_type_id')
              ->references('room_type_id')
              ->on('room_types')
              ->onDelete('cascade');
    });
}



    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('room_type_amenities');
    }
};
