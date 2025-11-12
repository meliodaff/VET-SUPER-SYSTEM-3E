<?php
$redis = require __DIR__ . '/../config/redis.php';

// Example: set and get data
$redis->set('username', 'JvBialen');
echo "Stored username: " . $redis->get('username');
