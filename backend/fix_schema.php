<?php
require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;

echo "Checking schema...\n";

if (!Schema::hasColumn('products', 'category')) {
    echo "Adding 'category' column...\n";
    Schema::table('products', function (Blueprint $table) {
        $table->string('category')->nullable()->after('image');
    });
    echo "Category added.\n";
} else {
    echo "Category exists.\n";
}

if (!Schema::hasColumn('products', 'availability')) {
    echo "Adding 'availability' column...\n";
    Schema::table('products', function (Blueprint $table) {
        $table->enum('availability', ['available', 'wait_time', 'unavailable'])->default('available')->after('category');
    });
    echo "Availability added.\n";
} else {
    echo "Availability exists.\n";
}

echo "Done.\n";
