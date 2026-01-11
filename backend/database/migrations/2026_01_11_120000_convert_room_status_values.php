<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        // Convert Vietnamese / legacy values to standardized English constants
        DB::table('rooms')->where('room_status', 'đang sử dụng')->update(['room_status' => 'in_use']);
        DB::table('rooms')->where('room_status', 'sửa chữa')->update(['room_status' => 'maintenance']);

        // Common legacy values
        DB::table('rooms')->where('room_status', 'occupied')->update(['room_status' => 'in_use']);
        DB::table('rooms')->where('room_status', 'unavailable')->update(['room_status' => 'maintenance']);
    }

    public function down(): void
    {
        // Revert back to previous Vietnamese values where appropriate
        DB::table('rooms')->where('room_status', 'in_use')->update(['room_status' => 'đang sử dụng']);
        DB::table('rooms')->where('room_status', 'maintenance')->update(['room_status' => 'sửa chữa']);
    }
};
