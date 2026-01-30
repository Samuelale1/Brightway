<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // 1. Admin User
        User::create([
            'name' => 'Admin User',
            'email' => 'admin@brightway.com',
            'password' => Hash::make('password123'),
            'role' => 'admin',
        ]);

        // 2. Salesperson User
        User::create([
            'name' => 'Sales Person',
            'email' => 'sales@brightway.com',
            'password' => Hash::make('password123'),
            'role' => 'salesperson',
        ]);

        // 3. Customer User
        User::create([
            'name' => 'Default Customer',
            'email' => 'customer@brightway.com',
            'password' => Hash::make('password123'),
            'role' => 'customer',
        ]);

        $this->command->info('3 Users (Admin, Salesperson, Customer) created successfully!');
    }
}
