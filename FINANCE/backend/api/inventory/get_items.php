
<?php
require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../utils/cors.php';
require_once __DIR__ . '/../utils/response.php';

cors();

$res = $conn->query("SELECT id, sku, name, quantity, unit_cost FROM inventory_items ORDER BY name ASC");
$out = [];
while ($row = $res->fetch_assoc()) { $out[] = $row; }
return json_response($out, 200);
