<?php
session_start();

// Check if user is logged in
$is_logged_in = isset($_SESSION['logged_in']) && $_SESSION['logged_in'] === true;

// Get user information from session if logged in
$user_name = $is_logged_in ? ($_SESSION['user_name'] ?? 'Guest') : 'Guest';
?>
<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Privacy Policy - FUR-EVER CARE</title>
  <link rel="stylesheet" href="css/privacylogin.css">
</head>

<body>
  <header>
    <nav class="navbar">
      <div class="logo">
        <a href="#home" style="text-decoration: none;" class="logo">
          <img src="image/VETERINARY_LOGO_SYSTEM.png" alt="FUR-EVER CARE">
          <span>FUR-EVER CARE</span>
      </div>
      <ul class="nav-links">
        <li><a href="<?php echo $is_logged_in ? 'landing.php' : 'index.php'; ?>">Home</a></li>
        <li><a href="<?php echo $is_logged_in ? 'landing.php#services' : 'index.php#services'; ?>">Services</a></li>
        <li><a href="#" class="book-now">Book Now</a></li>

        <?php if ($is_logged_in): ?>
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
        <?php else: ?>
          <li><a href="signin.php" class="book-now" style="background: #28a745;">Sign In</a></li>
        <?php endif; ?>
      </ul>
    </nav>
  </header>


  <main class="privacy-content">
    <div class="privacy-container">
      <h1>Privacy Policy</h1>
      <p class="last-updated">Last Updated: September 2025</p>

      <p class="intro">At Fur-ever Care Veterinary Services, we are committed to protecting the privacy of our clients
        and their pets. This Privacy Policy outlines how we collect, use, and safeguard your personal information.</p>

      <section class="privacy-section">
        <h2>1. Information We Collect</h2>
        <p>We collect information you provide, such as:</p>
        <ul>
          <li>Contact details (name, email, phone number, address)</li>
          <li>Pet information (name, breed, medical history)</li>
          <li>Payment details for services</li>
        </ul>
      </section>

      <section class="privacy-section">
        <h2>2. How We Use Your Information</h2>
        <p>We use your information to:</p>
        <ul>
          <li>Provide veterinary care and manage appointments</li>
          <li>Process payments and communicate with you</li>
          <li>Improve our services and website functionality</li>
          <li>Schedule and manage appointments</li>
        </ul>
      </section>

      <section class="privacy-section">
        <h2>3. Sharing Information</h2>
        <p>We do not sell or share your personal information with third parties, except:</p>
        <ul>
          <li>With your consent</li>
          <li>To comply with legal obligations</li>
          <li>With trusted service providers (e.g., payment processors) who follow strict privacy standards</li>
        </ul>
      </section>

      <section class="privacy-section">
        <h2>4. Data Security</h2>
        <p>We use secure systems and encryption to protect your information. However, no system is completely risk-free,
          and we work hard to keep your data safe.</p>
      </section>

      <section class="privacy-section">
        <h2>5. Your Rights</h2>
        <p>You may:</p>
        <ul>
          <li>Request access to or correction of your information</li>
          <li>Ask us to delete your data</li>
          <li>Opt out of marketing communications</li>
        </ul>
      </section>

      <section class="privacy-section">
        <h2>6. Changes to This Policy</h2>
        <p>We may update this policy as needed. Changes will be posted on our website with the updated effective date.
        </p>
      </section>
    </div>
  </main>

  <section class="meet-us">
    <div class="meet-us-container">
      <h2>Ready to Meet Us?</h2>
      <p>We'd love to meet you and your furry family member! Schedule a visit today.</p>

      <div class="contact-cards">
        <div class="contact-info-card">
          <div class="card-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" />
            </svg>
          </div>
          <h3>Location</h3>
          <p>123 Pet Care Avenue<br>Veterinary District, VC<br>12345</p>
        </div>

        <div class="contact-info-card">
          <div class="card-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path
                d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.362 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.338 1.85.573 2.81.7A2 2 0 0122 16.92z" />
            </svg>
          </div>
          <h3>Contact</h3>
          <p>(555) 123-PETS</p>
        </div>

        <div class="contact-info-card">
          <div class="card-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <rect x="2" y="4" width="20" height="16" rx="2" />
              <path d="M2 8l10 6 10-6" />
            </svg>
          </div>
          <h3>Email</h3>
          <p>furevercare@gmail.com</p>
        </div>
      </div>

      <a href="#" class="schedule-visit-btn">Schedule Your Pet's Visit Today</a>
    </div>
  </section>


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