<?php
include '../includes/session_id.php';
include '../includes/db.php';
?>

<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Vet Appointment System</title>
  <link rel="stylesheet" href="../styles/index.css">
  <link rel="stylesheet" href="/appointment/styles/popup.css">
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


  <!-- popup -->
  <?php include '../php/popup.php'; ?>

    <div class="side-nav">
      <a href="" class="nav-item">
        <img src="image/home.png" class="nav-icon" alt="Dashboard Icon">
        Dashboard
      </a>
      <a href="http://localhost:5173/employee-analytics" class="nav-item">
      <img src="image/community.png" class="nav-icon" alt="Dashboard Icon">  
        Employee Portal
      </a>

      <!-- Logout at bottom using padding trick -->
      <a href="http://localhost:5173/login" class="nav-logout">
      <img src="image/arrow-out-right-square-half.png" class="nav-icon" alt="Dashboard Icon">  
        Logout
      </a>
  </div>

  <main class="appointments-section">
    <div class="title-row" style="display: flex; align-items: center; justify-content: space-between;">
      <h2 class="appointments-title">Services</h2>
      <a href="add_schedule.php" class="add-btn" 
         style="background-color: #1a237e; color: white; padding: 8px 16px; border-radius: 6px; text-decoration: none; font-weight: bold;">
         Add Scedule
      </a>
    </div>

    <div class="tabs">
      <a href="overview.php" class="tab">Overview</a>
      <a href="pending.php" class="tab ">Pending</a>
      <a href="approved.php" class="tab">Approved</a>
      <a href="reject.php" class="tab">Rejected</a>
      <a href="reschedule.php" class="tab">Reschedule</a>
      <a href="cancelled.php" class="tab" data-tab="cancelled">cancelled</a>
      <a href="done.php" class="tab">Done</a>
      <a href="services.php" class="tab">Services</a>
    </div>

    <!-- Services Table -->
    <div class="appointments-table">
      <div class="table-header">
        <div>Day of Week</div>
        <div>Starting Time</div>
        <div>End Time</div>
        <div>Action</div>
      </div>

       <?php
  $query = "SELECT * FROM schedule ORDER BY id ASC";
  $result = $conn->query($query);

    if ($result->num_rows > 0) {
        while ($row = $result->fetch_assoc()) {
          echo '<div class="table-row">';
          echo '<div>' . htmlspecialchars($row['day_of_week']) . '</div>';
          echo '<div>' . htmlspecialchars(date("h:i A", strtotime($row['start_time']))) . '</div>';
          echo '<div>' . htmlspecialchars(date("h:i A", strtotime($row['end_time']))) . '</div>';
          
          echo '<div class="status-cell">';
          // EDIT button
          echo '<form action="edit_schedule.php" method="POST" style="display:inline-block;">';
          echo '<input type="hidden" name="id" value="' . htmlspecialchars($row['id']) . '">';
          echo '<button type="submit" name="action" value="edit" class="btn-approve">EDIT</button>';
          echo '</form>';

          // DELETE button
          echo '<form action="../php/delete_schedule_process.php" method="POST" class="delete-form" style="display:inline-block;">';
          echo '<input type="hidden" name="id" value="' . htmlspecialchars($row['id']) . '">';
          echo '<button type="button" class="btn-reject open-delete-confirmation" data-schedule="' . htmlspecialchars($row['day_of_week'] . " " . $row['start_time'] . "-" . $row['end_time']) . '">DELETE</button>';
          echo '</form>';

          echo '</div></div>';
      }
      } else {
          echo '<h3 class="empty-title">No Schedule Found</h3>';
      }
      ?>
    </div>
  </main>
  
      <!-- Confirmation Popup (reusable) -->
<?php include '../php/confirmation.php'; ?>

<script>
  // Delete confirmation logic for schedules
  document.querySelectorAll(".open-delete-confirmation").forEach(button => {
    button.addEventListener("click", function () {
      const form = this.closest("form");
      const scheduleName = this.getAttribute("data-schedule"); // changed from data-service to data-schedule

      // Use your custom popup
      openConfirmation("delete", scheduleName, function() {
        form.submit(); // Submit only after confirming
      });
    });
  });
</script>

   <script src="../script/index.js"></script>
</body>
</html>
