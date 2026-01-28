<?php
try {
    $dsn = "mysql:host=127.0.0.1;port=3306;dbname=brightway_db;connect_timeout=3";
    echo "Attempting connection to $dsn...\n";
    $pdo = new PDO($dsn, 'root', '', [PDO::ATTR_TIMEOUT => 3]);
    echo "Connected successfully!\n";
} catch (PDOException $e) {
    echo "Connection failed: " . $e->getMessage() . "\n";
}
