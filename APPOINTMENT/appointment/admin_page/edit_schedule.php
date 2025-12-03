<?php
include '../includes/session_id.php';
include '../includes/db.php';

// ✅ Check if ID is provided from POST
if (!isset($_POST['id'])) {
    echo "<script>alert('No schedule ID provided!'); window.location.href='schedule.php';</script>";
    exit;
}

$id = intval($_POST['id']); // Safe handling

// ✅ Fetch the schedule details
$query = "SELECT * FROM schedule WHERE id = ?";
$stmt = $conn->prepare($query);
$stmt->bind_param("i", $id);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows == 0) {
    echo "<script>alert('Schedule not found!'); window.location.href='schedule.php';</script>";
    exit;
}

$schedule = $result->fetch_assoc();
?>

<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Edit Schedule | Vet Appointment System</title>
  <link rel="stylesheet" href="../styles/index.css">
  <link rel="stylesheet" href="/appointment/styles/popup.css">
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

  <!-- Side Navigation -->
  <div class="side-nav">
      <a href="" class="nav-item">
        <img src="image/home.png" class="nav-icon" alt="Dashboard Icon">
        Dashboard
      </a>
      <a href="http://localhost:5173/employee-analytics" class="nav-item">
      <img src="image/community.png" class="nav-icon" alt="Dashboard Icon">  
        Employee Portal
      </a>
      <a href="http://localhost:5173/login" class="nav-logout">
        <img src="image/arrow-out-right-square-half.png" class="nav-icon" alt="Dashboard Icon">  
        Logout
      </a>
  </div>

  <!-- Main Section -->
  <main class="appointments-section">
    <br><br><br><br>
    <div style="border: 1px solid black; padding: 50px; border-radius:30px;">
      <h2 class="appointments-title">Edit Schedule</h2>

      <form id="updateForm" action="../php/edit_schedule_process.php" method="POST" class="add-service-form">
        <input type="hidden" name="id" value="<?php echo htmlspecialchars($schedule['id']); ?>">

        <div class="form-group">
          <label for="day_of_week">Day of the Week:</label>
          <input type="text" id="day_of_week" name="day_of_week" value="<?php echo htmlspecialchars($schedule['day_of_week']); ?>" required style="padding: 13px; font-size: 15px;">
        </div>

        <div class="form-group">
          <label for="start_time">Start Time:</label>
          <input type="time" id="start_time" name="start_time" value="<?php echo htmlspecialchars($schedule['start_time']); ?>" required style="padding: 13px; font-size: 15px;">
        </div>

        <div class="form-group">
          <label for="end_time">End Time:</label>
          <input type="time" id="end_time" name="end_time" value="<?php echo htmlspecialchars($schedule['end_time']); ?>" required style="padding: 13px; font-size: 15px;">
        </div>

        <button type="button" id="confirmUpdateBtn" class="btn-submit" style="padding: 15px; width: 250px; background-color: green; color: white; border:none; border-radius: 13px;">
          UPDATE SCHEDULE
        </button>
      </form>

      <button type="button" onclick="history.back()" class="btn-submit" style="padding: 15px; width: 250px; background-color: red; color: white; border:none; border-radius: 13px; margin-top: 13px;">
        CANCEL
      </button>
    </div>
  </main>

 <!-- footer -->
<?php include '../php/confirmation.php'; ?>

<script>
  document.getElementById("confirmUpdateBtn").addEventListener("click", function() {
    openConfirmation("update", "this schedule", function() {
      document.getElementById("updateForm").submit();
    });
  });
</script>

</body>
</html>
