
<?php
require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../utils/cors.php';
require_once __DIR__ . '/../utils/response.php';

cors();

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
  return json_response(['error' => 'Method not allowed'], 405);
}

$input = json_decode(file_get_contents('php://input'), true);
$supplier_payment_id = $input['supplier_payment_id'] ?? null;
// items: [{ item_id, delivered_qty, unit_cost }]
$items = $input['items'] ?? [];

if (!$supplier_payment_id || !is_array($items) || count($items) === 0) {
  return json_response(['error' => 'supplier_payment_id and items[] are required'], 422);
}

$conn->begin_transaction();

try {
  // validate payment exists & is not already delivered
  $stmt = $conn->prepare("SELECT status FROM supplier_payments WHERE id = ?");
  $stmt->bind_param('i', $supplier_payment_id);
  $stmt->execute();
  $res = $stmt->get_result();
  if ($res->num_rows === 0) {
    throw new Exception('Invalid supplier_payment_id');
  }
  $row = $res->fetch_assoc();
  if ($row['status'] === 'Delivered') {
    throw new Exception('Payment already marked Delivered');
  }
  $stmt->close();

  // process each item
  $insItemStmt = $conn->prepare("
    INSERT INTO supplier_delivery_items (supplier_payment_id, item_id, delivered_qty, unit_cost)
    VALUES (?, ?, ?, ?)
  ");
  $updInvStmt = $conn->prepare("
    UPDATE inventory_items SET quantity = quantity + ?, unit_cost = ?
    WHERE id = ?
  ");
  $txnStmt = $conn->prepare("
    INSERT INTO inventory_transactions (item_id, change_qty, unit_cost, ref_type, ref_id)
    VALUES (?, ?, ?, 'Delivery', ?)
  ");

  foreach ($items as $it) {
    $item_id = (int)$it['item_id'];
    $delivered_qty = (int)$it['delivered_qty'];
    $unit_cost = (float)$it['unit_cost'];

    if ($delivered_qty <= 0) { continue; }

    $insItemStmt->bind_param('iiid', $supplier_payment_id, $item_id, $delivered_qty, $unit_cost);
    if (!$insItemStmt->execute()) { throw new Exception($insItemStmt->error); }

    $updInvStmt->bind_param('idi', $delivered_qty, $unit_cost, $item_id);
    if (!$updInvStmt->execute()) { throw new Exception($updInvStmt->error); }

    $txnStmt->bind_param('iidi', $item_id, $delivered_qty, $unit_cost, $supplier_payment_id);
    if (!$txnStmt->execute()) { throw new Exception($txnStmt->error); }
  }

  // update payment status → Delivered
  $updPay = $conn->prepare("
    UPDATE supplier_payments SET status = 'Delivered', delivered_at = NOW()
    WHERE id = ?
  ");
  $updPay->bind_param('i', $supplier_payment_id);
  if (!$updPay->execute()) { throw new Exception($updPay->error); }
  $updPay->close();

  $conn->commit();

  return json_response(['message' => 'Delivery recorded, inventory updated'], 200);

} catch (Exception $e) {
  $conn->rollback();
  return json_response(['error' => 'Transaction failed', 'details' => $e->getMessage()], 500);
