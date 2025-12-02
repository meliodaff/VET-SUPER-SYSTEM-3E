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
//   purchase_order_id: number | null,
//   amount: number,
//   payment_method: string, // 'cash' | 'bank_transfer' | 'check' | ...
//   payment_date: 'YYYY-MM-DD', // optional, defaults to today
//   expected_delivery: 'YYYY-MM-DD', // preferred delivery date, optional
//   notes: string // optional
// }

$supplierId = isset($data['supplier_id']) ? (int)$data['supplier_id'] : null;
$purchaseOrderId = isset($data['purchase_order_id']) ? (int)$data['purchase_order_id'] : null;
$amount = isset($data['amount']) ? (float)$data['amount'] : null;
$paymentMethod = isset($data['payment_method']) ? trim($data['payment_method']) : null;
$paymentDate = !empty($data['payment_date']) ? $data['payment_date'] : null;
$expectedDelivery = !empty($data['expected_delivery']) ? $data['expected_delivery'] : null;
$notes = isset($data['notes']) ? trim($data['notes']) : null;

if (!$supplierId || !$amount || !$paymentMethod) {
    Response::error('supplier_id, amount and payment_method are required');
}

try {
    // Default payment_date to today if not provided
    if ($paymentDate === null || $paymentDate === '') {
        $paymentDateExpr = "CURDATE()";
        $usePaymentDateParam = false;
    } else {
        $paymentDateExpr = "?";
        $usePaymentDateParam = true;
    }

    $sql = "
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
        ) VALUES (
            ?, ?, ?, ?, $paymentDateExpr, ?, 'Scheduled', ?, NOW()
        )
    ";

    $params = [
        $supplierId,
        $purchaseOrderId ?: null,
        $amount,
        $paymentMethod,
    ];

    if ($usePaymentDateParam) {
        $params[] = $paymentDate;
    }

    $params[] = $expectedDelivery;
    $params[] = $notes;

    $stmt = $db->prepare($sql);
    $stmt->execute($params);

    $newId = (int)$db->lastInsertId();

    Response::success(
        [
            'supplier_payment_id' => $newId,
        ],
        'Supplier payment recorded'
    );
} catch (Exception $e) {
    Response::error('Database error: ' . $e->getMessage());
}
?>


