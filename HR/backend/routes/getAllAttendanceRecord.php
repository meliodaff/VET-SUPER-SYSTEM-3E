<?php
require __DIR__ . '/../config/database.php';
$redis = require __DIR__ . '/../config/redis.php';

$cacheKey = 'users:list';

header('Content-Type: application/json');

try {
    $totalStart = microtime(true);

    // ----------------------------------------------------
    // 💡 Performance Refactoring: Use GET for both check and fetch
    // Eliminates the separate EXISTS round-trip on a cache hit.
    // ----------------------------------------------------
    $getStart = microtime(true);
    // GET returns the value, or NULL (or false, depending on client/version) if the key doesn't exist.
    $cachedJson = $redis->get($cacheKey);
    $getEnd = microtime(true);
    
    // Check if a non-empty, valid result was returned from Redis
    if ($cachedJson !== null && $cachedJson !== false && strlen($cachedJson) > 0) {
        
        // CACHE HIT PATH ✅
        $dataSize = strlen($cachedJson);
        
        $outputStart = microtime(true);
        echo $cachedJson;
        $outputEnd = microtime(true);
        
        $totalEnd = microtime(true);

        echo "\n✅ Fetched from Redis (Optimized)";
        echo "\n📊 Data Size: " . round($dataSize / 1024, 2) . " KB";
        // Now only measure the single Redis GET operation time
        // echo "\n⏱ Redis GET: " . round(($getEnd - $getStart) * 1000, 2) . " ms";
        // echo "\n⏱ Output Time: " . round(($outputEnd - $outputStart) * 1000, 2) . " ms";
        echo "\n⏲ Total Time: " . round(($totalEnd - $totalStart) * 1000, 2) . " ms";

    } else {
        // CACHE MISS PATH 📦 (DB Fetch and Cache Set)
        
        $dbStart = microtime(true);
        // Using the simple query from your original code
        $stmt = $pdo->query("SELECT * FROM time_and_attendance"); 
        $users = $stmt->fetchAll(PDO::FETCH_ASSOC);
        $dbEnd = microtime(true);

        $encodeStart = microtime(true);
        $jsonOutput = json_encode($users);
        $encodeEnd = microtime(true);
        
        $dataSize = strlen($jsonOutput);

        $cacheStart = microtime(true);
        // SETEX is already efficient, no change needed here.
        $redis->setex($cacheKey, 600, $jsonOutput);
        $cacheEnd = microtime(true);

        $outputStart = microtime(true);
        echo $jsonOutput;
        $outputEnd = microtime(true);
        
        $totalEnd = microtime(true);

        echo "\n📦 Fetched from Database (First Load)";
        echo "\n📊 Data Size: " . round($dataSize / 1024, 2) . " KB";
        // echo "\n⏱ DB Query: " . round(($dbEnd - $dbStart) * 1000, 2) . " ms";
        // echo "\n⏱ JSON Encode: " . round(($encodeEnd - $encodeStart) * 1000, 2) . " ms";
        // echo "\n⏱ Cache Storage: " . round(($cacheEnd - $cacheStart) * 1000, 2) . " ms";
        // echo "\n⏱ Output Time: " . round(($outputEnd - $outputStart) * 1000, 2) . " ms";
        echo "\n⏲ Total Time: " . round(($totalEnd - $totalStart) * 1000, 2) . " ms";
    }

    echo "\n";

} catch (Exception $e) {
    // If the Content-Type header has already been sent, this will fail 
    // to properly format the response as JSON. In a production environment, 
    // it's best to handle errors before any output, or log them.
    http_response_code(500);
    echo json_encode(["error" => "An error occurred: " . $e->getMessage()]);
}