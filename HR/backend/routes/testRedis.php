<?php
require __DIR__ . '/../vendor/autoload.php';
use Predis\Client;

$redis = new Client([
    'scheme' => 'tcp',
    'host'   => '127.0.0.1', // ❗ change to 'redis' if both in Docker
    'port'   => 6379,
]);

try {
    echo "Pinging Redis...\n";
    echo $redis->ping(); // should return "PONG"
} catch (Exception $e) {
    echo "Connection failed: " . $e->getMessage();
}
