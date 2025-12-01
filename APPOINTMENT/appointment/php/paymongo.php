<?php
require_once '../includes/session_id.php';
require_once '../includes/db.php';

$appointment_id = $_GET['id'] ?? null;
if (!$appointment_id) {
    die("No appointment selected.");
}

// Fetch appointment info
$sql = "SELECT pet_name, date, time, service, service_price, vetdoc, status 
        FROM book_appointment 
        WHERE id = ? AND user_id = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("ii", $appointment_id, $user_id);
$stmt->execute();
$result = $stmt->get_result();
$appointment = $result->fetch_assoc();
$stmt->close();

if (!$appointment) {
    die("Appointment not found.");
}

// Fetch inclusion items
$items_sql = "SELECT item_name, item_price FROM recipt_items WHERE appointment_id = ?";
$stmt_items = $conn->prepare($items_sql);
$stmt_items->bind_param("i", $appointment_id);
$stmt_items->execute();
$items_result = $stmt_items->get_result();
$items = $items_result->fetch_all(MYSQLI_ASSOC);
$stmt_items->close();

// Calculate total
$total = floatval($appointment['service_price'] ?? 0);
foreach ($items as $item) {
    $total += floatval($item['item_price']);
}

// Convert total to centavos
$total_centavos = intval($total * 100);

// Prepare line items for PayMongo
$line_items = [];

// Add main service
$line_items[] = [
    'name' => $appointment['service'],
    'amount' => intval($appointment['service_price'] * 100),
    'currency' => 'PHP',
    'quantity' => 1
];

// Add additional items
foreach ($items as $item) {
    $line_items[] = [
        'name' => $item['item_name'],
        'amount' => intval($item['item_price'] * 100),
        'currency' => 'PHP',
        'quantity' => 1
    ];
}

// PayMongo Checkout Session payload
$payload = [
    'data' => [
        'attributes' => [
            'mode' => 'payment',
            'payment_method_types' => [
                'card',        // Credit/Debit Card
                'gcash',       // GCash
                'grab_pay',    // GrabPay
                'paymaya',     // PayMaya
                'shopee_pay',  // ShopeePay
                'billease',    // BillEase
                'qrph',        // QR Ph (PH QR codes)
                'dob'          // Direct Online Banking (may vary)
            ],
            'line_items' => $line_items,
            'description' => "Payment for {$appointment['service']} ({$appointment['pet_name']})",
            'show_description' => true,
            'send_email_receipt' => false,
            'success_url' => 'http://localhost/VET-SUPER-SYSTEM-3E/APPOINTMENT/appointment/php/update_payment.php?id=' . $appointment_id,
            'cancel_url'  => 'http://localhost/VET-SUPER-SYSTEM-3E/APPOINTMENT/appointment/client_page/dashboard_approved.php'
        ]
    ]
];

// Initialize cURL
$curl = curl_init();
curl_setopt_array($curl, [
    CURLOPT_URL => "https://api.paymongo.com/v1/checkout_sessions",
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_CUSTOMREQUEST => "POST",
    CURLOPT_POSTFIELDS => json_encode($payload),
    CURLOPT_HTTPHEADER => [
        "Content-Type: application/json",
        "accept: application/json",
        "authorization: Basic " . base64_encode('sk_test_e1GCzKwDWM44m4Ub12wdBP6N' . ':')
    ],
]);

$response = curl_exec($curl);
$err = curl_error($curl);
curl_close($curl);

if ($err) {
    echo "cURL Error #:" . $err;
    exit;
}

// Decode response
$decoded = json_decode($response, true);

if (isset($decoded['data']['attributes']['checkout_url'])) {
    $checkout_url = $decoded['data']['attributes']['checkout_url'];
    // Redirect user automatically to GCash checkout
    header("Location: $checkout_url");
    exit;
} else {
    echo "Failed to create GCash checkout session:";
    echo "<pre>";
    print_r($decoded);
    echo "</pre>";
    exit;
}
?>
