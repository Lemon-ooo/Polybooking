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
        Schema::create('messages', function (Blueprint $table) {
    $table->id();
    $table->unsignedBigInteger('conversation_id');
    $table->unsignedBigInteger('sender_id'); // user_id hoặc admin_id
    $table->enum('sender_type', ['user', 'admin']);
    $table->text('message');
    $table->timestamps();

    $table->foreign('conversation_id')
          ->references('id')
          ->on('conversations')
          ->onDelete('cascade');
});
    }

    public function down(): void
    {
        Schema::dropIfExists('messages');
    }
};