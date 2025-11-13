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



  <!-- Footer -->
  <footer class="main-footer">
    <div class="footer-container">
      <!-- Left Section: Logo -->
      <div class="footer-brand">
        <img src="image/VETERINARY_LOGO_SYSTEM.png" alt="Fur-Ever Care Logo" class="footer-logo">
      </div>

      <!-- Middle Section: Title + Schedule -->
      <div class="footer-center">
        <div class="footer-title">
          <h2>FUR-EVER CARE</h2>
          <p>VETERINARY SERVICES</p>
        </div>

        <div class="footer-schedule">
          <h3>SCHEDULE</h3>
          <div class="schedule-card">
            <div class="schedule-icon">
              <!-- Clock Icon -->
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" stroke="#002d72"
                stroke-width="2" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="10" />
                <path d="M12 6v6l4 2" />
              </svg>
            </div>
            <div class="schedule-text">
              <p>9:00 AM - 7:00 PM</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Right Section: Contact Info -->
      <div class="footer-contact">
        <h3>CONTACT INFORMATION</h3>

        <div class="contact-item">
          <!-- Location -->
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" stroke="white" stroke-width="2"
            viewBox="0 0 24 24">
            <path d="M21 10c0 6-9 13-9 13S3 16 3 10a9 9 0 1118 0z" />
            <circle cx="12" cy="10" r="3" />
          </svg>
          <p>123 Pet Care Avenue<br>Veterinary District, VC 12345</p>
        </div>

        <div class="contact-item">
          <!-- Phone -->
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" stroke="white" stroke-width="2"
            viewBox="0 0 24 24">
            <path
              d="M22 16.92V21a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.11 19.5 19.5 0 01-6-6A19.79 19.79 0 012 4.18 2 2 0 014 2h4.09a2 2 0 012 1.72c.12.81.37 1.61.72 2.34a2 2 0 01-.45 2.11L9 10a16 16 0 006 6l1.83-1.36a2 2 0 012.11-.45c.73.35 1.53.6 2.34.72a2 2 0 011.72 2.01z" />
          </svg>
          <p>(555) 123-PETS</p>
        </div>

        <div class="contact-item">
          <!-- Email -->
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" stroke="white" stroke-width="2"
            viewBox="0 0 24 24">
            <path d="M4 4h16v16H4z" />
            <path d="M22 6l-10 7L2 6" />
          </svg>
          <p>furevercare@gmail.com</p>
        </div>

        <a href="careers.php" class="contact-item careers">
          <!-- Career / Briefcase -->
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" stroke="currentColor"
            stroke-width="2" viewBox="0 0 24 24">
            <path
              d="M10 2h4a2 2 0 012 2v2h4a2 2 0 012 2v12a2 2 0 01-2 2H4a2 2 0 01-2-2V8a2 2 0 012-2h4V4a2 2 0 012-2z" />
            <path d="M16 10V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v6" />
          </svg>
          Careers
        </a>
      </div>
    </div>

    <!-- Bottom Bar -->
    <div class="footer-bottom">
      <p>
        <svg class="paw-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
          <path
            d="M226.5 92.9c14.3 42.9-.3 86.2-32.6 96.8s-70.1-15.6-84.4-58.5s.3-86.2 32.6-96.8s70.1 15.6 84.4 58.5zM100.4 198.6c18.9 32.4 14.3 70.1-10.2 84.1s-59.7-.9-78.5-33.3S-2.7 179.3 21.8 165.3s59.7 .9 78.5 33.3zM69.2 401.2C121.6 259.9 214.7 224 256 224s134.4 35.9 186.8 177.2c3.6 9.7 5.2 20.1 5.2 30.5v1.6c0 25.8-20.9 46.7-46.7 46.7c-11.5 0-22.9-1.4-34-4.2l-88-22c-15.3-3.8-31.3-3.8-46.6 0l-88 22c-11.1 2.8-22.5 4.2-34 4.2C84.9 480 64 459.1 64 433.3v-1.6c0-10.4 1.6-20.8 5.2-30.5zM421.8 282.7c-24.5-14-29.1-51.7-10.2-84.1s54-47.3 78.5-33.3s29.1 51.7 10.2 84.1s-54 47.3-78.5 33.3zM310.1 189.7c-32.3-10.6-46.9-53.9-32.6-96.8s52.1-69.1 84.4-58.5s46.9 53.9 32.6 96.8s-52.1 69.1-84.4 58.5z"
            fill="currentColor" />
        </svg>
        All rights reserved (2025)
      </p>
      <a href="privacylogin.php">Privacy Policy</a>
      <p>
        <svg class="paw-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
          <path
            d="M226.5 92.9c14.3 42.9-.3 86.2-32.6 96.8s-70.1-15.6-84.4-58.5s.3-86.2 32.6-96.8s70.1 15.6 84.4 58.5zM100.4 198.6c18.9 32.4 14.3 70.1-10.2 84.1s-59.7-.9-78.5-33.3S-2.7 179.3 21.8 165.3s59.7 .9 78.5 33.3zM69.2 401.2C121.6 259.9 214.7 224 256 224s134.4 35.9 186.8 177.2c3.6 9.7 5.2 20.1 5.2 30.5v1.6c0 25.8-20.9 46.7-46.7 46.7c-11.5 0-22.9-1.4-34-4.2l-88-22c-15.3-3.8-31.3-3.8-46.6 0l-88 22c-11.1 2.8-22.5 4.2-34 4.2C84.9 480 64 459.1 64 433.3v-1.6c0-10.4 1.6-20.8 5.2-30.5zM421.8 282.7c-24.5-14-29.1-51.7-10.2-84.1s54-47.3 78.5-33.3s29.1 51.7 10.2 84.1s-54 47.3-78.5 33.3zM310.1 189.7c-32.3-10.6-46.9-53.9-32.6-96.8s52.1-69.1 84.4-58.5s46.9 53.9 32.6 96.8s-52.1 69.1-84.4 58.5z"
            fill="currentColor" />
        </svg>
      </p>
    </div>
  </footer>
</body>

</html>
<?php include './includes/chatbot.php'; ?>