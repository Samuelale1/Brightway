<?php
require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use Illuminate\Support\Facades\Schema;

$cat = Schema::hasColumn('products', 'category') ? 'YES' : 'NO';
$avail = Schema::hasColumn('products', 'availability') ? 'YES' : 'NO';

echo "Category: $cat\nAvailability: $avail";
