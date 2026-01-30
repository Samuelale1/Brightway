<?php
require 'vendor/autoload.php';
use Illuminate\Support\Facades\DB;
$app = require_once 'bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

try {
    DB::connection()->getPdo();
    echo "Connection successful!";
} catch (\Exception $e) {
    echo "Connection failed: " . $e->getMessage();
}
