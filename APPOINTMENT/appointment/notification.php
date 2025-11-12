<?php
  require_once 'includes/session_id.php';
  require_once 'includes/db.php';

$user_id = $_SESSION['user_id'];

// ✅ Fetch all notifications for the logged-in user
$sql = "SELECT pet_name, service, message, date_time FROM notifications WHERE user_id = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("i", $user_id);
$stmt->execute();
$result = $stmt->get_result();
?>

<!DOCTYPE html>
<html>
<head>
  <title>Notifications</title>
  <link rel="stylesheet" href="header_footer/Header/Header.css">
  <link rel="stylesheet" href="header_footer/footer/Footer.css">
  <link rel="stylesheet" href="styles/Book_appointment_dashboard.css">
  <link rel="stylesheet" href="/appointment/styles/popup.css">
  <link rel="stylesheet" href="/appointment/styles/tabs.css">
</head>
<body>
  <!-- header -->
  <?php include 'header_footer/Header/Header.php'; ?>

  <!-- popup -->
  <?php include 'php/popup.php'; ?>

  <!-- Main content -->
  <main>
    <div class="container">
      <div class="appointments-header">
        <h1>Notifications</h1>
      </div>

      <table class="appointments-table">
        <thead>
          <tr>
            <th>Pet Name</th>
            <th>Service</th>
            <th>Message</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          <?php if ($result->num_rows > 0): ?>
            <?php while ($row = $result->fetch_assoc()): ?>
              <tr>
                <td><strong><?= htmlspecialchars($row['pet_name']) ?></strong></td>
                <td><?= htmlspecialchars($row['service']) ?></td>
                <td><?= htmlspecialchars($row['message']) ?></td>
                <td><?= htmlspecialchars(date("m-d-Y h:i A", strtotime($row['date_time']))) ?></td>
              </tr>
            <?php endwhile; ?>
          <?php else: ?>
            <tr>
              <td colspan="4" style="text-align:center;">No notifications found.</td>
            </tr>
          <?php endif; ?>
        </tbody>        
      </table>
    </div>
  </main>

  <!-- Confirmation Popup (reusable) -->
  <?php include 'php/confirmation.php'; ?>

  <!-- footer -->
  <iframe src="header_footer/footer/Footer.html" style="width:100%; height:523px; border:none;"></iframe>
</body>
</html>

<?php
$stmt->close();
$conn->close();
?>
