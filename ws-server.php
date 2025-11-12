<?php
require __DIR__ . '/vendor/autoload.php';

use Ratchet\MessageComponentInterface;
use Ratchet\ConnectionInterface;
use Ratchet\Http\HttpServer;
use Ratchet\Server\IoServer;
use Ratchet\WebSocket\WsServer;
use React\EventLoop\Loop;
use React\Socket\SocketServer;

class RFIDServer implements MessageComponentInterface {
    protected $clients;

    public function __construct() {
        $this->clients = new \SplObjectStorage;
        echo "✅ WebSocket server started on ws://localhost:8080/rfid\n";
    }

    public function onOpen(ConnectionInterface $conn) {
        $this->clients->attach($conn);
        echo "🔗 New connection: ({$conn->resourceId})\n";
    }

    // public function onMessage(ConnectionInterface $from, $msg) {
    //     echo "📩 Received message: $msg\n";
    // }
public function onMessage(ConnectionInterface $from, $msg) {
    echo "📩 Received message: $msg\n";

    // send to all connected clients (except sender)
    foreach ($this->clients as $client) {
        if ($from !== $client) {
            $client->send($msg);
        }
    }
}


    public function onClose(ConnectionInterface $conn) {
        $this->clients->detach($conn);
        echo "❌ Connection {$conn->resourceId} closed\n";
    }

    public function onError(ConnectionInterface $conn, \Exception $e) {
        echo "⚠️ Error: {$e->getMessage()}\n";
        $conn->close();
    }

    public function broadcast($data) {
        foreach ($this->clients as $client) {
            $client->send(json_encode($data));
        }
    }
}

// Create server
$rfidServer = new RFIDServer();
$loop = Loop::get();

$webSock = new SocketServer('0.0.0.0:8080', [], $loop);
$webServer = new IoServer(new HttpServer(new WsServer($rfidServer)), $webSock, $loop);

// Optional: expose a HTTP endpoint for broadcasting
$loop->addPeriodicTimer(0.1, function() use ($rfidServer) {
    // you could poll DB or queue here
});

$loop->run();
