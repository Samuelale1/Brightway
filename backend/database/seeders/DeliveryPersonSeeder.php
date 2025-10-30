<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\DeliveryPerson;

class DeliveryPersonSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Clear existing records (optional)
        DeliveryPerson::truncate();

        // Insert initial delivery persons
        DeliveryPerson::insert([
            [
                'name' => 'John Doe',
                'phone' => '08012345678',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Jane Smith',
                'phone' => '08023456789',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Michael Adams',
                'phone' => '08034567890',
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);
    }
}
