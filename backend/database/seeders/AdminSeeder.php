<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class AdminSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
{
    \App\Models\User::updateOrCreate(
        ['email' => 'admin@polybooking.local'],
        [
            'name' => 'Super Admin',
            'password' => 'Admin123!', // sẽ auto hash do cast
            'role' => 'admin',
        ]
    );
}

}
