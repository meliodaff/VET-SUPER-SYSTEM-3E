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

// Auto-generate purchase orders per supplier.
// Expected payload:
// {
//   preferred_delivery_date: 'YYYY-MM-DD', // optional
//   notes: string, // optional
//   items: [
//     { item_id: number, quantity: number }
//   ]
// }

$preferredDate = !empty($data['preferred_delivery_date']) ? $data['preferred_delivery_date'] : null;
$notes = isset($data['notes']) ? trim($data['notes']) : null;
$items = isset($data['items']) && is_array($data['items']) ? $data['items'] : [];

if (empty($items)) {
    Response::error('At least one item is required');
}

// Collect valid item IDs
$itemIds = [];
foreach ($items as $item) {
    $itemId = isset($item['item_id']) ? (int)$item['item_id'] : 0;
    $qty = isset($item['quantity']) ? (float)$item['quantity'] : 0;

    if ($itemId <= 0 || $qty <= 0) {
        continue;
    }
    $itemIds[] = $itemId;
}

if (empty($itemIds)) {
    Response::error('All items are invalid. Please provide valid item_id and quantity.');
}

// Load inventory data (must include supplier_id and unit_cost)
$placeholders = implode(',', array_fill(0, count($itemIds), '?'));
$invStmt = $db->prepare("
    SELECT id, supplier_id, unit_cost
    FROM inventory_items
    WHERE id IN ($placeholders)
");
$invStmt->execute($itemIds);
$invRows = $invStmt->fetchAll();

if (empty($invRows)) {
    Response::error('No matching inventory items found for the provided item IDs.');
}

$inventoryById = [];
foreach ($invRows as $row) {
    $inventoryById[(int)$row['id']] = $row;
}

// Group items by supplier_id
$ordersBySupplier = []; // supplier_id => ['items' => [], 'total_amount' => 0]
$invalidItems = [];

foreach ($items as $item) {
    $itemId = isset($item['item_id']) ? (int)$item['item_id'] : 0;
    $qty = isset($item['quantity']) ? (float)$item['quantity'] : 0;

    if ($itemId <= 0 || $qty <= 0) {
        continue;
    }

    if (!isset($inventoryById[$itemId])) {
        $invalidItems[] = $itemId;
        continue;
    }

    $inv = $inventoryById[$itemId];
    $supplierId = isset($inv['supplier_id']) ? (int)$inv['supplier_id'] : 0;

    if ($supplierId <= 0) {
        $invalidItems[] = $itemId;
        continue;
    }

    $unitCost = isset($inv['unit_cost']) ? (float)$inv['unit_cost'] : 0;
    $lineTotal = $qty * $unitCost;

    if (!isset($ordersBySupplier[$supplierId])) {
        $ordersBySupplier[$supplierId] = [
            'items' => [],
            'total_amount' => 0,
        ];
    }

    $ordersBySupplier[$supplierId]['items'][] = [
        'item_id' => $itemId,
        'quantity' => $qty,
        'unit_cost' => $unitCost,
        'line_total' => $lineTotal,
    ];
    $ordersBySupplier[$supplierId]['total_amount'] += $lineTotal;
}

if (empty($ordersBySupplier)) {
    $msg = 'No purchase orders could be generated.';
    if (!empty($invalidItems)) {
        $itemNames = [];
        foreach (array_unique($invalidItems) as $itemId) {
            if (isset($inventoryById[$itemId])) {
                $itemNames[] = $inventoryById[$itemId]['name'] ?? "Item #{$itemId}";
            } else {
                $itemNames[] = "Item #{$itemId}";
            }
        }
        $msg .= ' The following items are missing supplier assignments: ' . implode(', ', $itemNames) . '. Please set a supplier_id for these items in inventory_items table.';
    }
    Response::error($msg);
}

try {
    $db->beginTransaction();

    $createdOrders = [];

    $poStmt = $db->prepare("
        INSERT INTO purchase_orders (
            supplier_id,
            total_amount,
            preferred_delivery_date,
            status,
            notes,
            created_at
        ) VALUES (?, ?, ?, 'Pending', ?, NOW())
    ");

    $itemStmt = $db->prepare("
        INSERT INTO purchase_order_items (
            purchase_order_id,
            item_id,
            quantity,
            unit_cost,
            line_total
        ) VALUES (?, ?, ?, ?, ?)
    ");

    // Prepare statement for creating supplier payment entries
    $paymentStmt = $db->prepare("
        INSERT INTO supplier_payments (
            supplier_id,
            purchase_order_id,
            amount,
            payment_method,
            payment_date,
            expected_delivery,
            status,
            notes,
            created_at
        ) VALUES (?, ?, ?, 'bank_transfer', CURDATE(), ?, 'Scheduled', ?, NOW())
    ");

    foreach ($ordersBySupplier as $supplierId => $orderData) {
        $totalAmount = $orderData['total_amount'];

        $poStmt->execute([
            $supplierId,
            $totalAmount,
            $preferredDate,
            $notes,
        ]);

        $purchaseOrderId = (int)$db->lastInsertId();

        foreach ($orderData['items'] as $ci) {
            $itemStmt->execute([
                $purchaseOrderId,
                $ci['item_id'],
                $ci['quantity'],
                $ci['unit_cost'],
                $ci['line_total'],
            ]);
        }

        // Automatically create supplier payment entry for delivery tracking
        $paymentStmt->execute([
            $supplierId,
            $purchaseOrderId,
            $totalAmount,
            $preferredDate,
            $notes,
        ]);

        $supplierPaymentId = (int)$db->lastInsertId();

        $createdOrders[] = [
            'purchase_order_id' => $purchaseOrderId,
            'supplier_id' => $supplierId,
            'total_amount' => $totalAmount,
            'item_count' => count($orderData['items']),
            'supplier_payment_id' => $supplierPaymentId,
        ];
        
        // Log for debugging
        error_log("Created PO #{$purchaseOrderId} with Supplier Payment #{$supplierPaymentId} for Supplier #{$supplierId}");
    }

    $db->commit();

    Response::success(
        [
            'purchase_orders' => $createdOrders,
        ],
        'Purchase orders generated successfully'
    );
} catch (Exception $e) {
    if ($db->inTransaction()) {
        $db->rollBack();
    }
    Response::error('Database error: ' . $e->getMessage());
}
?>


