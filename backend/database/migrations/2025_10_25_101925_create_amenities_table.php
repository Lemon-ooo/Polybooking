<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('amenities', function (Blueprint $table) {
            $table->id('amenity_id');
            $table->string('name');
            $table->string('category')->nullable(); // general, bathroom, service...
            $table->string('icon_url')->nullable();
            $table->text('description')->nullable();
            $table->timestamps(); // thêm created_at, updated_at
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('amenities');
    }
};
