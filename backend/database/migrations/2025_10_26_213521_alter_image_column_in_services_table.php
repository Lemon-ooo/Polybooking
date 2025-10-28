<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('services', function (Blueprint $table) {
            // đổi từ string sang text để lưu link ảnh dài
            $table->text('image')->nullable()->change();
        });
    }

    public function down(): void
    {
        Schema::table('services', function (Blueprint $table) {
            // nếu rollback thì quay lại string
            $table->string('image', 255)->nullable()->change();
        });
    }
};
