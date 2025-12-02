<?php
require_once '../../config/database.php';
require_once '../../utils/cors.php';
require_once '../../utils/response.php';

$database = new Database();
$db = $database->getConnection();

if (!$db) {
    Response::error('Database connection failed');
}

if ($_SERVER['REQUEST_METHOD'] !== 'PUT') {
    Response::error('Method not allowed', 405);
}

$data = json_decode(file_get_contents("php://input"), true);

// Expected payload:
// {
//   id: number, // supplier_payment id
//   status: 'Scheduled' | 'In Transit' | 'Delivered',
//   delivered_at: 'YYYY-MM-DD' // optional, defaults to today when status=Delivered
// }

if (!isset($data['id']) || !isset($data['status'])) {
    Response::error('Supplier payment id and status are required');
}

$id = (int)$data['id'];
$status = trim($data['status']);
$deliveredAt = isset($data['delivered_at']) ? $data['delivered_at'] : null;

$allowedStatuses = ['Scheduled', 'In Transit', 'Delivered'];
if (!in_array($status, $allowedStatuses, true)) {
    Response::error('Invalid status. Must be Scheduled, In Transit, or Delivered');
}

try {
    // Load existing payment
    $stmt = $db->prepare("
        SELECT id, expected_delivery, delivered_at, status
        FROM supplier_payments
        WHERE id = ?
    ");
    $stmt->execute([$id]);
    $payment = $stmt->fetch();

    if (!$payment) {
        Response::error('Supplier payment not found');
    }

    $updateFields = ['status = ?'];
    $params = [$status];

    // If marked as delivered, set delivered_at if not provided
    if ($status === 'Delivered') {
        if ($deliveredAt === null || $deliveredAt === '') {
            $updateFields[] = "delivered_at = CURDATE()";
        } else {
            $updateFields[] = "delivered_at = ?";
            $params[] = $deliveredAt;
        }
    }

    $params[] = $id;

    $sql = "UPDATE supplier_payments SET " . implode(', ', $updateFields) . " WHERE id = ?";
    $upd = $db->prepare($sql);
    $upd->execute($params);

    // Re-fetch to calculate on-time flag
    $stmt = $db->prepare("
        SELECT expected_delivery, delivered_at
        FROM supplier_payments
        WHERE id = ?
    ");
    $stmt->execute([$id]);
    $updated = $stmt->fetch();

    $expected = $updated['expected_delivery'];
    $actual = $updated['delivered_at'];
    $onTime = null;

    if ($status === 'Delivered' && $expected && $actual) {
        $onTime = (substr($expected, 0, 10) === substr($actual, 0, 10));
    }

    Response::success(
        [
            'id' => $id,
            'status' => $status,
            'expected_delivery' => $expected,
            'delivered_at' => $actual,
            'on_time' => $onTime,
        ],
        'Supplier delivery status updated'
    );
} catch (Exception $e) {
    Response::error('Database error: ' . $e->getMessage());
}
?>


