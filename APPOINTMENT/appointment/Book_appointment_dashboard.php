<?php
  require_once 'includes/session_id.php';
  require_once 'includes/db.php';

$user_id = $_SESSION['user_id'];

// ✅ Fetch appointments for the logged-in user (include id)
$sql = "SELECT id, pet_name, date, time, vetdoc, service, status 
        FROM book_appointment 
        WHERE user_id = ? 
        ORDER BY date_create DESC";
$stmt = $conn->prepare($sql);
$stmt->bind_param("i", $user_id);
$stmt->execute();
$result = $stmt->get_result();
?>

<!DOCTYPE html>
<html>
<head>
  <title>My Appointments</title>
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
        <h1>My Appointments</h1>
        <button class="new-appointment" 
          onclick="window.location.href='/appointment/Book_appointment_book.php'">
          Book Another Appointment
        </button>
      </div>

       <!-- Tabs -->
    <div class="tabs">
      <a href="Book_appointment_dashboard.php" class="tab active" data-tab="overview">Overview</a>
      <a href="dashboard_pending.php" class="tab" data-tab="pending">Pending</a>
      <a href="dashboard_approved.php" class="tab" data-tab="approved">Approved</a>
      <a href="dashboard_rejected.php" class="tab" data-tab="rejected">Rejected</a>
      <a href="dashboard_reschedule.php" class="tab" data-tab="reschedule">Reschedule</a>
      <a href="dashboard_done.php" class="tab" data-tab="done">Done</a>
    </div>

      <table class="appointments-table">
        <thead>
          <tr>
            <th>Pet</th>
            <th>Date</th>
            <th>Time</th>
            <th>Veterinarian</th>
            <th>Service</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          <?php if ($result->num_rows > 0): ?>
            <?php while ($row = $result->fetch_assoc()): ?>
              <tr>
                <td><strong><?= htmlspecialchars($row['pet_name']) ?></strong></td>
                <td><?= htmlspecialchars(date("m-d-Y", strtotime($row['date']))) ?></td>
                <td><?= htmlspecialchars(date("h:i A", strtotime($row['time']))) ?></td>
                <td><?= htmlspecialchars($row['vetdoc']) ?></td>
                <td><?= htmlspecialchars($row['service']) ?></td>
                <td>
                  <span class="status <?= strtolower(str_replace(' ', '-', $row['status'])) ?>">
                    <?= htmlspecialchars($row['status']) ?>
                  </span>
                </td>
                <td>
                  <!-- Pass appointment ID to edit and delete -->
                  <a href="Book_appointment_dashboard_edit.php?id=<?= $row['id'] ?>">Edit</a><br>
                  <a href="php/cancel_book.php?id=<?= $row['id'] ?>"
                     class="open-confirmation"
                     data-action="Cancel">
                     Cancel
                  </a>
                  <br>
                  <?php if (strtolower($row['status']) === 'approved'): ?>
                    <a href="Book_appointment_dashboard_receipt.php?id=<?= $row['id'] ?>">View Receipt</a>
                  <?php endif; ?>
                </td>
              </tr>
            <?php endwhile; ?>
          <?php else: ?>
            <tr>
              <td colspan="7" style="text-align:center;">No appointments found.</td>
            </tr>
          <?php endif; ?>
        </tbody>
      </table>
    </div>
  </main>

    <!-- Confirmation Popup (reusable) -->
  <?php include 'php/confirmation.php'; ?>


  <script>
  document.querySelectorAll(".open-confirmation").forEach(link => {
    link.addEventListener("click", function(e) {
      e.preventDefault();
      const action = this.getAttribute("data-action");
      const url = this.getAttribute("href");

      // Open popup and redirect when confirmed
      openConfirmation(action, "this appointment", () => {
        window.location.href = url; // ✅ redirect to cancel_book.php
      });
    });
  });
</script>



  <!-- footer -->
  <iframe src="header_footer/footer/Footer.html" style="width:100%; height:523px; border:none;"></iframe>
</body>
</html>

<?php
$stmt->close();
$conn->close();
?>
