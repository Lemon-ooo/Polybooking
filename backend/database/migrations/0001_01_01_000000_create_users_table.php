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
        Schema::create('users', function (Blueprint $table) {
            // Khóa chính
            $table->bigIncrements('user_id');

            // Tên hiển thị người dùng
            $table->string('user_name');

            // Email duy nhất
            $table->string('email')->unique();

            // Xác thực email (mặc định Laravel)
            $table->timestamp('email_verified_at')->nullable();

            // Mật khẩu (đã hash)
            $table->string('password');

            // Số điện thoại (tuỳ chọn)
            $table->string('phone_number')->nullable();

            // Địa chỉ (tuỳ chọn)
            $table->string('address')->nullable();

            // Ảnh đại diện (lưu path hoặc URL)
            $table->string('avatar')->nullable();

            // Ngày sinh (tuỳ chọn)
            $table->date('date_of_birth')->nullable();

            // Vai trò: admin / customer
            $table->enum('role', ['admin', 'customer'])->default('customer');

            // Token "ghi nhớ đăng nhập"
            $table->rememberToken();

            // created_at, updated_at
            $table->timestamps();
        });

        // Giữ nguyên 2 bảng dưới (chuẩn Laravel)
        Schema::create('password_reset_tokens', function (Blueprint $table) {
            $table->string('email')->primary();
            $table->string('token');
            $table->timestamp('created_at')->nullable();
        });

        Schema::create('sessions', function (Blueprint $table) {
            $table->string('id')->primary();
            $table->foreignId('user_id')->nullable()->index();
            $table->string('ip_address', 45)->nullable();
            $table->text('user_agent')->nullable();
            $table->longText('payload');
            $table->integer('last_activity')->index();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('sessions');
        Schema::dropIfExists('password_reset_tokens');
        Schema::dropIfExists('users');
    }
};
