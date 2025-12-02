<?php
require_once '../../config/database.php';
require_once '../../utils/cors.php';
require_once '../../utils/response.php';

$database = new Database();
$db = $database->getConnection();

if (!$db) {
    Response::error('Database connection failed');
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    Response::error('Method not allowed', 405);
}

$data = json_decode(file_get_contents("php://input"), true);

// Expected payload:
// {
//   supplier_id: number,
//   preferred_delivery_date: 'YYYY-MM-DD', // optional
//   notes: string, // optional
//   items: [
//     { item_id: number, quantity: number, unit_cost: number }
//   ]
// }

$supplierId = isset($data['supplier_id']) ? (int)$data['supplier_id'] : null;
$preferredDate = !empty($data['preferred_delivery_date']) ? $data['preferred_delivery_date'] : null;
$notes = isset($data['notes']) ? trim($data['notes']) : null;
$items = isset($data['items']) && is_array($data['items']) ? $data['items'] : [];

if (!$supplierId || empty($items)) {
    Response::error('supplier_id and at least one item are required');
}

// Basic validation on items
$cleanItems = [];
$totalAmount = 0;
foreach ($items as $item) {
    $itemId = isset($item['item_id']) ? (int)$item['item_id'] : 0;
    $qty = isset($item['quantity']) ? (float)$item['quantity'] : 0;
    $unitCost = isset($item['unit_cost']) ? (float)$item['unit_cost'] : 0;

    if ($itemId <= 0 || $qty <= 0 || $unitCost < 0) {
        continue;
    }

    $lineTotal = $qty * $unitCost;
    $totalAmount += $lineTotal;

    $cleanItems[] = [
        'item_id' => $itemId,
        'quantity' => $qty,
        'unit_cost' => $unitCost,
        'line_total' => $lineTotal,
    ];
}

if (empty($cleanItems)) {
    Response::error('All items are invalid. Please provide valid item_id, quantity and unit_cost.');
}

try {
    $db->beginTransaction();

    // Insert into purchase_orders
    $stmt = $db->prepare("
        INSERT INTO purchase_orders (
            supplier_id,
            total_amount,
            preferred_delivery_date,
            status,
            notes,
            created_at
        ) VALUES (?, ?, ?, 'Pending', ?, NOW())
    ");
    $stmt->execute([
        $supplierId,
        $totalAmount,
        $preferredDate,
        $notes,
    ]);

    $purchaseOrderId = (int)$db->lastInsertId();

    // Insert order items
    $itemStmt = $db->prepare("
        INSERT INTO purchase_order_items (
            purchase_order_id,
            item_id,
            quantity,
            unit_cost,
            line_total
        ) VALUES (?, ?, ?, ?, ?)
    ");

    foreach ($cleanItems as $ci) {
        $itemStmt->execute([
            $purchaseOrderId,
            $ci['item_id'],
            $ci['quantity'],
            $ci['unit_cost'],
            $ci['line_total'],
        ]);
    }

    $db->commit();

    Response::success(
        [
            'purchase_order_id' => $purchaseOrderId,
            'total_amount' => $totalAmount,
        ],
        'Purchase order created successfully'
    );
} catch (Exception $e) {
    if ($db->inTransaction()) {
        $db->rollBack();
    }
    Response::error('Database error: ' . $e->getMessage());
}
?>


