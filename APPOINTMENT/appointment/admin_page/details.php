<?php
include '../includes/session_id.php';
include '../includes/db.php';

if (!isset($_GET['id'])) {
  die("Invalid appointment ID");
}

$appointment_id = intval($_GET['id']);

// Fetch appointment info
$appt_query = $conn->prepare("SELECT * FROM book_appointment WHERE id = ?");
$appt_query->bind_param("i", $appointment_id);
$appt_query->execute();
$appointment = $appt_query->get_result()->fetch_assoc();

if (!$appointment) {
  die("Appointment not found");
}

// Fetch user info
$user_query = $conn->prepare("SELECT * FROM registered WHERE user_id = ?");
$user_query->bind_param("i", $appointment['user_id']);
$user_query->execute();
$user = $user_query->get_result()->fetch_assoc();

// Fetch service price
$service_query = $conn->prepare("SELECT price FROM type_of_service WHERE service_name = ?");
$service_query->bind_param("s", $appointment['service']);
$service_query->execute();
$service_result = $service_query->get_result();
$service = $service_result->fetch_assoc();
$service_price = $service ? (float)$service['price'] : 0;

// Fetch receipt items
$items_query = $conn->prepare("SELECT item_name, item_price FROM recipt_items WHERE appointment_id = ?");
$items_query->bind_param("i", $appointment['id']);
$items_query->execute();
$items_result = $items_query->get_result();

$total_items_price = 0;
$receipt_items = [];
while ($item = $items_result->fetch_assoc()) {
  $receipt_items[] = $item;
  $total_items_price += (float)$item['item_price'];
}

// Calculate total
$grand_total = $service_price + $total_items_price;
?>
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Appointment Details</title>
  <link rel="stylesheet" href="../styles/index.css">
  <link rel="stylesheet" href="../styles/admin_details.css">
  <link rel="stylesheet" href="../styles/index_Footer.css">
  <link rel="stylesheet" href="../styles/index_Header.css">

  
    <link rel="stylesheet" href="../../../MARKETING/css/generalfooter.css">
</head>
<body>

  <!-- Header Section -->
  <header class="header">
    <div class="header-left">
      <div class="logo-wrapper">
        <img src="../image/logo.png" alt="Logo" class="logo-header" />
      </div>
      <h1 class="brand-name">FUR-EVER CARE</h1>
    </div>
    <div class="header-right">
      <nav class="nav-links">
        <img src="../image/profile 1.png" alt="User" class="user-icon" />
      </nav>
    </div>
  </header>


  <br>
  <br>
<main class="details-container">
  <h2>Details</h2>

  <div class="details-box">
<div class="section">
  <h3>Book Information</h3>

  <!-- User Info Section -->
  <div class="field"><label>Client Name: </label><span><?= htmlspecialchars($appointment['fname']) ?></span></div>
  <div class="field"><label>Phone Number: </label><span><?= htmlspecialchars($appointment['phone']) ?></span></div>
  <div class="field"><label>Email Address: </label><span><?= htmlspecialchars($appointment['email']) ?></span></div>

  <!-- Appointment Info Section -->
  <div class="field"><label>Pet Name: </label><span><?= htmlspecialchars($appointment['pet_name']) ?></span></div>

  <div class="field">
    <label>Service:</label>
    <span><?= htmlspecialchars($appointment['service']) ?> - ₱<?= number_format($service_price, 2) ?></span>
  </div>

  <div class="field">
    <label>Receipt Items:</label>
    <?php if (count($receipt_items) > 0): ?>
      <ul>
        <?php foreach ($receipt_items as $item): ?>
          <li><?= htmlspecialchars($item['item_name']) ?> - ₱<?= number_format($item['item_price'], 2) ?></li>
        <?php endforeach; ?>
      </ul>
    <?php else: ?>
      <span>No items found.</span>
    <?php endif; ?>
  </div>

  <div class="field"><label>Vet Doctor: </label><span><?= htmlspecialchars($appointment['vetdoc']) ?></span></div>
  <div class="field"><label>Date: </label><span><?= htmlspecialchars($appointment['date']) ?></span></div>
  <div class="field"><label>Time: </label><span><?= htmlspecialchars($appointment['time']) ?></span></div>
  <div class="field"><label>Payment Method: </label><span><?= htmlspecialchars($appointment['payment_method']) ?></span></div>
  <div class="field"><label>Payment Status: </label><span><?= htmlspecialchars($appointment['payment_status']) ?></span></div>

  <div class="field">
    <label>Total (Service + Items):</label>
    <span>₱<?= number_format($grand_total, 2) ?></span>
  </div>
</div>
  </div>

  <div style="display:flex; gap: 10px; ">
    <?php if ($appointment['payment_status'] === 'Unpaid'): ?>
      <button onclick="window.location.href='../php/update_payment_onsite_admin.php?id=<?= $appointment['id'] ?>'" class="back-btn">
          Paid
      </button>
    <?php endif; ?>
    <button onclick="window.history.back()" class="back-btn">Back</button>
  </div>

</main>
  <br>
  <br>
 <!-- footer -->

<script src="../script/index.js"></script>
</body>
</html>
