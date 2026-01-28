<?php
try {
    $pdo = new PDO('mysql:host=127.0.0.1;port=3306;dbname=brightway_db', 'root', '');
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    echo "Connected successfully to MySQL via 127.0.0.1\n";
    
    $stmt = $pdo->query("SELECT count(*) FROM users");
    echo "User count: " . $stmt->fetchColumn() . "\n";
} catch (PDOException $e) {
    echo "Connection failed: " . $e->getMessage();
}
