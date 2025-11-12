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
  <link rel="stylesheet" href="../styles/index_Footer.css">
  <link rel="stylesheet" href="../styles/index_Header.css">
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
        <a href="#home">Home</a>
        <a href="#about">About</a>
        <a href="#services">Services</a>
        <a href="#contact">Contact</a>
        <h4 class="admin-btn">Admin</h4>
        <img src="../image/profile 1.png" alt="User" class="user-icon" />
      </nav>

      <!-- Logout Confirmation Popup -->
      <div id="logoutConfirmPopup" class="logout-confirm-popup">
        <p>Are you sure to logout?</p>
        <div class="confirm-actions">
          <button id="logoutYesBtn" class="yes-btn">Yes</button>
          <button id="logoutNoBtn" class="no-btn">No</button>
        </div>
      </div>

      <!-- Logout Popup -->
      <div id="logoutPopup" class="logout-popup">
        <button id="logoutBtn">Logout</button>
      </div>
    </div>
  </header>

  <main class="appointments-section">
    <h2 class="appointments-title">Overview</h2>

    <!-- Tabs -->
    <div class="tabs">
      <a href="overview.php" class="tab active" data-tab="overview">Overview</a>
      <a href="pending.php" class="tab" data-tab="pending">Pending</a>
      <a href="approved.php" class="tab" data-tab="approved">Approved</a>
      <a href="reject.php" class="tab" data-tab="rejected">Rejected</a>
      <a href="reschedule.php" class="tab" data-tab="reschedule">Reschedule</a>
      <a href="done.php" class="tab" data-tab="done">Done</a>
      <a href="services.php" class="tab">Services</a>
    </div>

    <!-- Tab Contents -->
<!-- Tab Contents -->
<div class="" id="overview">
  <!-- Appointment Table -->
  <div class="appointments-table">
    <div class="table-header">
      <div>Date/Time</div>
      <div>Pet Name</div>
      <div>Service</div>  
      <div>Status</div>
    </div>

    <?php
    // Fetch all appointments
    $query = "SELECT * FROM book_appointment ORDER BY date DESC, time ASC";
    $result = $conn->query($query);

    if ($result->num_rows > 0) {
        while ($row = $result->fetch_assoc()) {
            $formattedDate = date("m/d/y l", strtotime($row['date']));
            $formattedTime = date("g:i A", strtotime($row['time']));

            echo '<div class="table-row">';
            echo '  <div>';
            echo '    <strong>' . htmlspecialchars($formattedDate) . '</strong><br>' . htmlspecialchars($formattedTime);
            echo '  </div>';
            echo '  <div>' . htmlspecialchars($row['pet_name']) . '<br><span class="pet-type">' . '</span></div>';
            echo '  <div>' . htmlspecialchars($row['service']) . '</div>';
            echo '  <div class="status-cell">';
            echo '    <span class="status-label">' . htmlspecialchars(ucfirst($row['status'])) . '</span>';
            echo '  </div>';
            echo '</div>';
        }
    } else {
        echo '<h3 class="empty-title">No Appointments Found</h3>';
    }
    ?>
  </div>
</div>

  </main>

 <!-- footer -->
  <iframe src="../header_footer/footer/Footer.html" style="width:100%; height:523px; border:none;"></iframe>

  <script src="../script/index.js"></script>
</body>
</html>
