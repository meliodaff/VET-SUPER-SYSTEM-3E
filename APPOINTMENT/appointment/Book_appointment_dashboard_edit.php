<?php
  require_once 'includes/session_id.php';
  require_once 'includes/db.php';

// ✅ Check if appointment ID is provided
if (!isset($_GET['id'])) {
    header("Location: Book_appointment_dashboard.php");
    exit;
}

$appointment_id = (int)$_GET['id'];
$user_id = $_SESSION['user_id'];

// ✅ Fetch appointment details for that user and appointment
$sql = "SELECT * FROM book_appointment WHERE id = ? AND user_id = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("ii", $appointment_id, $user_id);
$stmt->execute();
$result = $stmt->get_result();
$appointment = $result->fetch_assoc();

// If no record found → redirect back
if (!$appointment) {
    header("Location: Book_appointment_dashboard.php");
    exit;
}

// ✅ Fetch all vets from the database
$vets = $conn->query("SELECT DISTINCT vetdoc FROM book_appointment");

// ✅ Fetch available services
$services = $conn->query("SELECT service_name FROM type_of_service");

// ✅ Fetch user's pets
$pets = $conn->query("SELECT pet_name FROM mypet WHERE user_id = $user_id");
?>

<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Edit Appointment</title>
  <link rel="stylesheet" href="styles/Book_appointment_dashboard_edit.css">
  <link rel="stylesheet" href="/appointment/styles/popup.css">
</head>
<body>
  <!-- header -->
  <?php include 'header_footer/Header/Header.php'; ?>

  <main>
    <div class="container">
      <h1>Edit Appointment Details</h1>
      <p class="subtitle">Update any detail for your scheduled appointment below.</p>

      <form class="reschedule-form" action="php/update_appointment.php" method="POST">
        <!-- Hidden ID -->
        <input type="hidden" name="id" value="<?= htmlspecialchars($appointment['id']) ?>">

        <!-- Pet Name -->
        <div class="form-row">
          <label for="petName">Pet Name</label>
          <select id="petName" name="pet_name" required>
            <option value="" disabled selected hidden>Select Pet</option>
            <?php while ($pet = $pets->fetch_assoc()): ?>
              <option value="<?= htmlspecialchars($pet['pet_name']) ?>" 
                <?= $pet['pet_name'] === $appointment['pet_name'] ? 'selected' : '' ?>>
                <?= htmlspecialchars($pet['pet_name']) ?>
              </option>
            <?php endwhile; ?>
          </select>
        </div>

        <!-- Veterinarian -->
        <div class="form-row">
          <label for="veterinarian">Veterinarian</label>
         <select id="veterinarian" name="vetdoc" required>
          <option value="">Select Veterinarian</option>

          <option value="Dr. Smith" <?= $appointment['vetdoc'] === 'Dr. Smith' ? 'selected' : '' ?>>Dr. Smith</option>
          <option value="Dr. Johnson" <?= $appointment['vetdoc'] === 'Dr. Johnson' ? 'selected' : '' ?>>Dr. Johnson</option>
        </select>
        </div>

        <!-- Service -->
        <div class="form-row">
          <label for="service">Service Type</label>
          <select id="service" name="service" required>
            <option value="" disabled selected hidden>Select Service</option>
            <?php while ($srv = $services->fetch_assoc()): ?>
              <option value="<?= htmlspecialchars($srv['service_name']) ?>" 
                <?= $srv['service_name'] === $appointment['service'] ? 'selected' : '' ?>>
                <?= htmlspecialchars($srv['service_name']) ?>
              </option>
            <?php endwhile; ?>
          </select>
        </div>

        <!-- Date & Time -->
        <div class="form-row two-columns">
          <div>
            <label for="newDate">Preferred Date</label>
            <input type="date" id="newDate" name="new_date" value="<?= htmlspecialchars($appointment['date']) ?>" required>
          </div>
          <div>
            <label for="newTime">Preferred Time</label>
           <input type="time" id="newTime" name="new_time"
          value="<?= htmlspecialchars(date('H:i', strtotime($appointment['time']))) ?>" required>
          </div>
        </div>

        <!-- Buttons -->
       <button type="submit"
        class="save-btn open-confirmation"
        data-action="save changes"
        data-name="this appointment">
            Save Changes
        </button>
      </form>
        <!-- Buttons back-->
       <button type="submit" style="width:100%; height:40px; border-radius: 15px; margin-top:10px;
        background-color: #002060; color: white; font-weight: bold; font-size:15px;
       " onclick="history.back()">
            Cancel
        </button>
    </div>
  </main>



  <!-- Confirmation Popup (reusable) -->
  <?php include 'php/confirmation.php'; ?>

  <!-- Script -->
    <script>
      document.querySelectorAll(".open-confirmation").forEach(btn => {
        btn.addEventListener("click", function(e) {
          e.preventDefault();
          const action = this.getAttribute("data-action");
          const name = this.getAttribute("data-name");
          const form = this.closest("form"); // Find the nearest form element

          // Open confirmation popup and submit form after confirm
          openConfirmation(action, name, () => {
            form.submit(); // ✅ Submits to php/update_appointment.php
          });
        });
      });
    </script>



  <!-- footer -->
  <iframe src="header_footer/footer/Footer.html" style="width:100%; height:523px; border:none;"></iframe>
</body>
</html>
