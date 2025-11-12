<?php
  require_once 'includes/session_id.php';
  require_once 'includes/db.php';

$appointment_id = $_GET['id'] ?? null;

if (!$appointment_id) {
  die("No appointment selected.");
}

// ✅ Fetch appointment info directly from book_appointment
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

// ✅ Format date/time
$formattedDate = date("F d, Y", strtotime($appointment['date']));
$formattedTime = date("h:i A", strtotime($appointment['time']));

// ✅ Fetch inclusion items (from recipt_items table)
$items_sql = "SELECT item_name, item_price FROM recipt_items WHERE appointment_id = ?";
$stmt_items = $conn->prepare($items_sql);
$stmt_items->bind_param("i", $appointment_id);
$stmt_items->execute();
$items_result = $stmt_items->get_result();
$items = $items_result->fetch_all(MYSQLI_ASSOC);
$stmt_items->close();

// ✅ Calculate total (service + items)
$total = floatval($appointment['service_price'] ?? 0);
foreach ($items as $item) {
  $total += floatval($item['item_price']);
}
?>

<!-- popup -->
<?php include 'php/popup.php'; ?>

<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Receipt</title>
  <link rel="stylesheet" href="/appointment/styles/Book_appointment_dashboard_receipt.css">
  <link rel="stylesheet" href="/appointment/styles/popup.css">
</head>
<body>
  <!-- header -->
  <?php include 'header_footer/Header/Header.php'; ?>

  <main>
    <div class="receipt-container">
      <h2>RECEIPT</h2>

      <div class="row">
        <span class="label">Schedule:</span>
        <span><?= htmlspecialchars($formattedDate) ?> — <?= htmlspecialchars($formattedTime) ?></span>
      </div>

      <div class="row">
        <span class="label">Veterinarian:</span>
        <span><?= htmlspecialchars($appointment['vetdoc'] ?? 'N/A') ?></span>
      </div>

      <div class="row">
        <span class="label">Service:</span>
        <span><?= htmlspecialchars($appointment['service'] ?? 'N/A') ?></span>
      </div>

      <div class="row">
        <span class="label">Service Price:</span>
        <span>₱<?= number_format($appointment['service_price'], 2) ?></span>
      </div>

      <div class="row">
        <span class="label">Pet:</span>
        <span><?= htmlspecialchars($appointment['pet_name'] ?? 'N/A') ?></span>
      </div>

      <div class="row">
        <span class="label">Status:</span>
        <span><?= htmlspecialchars($appointment['status'] ?? 'N/A') ?></span>
      </div>

      <div class="section">
        <h3 class="label">Inclusion</h3>

        <table>
          <tr>
            <th>Item</th>
            <th>Price</th>
          </tr>

          <?php if (!empty($items)): ?>
            <?php foreach ($items as $item): ?>
              <tr>
                <td><?= htmlspecialchars($item['item_name']) ?></td>
                <td>₱<?= number_format($item['item_price'], 2) ?></td>
              </tr>
            <?php endforeach; ?>
          <?php else: ?>
            <tr><td colspan="2" style="text-align:center;">No additional items</td></tr>
          <?php endif; ?>
        </table>

        <div class="row section">
          <span class="label">Total:</span>
          <span>₱<?= number_format($total, 2) ?></span>
        </div>
      </div>

      <button type="submit" style="
        width:100%; height:40px; border-radius: 15px; margin-top:20px;
        background-color: #002060; color: white; font-weight: bold; font-size:15px;"
        onclick="window.location.href='Book_appointment_dashboard.php'">
        OK
      </button>
    </div>
  </main>

  <!-- footer -->
  <iframe src="header_footer/footer/Footer.html" style="width:100%; height:523px; border:none;"></iframe>
</body>
</html>
