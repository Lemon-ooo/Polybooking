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
     Schema::create('conversations', function (Blueprint $table) {
            $table->id();

            // user gửi tin
            $table->unsignedBigInteger('user_id');
            $table->foreign('user_id')
                ->references('user_id')
                ->on('users')
                ->cascadeOnDelete();

            // admin trả lời (nullable)
            $table->unsignedBigInteger('admin_id')->nullable();
            $table->foreign('admin_id')
                ->references('user_id')
                ->on('users')
                ->nullOnDelete();

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('conversations');
    }

};
