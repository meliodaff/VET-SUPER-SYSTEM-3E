<?php
include '../includes/db.php';
session_start();

// ✅ Step 1: Get or store appointment ID (accept both POST and GET)
$appointment_id = isset($_POST['id']) ? intval($_POST['id'])
    : (isset($_GET['id']) ? intval($_GET['id']) : 0);

if ($appointment_id > 0) {
    $_SESSION['appointment_id'] = $appointment_id;
} elseif (isset($_SESSION['appointment_id'])) {
    $appointment_id = $_SESSION['appointment_id'];
}

// ✅ Step 2: Fetch appointment info
$appointment = null;
if ($appointment_id > 0) {
    $query = "SELECT date, time, service, service_price FROM book_appointment WHERE id = ?";
    $stmt = $conn->prepare($query);
    $stmt->bind_param("i", $appointment_id);
    $stmt->execute();
    $result = $stmt->get_result();
    if ($result->num_rows > 0) {
        $appointment = $result->fetch_assoc();
    }
    $stmt->close();
}

// ✅ Step 3: Format date/time
if ($appointment) {
    $formattedDate = date("F d, Y (l)", strtotime($appointment['date']));
    $formattedTime = date("g:i A", strtotime($appointment['time']));
} else {
    $formattedDate = "N/A";
    $formattedTime = "N/A";
}

// ✅ Step 4: Initialize session items
if (!isset($_SESSION['items'])) {
    $_SESSION['items'] = [];
}

// ✅ Step 5: Add item
if (isset($_POST['add_item'])) {
    $item_name = trim($_POST['item_name']);
    $item_price = floatval($_POST['item_price']);
    if (!empty($item_name) && $item_price > 0) {
        $_SESSION['items'][] = [
            'name' => $item_name,
            'price' => $item_price
        ];
    }
}

// ✅ Step 6: Delete item
if (isset($_POST['delete_item'])) {
    $index = intval($_POST['delete_item']);
    if (isset($_SESSION['items'][$index])) {
        unset($_SESSION['items'][$index]);
        $_SESSION['items'] = array_values($_SESSION['items']); // reindex
    }
}

// ✅ Step 7: Compute total
$total = floatval($appointment['service_price'] ?? 0);
foreach ($_SESSION['items'] as $item) {
    $total += $item['price'];
}
?>

<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Receipt</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      background-color: #f8faff;
      display: flex;
      justify-content: center;
      align-items: center;
      height: 100vh;
    }
    .receipt-container {
      background: white;
      width: 450px;
      border: 2px solid #0b2c75;
      border-radius: 10px;
      padding: 20px;
      box-shadow: 0 0 10px rgba(0,0,0,0.1);
    }
    h2 {
      text-align: center;
      color: #0b2c75;
      margin-bottom: 15px;
    }
    .row {
      display: flex;
      justify-content: space-between;
      margin-bottom: 10px;
    }
    .section {
      border-top: 1px solid #ccc;
      padding-top: 10px;
      margin-top: 10px;
    }
    .label {
      font-weight: bold;
      color: #0b2c75;
    }
    input[type="text"], input[type="number"] {
      padding: 5px;
      border: 1px solid #ccc;
      border-radius: 5px;
    }
    input[name="item_name"] { width: 45%; }
    input[name="item_price"] { width: 30%; }
    .add-btn {
      background: #0b2c75;
      color: white;
      border: none;
      border-radius: 5px;
      padding: 6px 10px;
      font-size: 14px;
      cursor: pointer;
    }
    .add-btn:hover { background: #0d3fa5; }
    table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 10px;
    }
    th, td {
      text-align: left;
      padding: 5px 0;
      color: #0b2c75;
    }
    th { border-bottom: 1px solid #ccc; }
    .delete-btn {
      background: #e74c3c;
      color: white;
      border: none;
      padding: 4px 8px;
      border-radius: 5px;
      cursor: pointer;
      font-size: 13px;
    }
    .delete-btn:hover { background: #c0392b; }
    .approve-btn {
      background: #0b2c75;
      color: white;
      border: none;
      width: 100%;
      padding: 10px;
      border-radius: 8px;
      font-size: 16px;
      margin-top: 20px;
      cursor: pointer;
    }
    .approve-btn:hover { background: #0d3fa5; }
  </style>
</head>
<body>

  <div class="receipt-container">
    <h2>RECEIPT</h2>

    <div class="row">
      <span class="label">Schedule:</span>
      <span><?= htmlspecialchars($formattedDate) ?> — <?= htmlspecialchars($formattedTime) ?></span>
    </div>

    <div class="row">
      <span class="label">Service:</span>
      <span><?= htmlspecialchars($appointment['service'] ?? 'N/A') ?></span>
    </div>

    <div class="row">
      <span class="label">Service Price:</span>
      <span>
        <?= isset($appointment['service_price'])
            ? '₱' . number_format((float)$appointment['service_price'], 2)
            : 'N/A' ?>
      </span>
    </div>

    <div class="section">
      <h3 class="label">Inclusion</h3>

      <!-- ✅ Add Item Form -->
      <form method="POST">
        <input type="hidden" name="id" value="<?= htmlspecialchars($appointment_id) ?>">
        <div class="row">
          <input type="text" name="item_name" placeholder="Item Name" required>
          <input type="number" name="item_price" placeholder="Price" required>
          <button type="submit" name="add_item" class="add-btn">Add</button>
        </div>
      </form>

      <!-- ✅ Display Items -->
      <table>
        <tr><th>Item</th><th>Price</th><th>Action</th></tr>
        <?php if (!empty($_SESSION['items'])): ?>
          <?php foreach ($_SESSION['items'] as $index => $item): ?>
            <tr>
              <td><?= htmlspecialchars($item['name']) ?></td>
              <td>₱<?= number_format($item['price'], 2) ?></td>
              <td>
                <form method="POST" style="display:inline;">
                  <input type="hidden" name="id" value="<?= htmlspecialchars($appointment_id) ?>">
                  <button type="submit" name="delete_item" value="<?= $index ?>" class="delete-btn">Delete</button>
                </form>
              </td>
            </tr>
          <?php endforeach; ?>
        <?php else: ?>
          <tr><td colspan="3" style="text-align:center;">No items yet</td></tr>
        <?php endif; ?>
      </table>

      <div class="row section">
        <span class="label">Total</span>
        <span>₱<?= number_format($total, 2) ?></span>
      </div>

      <!-- ✅ Approve / Cancel -->
      <form method="POST" action="../php/process_receipt.php">
        <input type="hidden" name="id" value="<?= htmlspecialchars($appointment_id) ?>">
        <button type="submit" name="approve" class="approve-btn">APPROVE</button>
      </form>

      <button type="button" class="approve-btn" style="background:#999;" onclick="history.back()">
        CANCEL
      </button>
    </div>
  </div>
</body>
</html>
