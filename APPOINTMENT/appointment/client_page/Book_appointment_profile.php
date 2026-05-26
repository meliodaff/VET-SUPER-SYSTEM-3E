<?php
require_once '../includes/session_id.php';
require_once '../includes/hr_db.php';

// ------------------------
// Get logged-in user ID
// ------------------------
$user_id = $_SESSION['user_id'] ?? null;
if (!$user_id) {
    die("❌ No user logged in.");
}

// ------------------------
// Fetch user data
// ------------------------
$query = "SELECT first_name, middle_name, last_name, email, phone_number 
          FROM users 
          WHERE user_id = ?";
$stmt = $conn->prepare($query);
$stmt->bind_param("i", $user_id);
$stmt->execute();
$result = $stmt->get_result();
$user = $result->fetch_assoc();

if (!$user) {
    die("❌ User not found.");
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Update Profile</title>

<!-- Existing CSS -->
<link rel="stylesheet" href="../styles/profile.css">
<link rel="stylesheet" href="/appointment/styles/popup.css">
<link rel="stylesheet" href="../../../MARKETING/css/generalfooter.css">

</head>
<body>

<!-- Header -->
<?php include '../header_footer/Header/Header.php'; ?>

<!-- Popup -->
<?php include '../php/popup.php'; ?>

<main>
<section class="form-section">
  <h2>Profile Details</h2>

  <form class="details-form" method="POST" action="../php/update_profile.php">

    <div class="form-group">
      <label>First Name</label>
      <input type="text" name="first_name" value="<?php echo htmlspecialchars($user['first_name']); ?>">
    </div>

    <div class="form-group">
      <label>Middle Name</label>
      <input type="text" name="middle_name" value="<?php echo htmlspecialchars($user['middle_name']); ?>">
    </div>

    <div class="form-group">
      <label>Last Name</label>
      <input type="text" name="last_name" value="<?php echo htmlspecialchars($user['last_name']); ?>">
    </div>

    <div class="form-group">
      <label>Email Address</label>
      <input type="email" name="email" value="<?php echo htmlspecialchars($user['email']); ?>">
    </div>

    <div class="form-group">
      <label>Phone Number</label>
      <input type="text" name="phone_number" value="<?php echo htmlspecialchars($user['phone_number']); ?>">
    </div>

    <div class="btn-container">
      <button type="submit" class="btn-save open-confirmation" data-action="save" data-name="your changes">Save</button>
      <button type="button" class="btn-cancel" onclick="window.location.href='Book_appointment_dashboard.php'">Back</button>
    </div>

  </form>
</section>
</main>

<!-- Confirmation Popup -->
<?php include '../php/confirmation.php'; ?>

<script>
document.querySelectorAll(".open-confirmation").forEach(btn => {
  btn.addEventListener("click", function(e) {
    e.preventDefault();
    const action = this.getAttribute("data-action");
    const name = this.getAttribute("data-name");
    const form = this.closest("form");

    openConfirmation(action, name, () => {
      form.submit();
    });
  });
});
</script>

<!-- Footer -->
<?php include '../../../MARKETING/generalfooter.php'; ?>

</body>
</html>
