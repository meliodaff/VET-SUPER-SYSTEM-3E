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


  <!-- popup -->
  <?php include '../php/popup.php'; ?>




  <main class="appointments-section">
    <div class="title-row" style="display: flex; align-items: center; justify-content: space-between;">
      <h2 class="appointments-title">Services</h2>
      <a href="add_service_page.php" class="add-btn" 
         style="background-color: #1a237e; color: white; padding: 8px 16px; border-radius: 6px; text-decoration: none; font-weight: bold;">
         Add Service
      </a>
    </div>

    <div class="tabs">
      <a href="overview.php" class="tab">Overview</a>
      <a href="pending.php" class="tab ">Pending</a>
      <a href="approved.php" class="tab">Approved</a>
      <a href="reject.php" class="tab">Rejected</a>
      <a href="reschedule.php" class="tab">Reschedule</a>
      <a href="done.php" class="tab">Done</a>
      <a href="services.php" class="tab active">Services</a>
    </div>

    <!-- Services Table -->
    <div class="appointments-table">
      <div class="table-header">
        <div>Service Name</div>
        <div>Price</div>
        <div>Description</div>
        <div>Action</div>
      </div>

      <?php
      $query = "SELECT * FROM type_of_service ORDER BY id ASC";
      $result = $conn->query($query);

      if ($result->num_rows > 0) {
        while ($row = $result->fetch_assoc()) {
          echo '<div class="table-row">';
          echo '<div>' . htmlspecialchars($row['service_name']) . '</div>';
          echo '<div>₱' . number_format($row['price'], 2) . '</div>';
          echo '<div style="white-space: normal; word-wrap: break-word; overflow-wrap: break-word; max-width: 250px;">' . htmlspecialchars($row['description']) . '</div>';
          
          echo '<div class="status-cell">';
          // ✅ EDIT button (sends via POST)
          echo '<form action="edit_service_page.php" method="POST" style="display:inline-block;">';
          echo '<input type="hidden" name="id" value="' . htmlspecialchars($row['id']) . '">';
          echo '<button type="submit" name="action" value="edit" class="btn-approve">EDIT</button>';
          echo '</form>';

          // ✅ DELETE button
          echo '<form action="../php/delete_service_process.php" method="POST" class="delete-form" style="display:inline-block;">';
          echo '<input type="hidden" name="id" value="' . htmlspecialchars($row['id']) . '">';
          echo '<button type="button" class="btn-reject open-delete-confirmation" data-service="' . htmlspecialchars($row['service_name']) . '">DELETE</button>';
          echo '</form>';

          echo '</div></div>';
        }
      } else {
        echo '<h3 class="empty-title">No Services Found</h3>';
      }
      ?>
    </div>
  </main>

 <!-- footer -->
  <iframe src="../header_footer/footer/Footer.html" style="width:100%; height:523px; border:none;"></iframe>

      <!-- Confirmation Popup (reusable) -->
<?php include '../php/confirmation.php'; ?>

<script>
  // Delete confirmation logic
  document.querySelectorAll(".open-delete-confirmation").forEach(button => {
    button.addEventListener("click", function () {
      const form = this.closest("form");
      const serviceName = this.getAttribute("data-service");

      // Use your custom popup
      openConfirmation("delete", serviceName, function() {
        form.submit(); // Submit only after confirming
      });
    });
  });
</script>

   <script src="../script/index.js"></script>
</body>
</html>
