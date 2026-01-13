<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        // Normalize existing values
        DB::table('rooms')->whereIn('room_status', ['đang sử dụng', 'occupied'])->update(['room_status' => 'in_use']);
        DB::table('rooms')->whereIn('room_status', ['sửa chữa', 'unavailable'])->update(['room_status' => 'maintenance']);

        // ALTER TABLE cannot run inside a transaction on some MySQL setups, run it directly
        DB::statement("ALTER TABLE `rooms` MODIFY `room_status` ENUM('available','booked','in_use','maintenance') NOT NULL DEFAULT 'available'");
    }

    public function down(): void
    {
        // Revert enum type
        DB::statement("ALTER TABLE `rooms` MODIFY `room_status` ENUM('available','đang sử dụng','sửa chữa') NOT NULL DEFAULT 'available'");

        // Try to convert back values (best-effort)
        DB::table('rooms')->where('room_status', 'in_use')->update(['room_status' => 'đang sử dụng']);
        DB::table('rooms')->where('room_status', 'maintenance')->update(['room_status' => 'sửa chữa']);
    }
};
