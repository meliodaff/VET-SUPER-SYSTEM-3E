<?php
require_once '../includes/session_id.php';
require_once '../includes/db.php';

// --------------------------
// Function to clean currency
// --------------------------
function cleanAmount($amount) {
    return floatval(str_replace(['₱', ',', ' '], '', $amount));
}

// --------------------------
// Function to show error and redirect back
// --------------------------
function redirectBackWithError($message) {
    echo "<!DOCTYPE html>
    <html>
    <head>
        <meta charset='UTF-8'>
        <title>Error</title>
    </head>
    <body>
        <h3 style='color:red;'>⚠ ERROR: $message</h3>
        <p>Redirecting back in 5 seconds...</p>
        <script>
            setTimeout(function(){
                window.history.back();
            }, 5000); // 5 seconds
        </script>
    </body>
    </html>";
    exit();
}

// --------------------------
// Get appointment ID
// --------------------------
$appointment_id = $_GET['id'] ?? null;
if (!$appointment_id) {
    redirectBackWithError("No appointment selected.");
}

// --------------------------
// Fetch appointment info
// --------------------------
$sql = "SELECT pet_name, date, time, service, service_price, vetdoc, status 
        FROM book_appointment 
        WHERE id = ? AND user_id = ?";
$stmt = $conn->prepare($sql);
if (!$stmt) redirectBackWithError("Failed to prepare appointment query.");
$stmt->bind_param("ii", $appointment_id, $user_id);
$stmt->execute();
$result = $stmt->get_result();
$appointment = $result->fetch_assoc();
$stmt->close();

if (!$appointment) {
    redirectBackWithError("Appointment not found.");
}

// --------------------------
// Fetch inclusion items
// --------------------------
$items_sql = "SELECT item_name, item_price FROM recipt_items WHERE appointment_id = ?";
$stmt_items = $conn->prepare($items_sql);
if (!$stmt_items) redirectBackWithError("Failed to prepare items query.");
$stmt_items->bind_param("i", $appointment_id);
$stmt_items->execute();
$items_result = $stmt_items->get_result();
$items = $items_result->fetch_all(MYSQLI_ASSOC);
$stmt_items->close();

// --------------------------
// Calculate total amount
// --------------------------
$total = cleanAmount($appointment['service_price']);
foreach ($items as $item) {
    $total += cleanAmount($item['item_price']);
}

// Check PayMongo max allowed (₱9,999,999.99)
if ($total > 9999999.99) {
    redirectBackWithError("PayMongo maximum amount is ₱9,999,999.99. Your total: ₱" . number_format($total, 2) . ". Please choose Onsite Payment instead.");
}

// Convert to centavos
$total_centavos = intval($total * 100);

// --------------------------
// Prepare line items
// --------------------------
$line_items = [];

// Main service
$line_items[] = [
    'name' => $appointment['service'],
    'amount' => intval(cleanAmount($appointment['service_price']) * 100),
    'currency' => 'PHP',
    'quantity' => 1
];

// Additional items
foreach ($items as $item) {
    $line_items[] = [
        'name' => $item['item_name'],
        'amount' => intval(cleanAmount($item['item_price']) * 100),
        'currency' => 'PHP',
        'quantity' => 1
    ];
}

// --------------------------
// PayMongo payload
// --------------------------
$payload = [
    'data' => [
        'attributes' => [
            'mode' => 'payment',
            'amount' => $total_centavos,
            'currency' => 'PHP',
            'payment_method_types' => [
                'gcash',
                'card',
                'grab_pay',
                'paymaya',
                'billease',
                'shopee_pay',
                'qrph'
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

// --------------------------
// Create Checkout Session
// --------------------------
$curl = curl_init();
curl_setopt_array($curl, [
    CURLOPT_URL => "https://api.paymongo.com/v1/checkout_sessions",
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_CUSTOMREQUEST => "POST",
    CURLOPT_POSTFIELDS => json_encode($payload),
    CURLOPT_HTTPHEADER => [
        "Content-Type: application/json",
        "Accept: application/json",
        "Authorization: Basic " . base64_encode('sk_test_e1GCzKwDWM44m4Ub12wdBP6N:')
    ],
]);

$response = curl_exec($curl);
$err = curl_error($curl);
curl_close($curl);

if ($err) {
    redirectBackWithError("cURL Error: " . $err);
}

// --------------------------
// Handle API Response
// --------------------------
$decoded = json_decode($response, true);

if (isset($decoded['data']['attributes']['checkout_url'])) {
    header("Location: " . $decoded['data']['attributes']['checkout_url']);
    exit;
} else {
    redirectBackWithError("Failed to create PayMongo checkout session. Response: " . json_encode($decoded));
}
?>
