<?php
require_once __DIR__ . '/../vendor/autoload.php';
use Predis\Client as RedisClient;

class RedisConnection {
    private static $instance = null;

    public static function getInstance() {
        if (self::$instance === null) {
            self::$instance = new RedisClient([
                'scheme' => 'tcp',
                'host'   => '127.0.0.1:6379', // ✅ connect from host to Docker
                'port'   => 6379,
            ]);
        }
        return self::$instance;
    }
}

return RedisConnection::getInstance();
