<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class MembershipTierSeeder extends Seeder
{
    public function run(): void
    {
        DB::table('membership_tiers')->insert([
            [
                'name' => 'silver',
                'min_points' => 0,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'gold',
                'min_points' => 5000,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'diamond',
                'min_points' => 10000,
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);
    }
}
