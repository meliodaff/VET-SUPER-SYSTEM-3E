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
//   supplier_payment_id: number,
//   items: [
//     { item_id: number, delivered_qty: number, unit_cost: number }
//   ]
// }

$supplierPaymentId = isset($data['supplier_payment_id']) ? (int)$data['supplier_payment_id'] : null;
$items = isset($data['items']) && is_array($data['items']) ? $data['items'] : [];

if (!$supplierPaymentId || empty($items)) {
    Response::error('supplier_payment_id and at least one delivered item are required');
}

try {
    $db->beginTransaction();

    // Validate supplier payment and ensure not already delivered
    $stmt = $db->prepare("SELECT id, status FROM supplier_payments WHERE id = ?");
    $stmt->execute([$supplierPaymentId]);
    $payment = $stmt->fetch();

    if (!$payment) {
        throw new Exception('Invalid supplier_payment_id');
    }

    if ($payment['status'] === 'Delivered') {
        throw new Exception('Payment already marked Delivered');
    }

    // Insert delivery items + update inventory
    $insItem = $db->prepare("
        INSERT INTO supplier_delivery_items (supplier_payment_id, item_id, delivered_qty, unit_cost)
        VALUES (?, ?, ?, ?)
    ");

    $updInv = $db->prepare("
        UPDATE inventory_items
        SET quantity = quantity + ?, unit_cost = ?
        WHERE id = ?
    ");

    $insTxn = $db->prepare("
        INSERT INTO inventory_transactions (item_id, change_qty, unit_cost, ref_type, ref_id)
        VALUES (?, ?, ?, 'Delivery', ?)
    ");

    foreach ($items as $item) {
        $itemId = isset($item['item_id']) ? (int)$item['item_id'] : 0;
        $qty = isset($item['delivered_qty']) ? (float)$item['delivered_qty'] : 0;
        $unitCost = isset($item['unit_cost']) ? (float)$item['unit_cost'] : 0;

        if ($itemId <= 0 || $qty <= 0) {
            continue;
        }

        $insItem->execute([$supplierPaymentId, $itemId, $qty, $unitCost]);
        $updInv->execute([$qty, $unitCost, $itemId]);
        $insTxn->execute([$itemId, $qty, $unitCost, $supplierPaymentId]);
    }

    // Mark supplier payment as Delivered and set delivered_at
    $updPay = $db->prepare("
        UPDATE supplier_payments
        SET status = 'Delivered', delivered_at = NOW()
        WHERE id = ?
    ");
    $updPay->execute([$supplierPaymentId]);

    $db->commit();

    Response::success(null, 'Delivery recorded and inventory updated');
} catch (Exception $e) {
    if ($db->inTransaction()) {
        $db->rollBack();
    }
    Response::error('Transaction failed: ' . $e->getMessage(), 500);
}
?>


