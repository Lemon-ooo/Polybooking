<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        // Chỉ chạy nếu bảng amenities tồn tại
        if (Schema::hasTable('amenities')) {
            Schema::table('amenities', function (Blueprint $table) {
                // XÓA cột icon_url nếu còn
                if (Schema::hasColumn('amenities', 'icon_url')) {
                    $table->dropColumn('icon_url');
                }

                // THÊM cột icon_path nếu chưa có
                if (!Schema::hasColumn('amenities', 'icon_path')) {
                    $table->string('icon_path')->nullable()->after('category');
                }
            });
        }
    }

    public function down()
    {
        if (Schema::hasTable('amenities')) {
            Schema::table('amenities', function (Blueprint $table) {
                if (Schema::hasColumn('amenities', 'icon_path')) {
                    $table->dropColumn('icon_path');
                }
                if (!Schema::hasColumn('amenities', 'icon_url')) {
                    $table->string('icon_url')->nullable()->after('category');
                }
            });
        }
    }
};