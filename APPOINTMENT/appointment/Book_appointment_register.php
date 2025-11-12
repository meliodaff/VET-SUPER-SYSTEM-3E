<?php
  require_once 'includes/session_id.php';
?>


<!-- Register.html -->
<!DOCTYPE html>
<html>
<head>
  <title>Register</title>
  <link rel="stylesheet" href="header_footer/footer/Footer.css">
  <link rel="stylesheet" href="styles/Book_appointment_register.css">
</head>
<body>
    <!-- header-->
  <?php include 'header_footer/Header/Header.php'; ?>


<!-- Main content -->
 <!-- Main content -->

<main>
  <div class="container">
    <h1>Book Your Visit</h1>
    <p class="subtitle">Register as a new client.</p>
    <h2 class="form-title">New Client Registration</h2>

<!-- Form -->
<form class="appointment-form" method="POST" action="php/registered.php">
  <div class="section">
    <div class="section-title">Personal Information</div>
    <div class="section-title">Address Information</div>

    <div class="form-row">
      <input type="text" name="fname" placeholder="Full Name *" required>
      <input type="text" name="street_address" placeholder="Street Address *" required>
    </div>

    <div class="form-row">
      <input type="text" name="lname" placeholder="Last Name *" required>
      <input type="text" name="city" placeholder="City *" required>
    </div>

    <div class="form-row">
      <input type="tel" name="phone" placeholder="Phone Number *" required>
      <input type="text" name="state" placeholder="State *" class="short-input" required>
      <input type="text" name="zip_code" placeholder="ZIP Code *" class="short-input" required>
    </div>

    <div class="form-row">
      <input type="email" name="email" placeholder="Email Address *" required>
      <input type="text" name="emergency_contact" placeholder="Emergency Contact *" required>
    </div>
  </div>

  <!-- Submit -->
  <div class="form-row">
    <button type="submit" class="submit-btn" name="register">Complete Registration</button>
  </div>
</form>



  </div>
</main>


    <!-- footer-->
  <iframe src="header_footer/footer/Footer.html" 
  style="width:100%; height:523px; border:none;"></iframe>
</body>
</html>
