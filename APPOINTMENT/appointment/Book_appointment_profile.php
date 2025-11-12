<?php
  require_once 'includes/session_id.php';
  require_once 'includes/db.php';

  // Get current logged-in user ID from session
  $user_id = $_SESSION['user_id'];

  // Prepare query to fetch user details
  $query = "SELECT * FROM registered WHERE user_id = ?";
  $stmt = $conn->prepare($query);
  $stmt->bind_param("i", $user_id); // "i" means integer
  $stmt->execute();
  $result = $stmt->get_result();
  $user = $result->fetch_assoc();
?>
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Update Details</title>
  <link rel="stylesheet" href="styles/profile.css">
  <link rel="stylesheet" href="/appointment/styles/popup.css">
</head>
<body>
  

  <!-- Header -->
  <?php include 'header_footer/Header/Header.php'; ?>

  <!-- popup -->
  <?php include 'php/popup.php'; ?>

  <main>
    <section class="form-section">
      <h2>Update Details</h2>

      <form class="details-form" method="POST" action="php/update_profile.php">
        <div class="form-group">
          <label>Full Name</label>
          <input type="text" name="fname" value="<?= htmlspecialchars($user['fname']) ?>">
        </div>

        <div class="form-group">
          <label>Street Address</label>
          <input type="text" name="street_address" value="<?= htmlspecialchars($user['street_address']) ?>">
        </div>

        <div class="form-group">
          <label>Last Name</label>
          <input type="text" name="lname" value="<?= htmlspecialchars($user['lname']) ?>">
        </div>

        <div class="form-group">
          <label>City</label>
          <input type="text" name="city" value="<?= htmlspecialchars($user['city']) ?>">
        </div>

        <div class="form-group">
          <label>Phone Number</label>
          <input type="text" name="phone" value="<?= htmlspecialchars($user['phone']) ?>">
        </div>

        <div class="form-group">
          <label>State</label>
          <input type="text" name="state" value="<?= htmlspecialchars($user['state']) ?>">
        </div>

        <div class="form-group">
          <label>Email Address</label>
          <input type="email" name="email" value="<?= htmlspecialchars($user['email']) ?>">
        </div>

        <div class="form-group">
          <label>ZIP Code</label>
          <input type="text" name="zip_code" value="<?= htmlspecialchars($user['zip_code']) ?>">
        </div>

        <div class="form-group full-width">
          <label>Emergency Contact</label>
          <input type="text" name="emergency_contact" value="<?= htmlspecialchars($user['emergency_contact']) ?>">
        </div>

<div class="btn-container">
  <button type="submit" class="btn-save open-confirmation" data-action="save" data-name="your changes">Save</button>
  <button type="button" class="btn-cancel" onclick="window.location.href='Book_appointment_dashboard.php'">Back</button>
</div>
      </form>
        
    </section>
  </main>

  <!-- Confirmation Popup (reusable) -->
  <?php include 'php/confirmation.php'; ?>

<script>
document.querySelectorAll(".open-confirmation").forEach(btn => {
  btn.addEventListener("click", function(e) {
    e.preventDefault(); // stop the form from submitting right away
    const action = this.getAttribute("data-action");
    const name = this.getAttribute("data-name");
    const form = this.closest("form");

    // Open popup and submit the form if confirmed
    openConfirmation(action, name, () => {
      form.submit();
    });
  });
});
</script>


  <!-- Footer -->
  <iframe src="header_footer/footer/Footer.html" 
  style="width:100%; height:523px; border:none;"></iframe>

</body>
</html>
