<?php
session_start();

// Check if user is logged in
if (!isset($_SESSION['logged_in']) || $_SESSION['logged_in'] !== true) {
  header("Location: signin.php");
  exit();
}

// Get user information from session
$user_name = $_SESSION['user_name'] ?? 'Guest';
$user_email = $_SESSION['user_email'] ?? '';
?>
<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Offers - FUR-EVER CARE</title>
  <link rel="stylesheet" href="css/offers.css">
</head>

<body>
  <header>
    <nav class="navbar">
      <a href="landing.php" style="text-decoration: none;" class="logo">
        <img src="image/VETERINARY_LOGO_SYSTEM.png" alt="FUR-EVER CARE">
        <span>FUR-EVER CARE</span>
      </a>
      <ul class="nav-links">
        <li><a href="landing.php">Home</a></li>
        <li><a href="landing.php#services">Services</a></li>
        <li><a href="#" class="book-now">Book Now</a></li>
        <li class="profile-menu">
          <a href="profile.php" class="profile-icon" title="Go to Profile">
            <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="12" fill="black" />
              <circle cx="12" cy="8" r="4" fill="white" />
              <path d="M12 14c-5 0-8 3-8 6v2h16v-2c0-3-3-6-8-6z" fill="white" />
            </svg>
          </a>
          <ul class="dropdown">
            <li><a href="profile.php">👤 My Profile</a></li>
            <li><a href="dashboard.php">📊 My Dashboard</a></li>
            <li><a href="appointment.php">📅 My Appointment</a></li>
            <li class="logout"><a href="logout.php">🚪 Log Out</a></li>
          </ul>
        </li>
      </ul>
    </nav>
  </header>


  <!-- Dashboard Header -->
  <div class="dashboard-header">
    <div class="dashboardlogo">
      <img src="image/dashboard logo.png" alt="Dashboard Logo">
    </div>
    <h1>My Pet <span>Dashboard</span></h1>
    <p>Welcome back, <?php echo htmlspecialchars($user_name); ?>! Here's everything you need to manage your pet's health
      and wellbeing.</p>
  </div>

  <!-- Tabs -->
  <div class="tabs-container">
    <div class="tabs">
      <a href="dashboard.php" class="tab">Overview</a>
      <a href="services.php" class="tab">Services</a>
      <a href="offers.php" class="tab active">Offers</a>
      <a href="vouchers.php" class="tab">Vouchers</a>
    </div>
  </div>


  <!-- Offers Section -->
  <div class="offers-section">
    <h2>Special Offers & Promotions</h2>
    <p>Save money while giving your pet the best care.</p>

    <div class="offers-container">
      <div class="offer-card">
        <div class="offer-badge">25% OFF</div>
        <h3>New Pet Parent Bundle</h3>
        <p>Comprehensive starter package including first check-ups, vaccines, and microchipping for new pet parents.</p>
        <span class="expires">Expires: 10/31/25</span>
        <button>Claim This Deal</button>
      </div>

      <div class="offer-card">
        <div class="offer-badge">20% OFF</div>
        <h3>Senior Pet Wellness Plan</h3>
        <p>Special care and screening package for pets 7+ years including blood work, x-ray, and dental check.</p>
        <span class="expires">Expires: 12/15/25</span>
        <button>Save Now</button>
      </div>
    </div>
  </div>



  <?php include 'generalfooter.php'; ?>

</body>

</html>
<?php include './includes/chatbot.php'; ?>