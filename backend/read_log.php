<?php
$file = 'storage/logs/laravel.log';
if (!file_exists($file)) {
    echo "Log file not found.";
    exit;
}
$output = [];
$handle = fopen($file, "r");
if ($handle) {
    fseek($handle, -5000, SEEK_END); // go back 5000 bytes
    // read until we hit a newline to align
    fgets($handle);
    while (($line = fgets($handle)) !== false) {
        echo $line;
    }
    fclose($handle);
}
