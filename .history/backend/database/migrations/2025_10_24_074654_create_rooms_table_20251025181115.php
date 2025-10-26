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
        Schema::create('rooms', function (Blueprint $table) {
            $table->id('room_id');

        $table->string('room_number'); // VD: 101, 102, 201...
        $table->unsignedBigInteger('room_type_id'); // khóa ngoại
        $table->text('description')->nullable();
        $table->decimal('price', 10, 2)->nullable(); // có thể kế thừa từ loại phòng
        $table->string('status')->default('available'); // available, booked, maintenance,...
        $table->timestamps();

        $table->foreign('room_type_id')->references('id')->on('room_types')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('rooms');
    }
};
