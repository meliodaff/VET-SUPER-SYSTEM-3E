<?php
include '../includes/session_id.php';
include '../includes/db.php';

// ✅ Check if ID is provided from POST
if (!isset($_POST['id'])) {
  echo "<script>alert('No service ID provided!'); window.location.href='services.php';</script>";
  exit;
}

$id = intval($_POST['id']); // Safe handling

// ✅ Fetch the service details
$query = "SELECT * FROM type_of_service WHERE id = ?";
$stmt = $conn->prepare($query);
$stmt->bind_param("i", $id);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows == 0) {
  echo "<script>alert('Service not found!'); window.location.href='services.php';</script>";
  exit;
}

$service = $result->fetch_assoc();
?>

<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Edit Service | Vet Appointment System</title>
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


  <!-- Main Section -->
  <main class="appointments-section">
    <br>
    <br>
    <br>
    <br>
  <div style="border: 1px solid black; padding: 50px; border-radius:30px;">
    <h2 class="appointments-title">Edit Service</h2>

    <form id="updateForm" action="../php/update_service_process.php" method="POST" class="add-service-form">
      <input type="hidden" name="id" value="<?php echo htmlspecialchars($service['id']); ?>">

      <div class="form-group">
        <label for="service_name">Service Name:</label>
        <input type="text" id="service_name" name="service_name" value="<?php echo htmlspecialchars($service['service_name']); ?>" required style="padding: 13px; font-size: 15px;">
      </div>

      <div class="form-group">
        <label for="price">Price (₱):</label>
        <input type="number" id="price" name="price" step="0.01" value="<?php echo htmlspecialchars($service['price']); ?>" required style="padding: 13px; font-size: 15px;">
      </div>

      <div class="form-group">
        <label for="description">Description:</label>
        <textarea id="description" name="description" rows="4" required style="padding: 20px; font-size: 15px;"><?php echo htmlspecialchars($service['description']); ?></textarea>
      </div>

      <button type="button" id="confirmUpdateBtn" class="btn-submit" style="padding: 15px; width: 250px; background-color: green; color: white; border:none; border-radius: 13px;">
        UPDATE SERVICE
      </button>
    </form>

    <button type="button" onclick="history.back()" class="btn-submit" style="padding: 15px; width: 250px; background-color: red; color: white; border:none; border-radius: 13px; margin-top: 13px;">
      CANCEL
    </button>
  </div>
</main>

 <!-- footer -->

<!-- Confirmation Popup (reusable) -->
<?php include '../php/confirmation.php'; ?>

<script>
  document.getElementById("confirmUpdateBtn").addEventListener("click", function() {
    openConfirmation("update", "this service", function() {
      document.getElementById("updateForm").submit(); // ✅ Now works
    });
  });
</script>

</body>
</html>
