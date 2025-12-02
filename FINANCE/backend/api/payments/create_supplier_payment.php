
<?php
require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../utils/cors.php';
require_once __DIR__ . '/../utils/response.php';

cors();

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
  return json_response(['error' => 'Method not allowed'], 405);
}

$input = json_decode(file_get_contents('php://input'), true);
$supplier_id = $input['supplier_id'] ?? null;
$amount = $input['amount'] ?? null;
$payment_method = $input['payment_method'] ?? null; // 'cash' | 'bank_transfer' | ...
$expected_delivery = $input['expected_delivery'] ?? null; // 'YYYY-MM-DD'
$notes = $input['notes'] ?? null;

if (!$supplier_id || !$amount || !$payment_method) {
  return json_response(['error' => 'supplier_id, amount, and payment_method are required'], 422);
}

$stmt = $conn->prepare("
  INSERT INTO supplier_payments (supplier_id, amount, payment_method, expected_delivery, status, notes)
  VALUES (?, ?, ?, ?, 'Paid', ?)
");
$stmt->bind_param('idsss', $supplier_id, $amount, $payment_method, $expected_delivery, $notes);

if (!$stmt->execute()) {
  return json_response(['error' => 'DB insert failed', 'details' => $stmt->error], 500);
}

$new_id = $stmt->insert_id;
$stmt->close();

return json_response([
  'message' => 'Payment recorded',
  'supplier_payment_id' => $new_id
], 201);
