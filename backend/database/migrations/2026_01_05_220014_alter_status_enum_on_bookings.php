<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        DB::statement("
            ALTER TABLE bookings
            MODIFY status ENUM(
                'draft',
                'pending_payment',
                'paid',
                'check_in',
                'in_use',
                'check_out',
                'canceled_by_user',
                'canceled_by_admin'
            ) NOT NULL DEFAULT 'draft'
        ");
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        DB::statement("
            ALTER TABLE bookings
            MODIFY status ENUM(
                'draft',
                'pending_payment',
                'paid',
                'canceled_by_admin',
                'check_in',
                'in_use',
                'check_out',
                'canceled_by_user',
                'canceled'
            ) NOT NULL DEFAULT 'draft'
        ");
    }
};
