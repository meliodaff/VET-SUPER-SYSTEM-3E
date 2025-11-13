<?php
session_start();
require_once 'notification.php';
// Check if user is logged in
if (!isset($_SESSION['logged_in']) || $_SESSION['logged_in'] !== true) {
  header("Location: signin.php");
  exit();
}

// Include database configuration
require_once 'config.php';

$user_id = $_SESSION['user_id'];
$success = '';
$error = '';

// Handle form submission
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
  $first_name = trim($_POST['first-name']);
  $last_name = trim($_POST['last-name']);
  $email = trim($_POST['email']);
  $phone_number = trim($_POST['phone_number']);
  $address = trim($_POST['address']);

  // Combine first and last name
  $full_name = $first_name . ' ' . $last_name;
  $phone_number = $_POST['phone_number'] ?? '';


  // Validate inputs
  if (empty($first_name)) {
    $error = 'First name is required.';
  } elseif (empty($email)) {
    $error = 'Email is required.';
  } elseif (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    $error = 'Invalid email format.';
  } elseif (!preg_match('/^09[0-9]{9}$/', $phone_number)) {
    $error = "Phone number must start with 09 and contain exactly 11 digits.";
  } else {
    $conn = getDBConnection();

    // Check if email is already taken by another user
    $stmt = $conn->prepare("SELECT id FROM users WHERE email = ? AND id != ?");
    $stmt->bind_param("si", $email, $user_id);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows > 0) {
      $error = 'Email already in use by another account.';
    } else {
      // Update user information
      $stmt = $conn->prepare("UPDATE users SET first_name = ?, last_name = ?, email = ?, phone_number = ?, address = ? WHERE id = ?");
      $stmt->bind_param("sssssi", $first_name, $last_name, $email, $phone_number, $address, $user_id);

      if ($stmt->execute()) {
        // Update session variables
        $_SESSION['user_name'] = $first_name;
        $_SESSION['last_name'] = $last_name;
        $_SESSION['user_email'] = $email;
        $_SESSION['phone_number'] = $phone_number;
        $_SESSION['address'] = $address;

        // $success = 'Profile updated successfully!';
        setTempData('success', 'Profile updated successfully!');
      } else {
        // $error = 'Failed to update profile. Please try again.';
        setTempData('error', 'Failed to update profile. Please try again.');
      }
    }
    header("Location: profile.php");
    $stmt->close();
    $conn->close();
  }
}

// Fetch current user data
$conn = getDBConnection();
$stmt = $conn->prepare("SELECT `id`, `first_name`,`email`,`last_name`,`address`,`phone_number` FROM `users` WHERE id = ?");
$stmt->bind_param("i", $user_id);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows === 1) {
  $user = $result->fetch_assoc();
  $first_name = $user['first_name'];
  $last_name = $user['last_name'];
  $email = $user['email'];
  $phone_number = $user['phone_number'] ?? '';
  $address = $user['address'] ?? '';
} else {
  session_destroy();
  header("Location: signin.php");
  exit();
}

$stmt->close();
$conn->close();
?>

<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Edit Profile - FUR-EVER CARE</title>
  <link rel="stylesheet" href="css/profile.css">
  <style>
    .alert {
      padding: 12px 20px;
      margin-bottom: 20px;
      border-radius: 8px;
      font-size: 14px;
    }

    .alert-success {
      background-color: #d4edda;
      color: #155724;
      border: 1px solid #c3e6cb;
    }

    .alert-error {
      background-color: #f8d7da;
      color: #721c24;
      border: 1px solid #f5c6cb;
    }
  </style>
</head>

<body>
  <header>
    <nav class="navbar">
      <div class="logo">
        <img src="image/VETERINARY_LOGO_SYSTEM.png" alt="FUR-EVER CARE">
        <span>FUR-EVER CARE</span>
      </div>
      <ul class="nav-links">
        <li><a href="landing.php">Home</a></li>
        <li><a href="#services">Services</a></li>
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

  <main class="profile-container">
    <div class="profile-header">
      <h1>Edit Profile</h1>
      <p class="subtitle">Update your personal information and account settings</p>
    </div>

    <div class="profile-navigation">
      <a href="profile.php" class="nav-button active">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="12" cy="8" r="4" />
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
        </svg>
        Personal Info
      </a>
      <a href="security.php" class="nav-button">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
          <path d="M7 11V7a5 5 0 0 1 10 0v4" />
        </svg>
        Security
      </a>
    </div>

    <section class="profile-content">
      <div class="section-header">
        <div class="section-title">
          <h2>Personal Information</h2>
          <p>Update your personal details and contact information.</p>
        </div>
      </div>

      <?php if ($success): ?>
        <div class="alert alert-success"><?php echo htmlspecialchars($success); ?></div>
      <?php endif; ?>

      <?php if ($error): ?>
        <div class="alert alert-error"><?php echo htmlspecialchars($error); ?></div>
      <?php endif; ?>

      <form method="POST" action="editprof.php">
        <div class="form-grid">
          <div class="form-group">
            <label for="first-name">First Name</label>
            <input type="text" id="first-name" name="first-name" value="<?php echo htmlspecialchars($first_name); ?>"
              required>
          </div>
          <div class="form-group">
            <label for="last-name">Last Name</label>
            <input type="text" id="last-name" name="last-name" value="<?php echo htmlspecialchars($last_name); ?>">
          </div>
          <div class="form-group">
            <label for="email">Email Address</label>
            <input type="email" id="email" name="email" value="<?php echo htmlspecialchars($email); ?>" required>
          </div>
          <div class="form-group">
            <label for="phone">Phone Number</label>
            <input type="text" id="phone" name="phone_number" value="<?php echo htmlspecialchars($phone_number); ?>"
              placeholder="Enter your phone number" oninput="this.value = this.value.replace(/[^0-9]/g, '');">

          </div>
          <div class="form-group full-width">
            <label for="address">Address</label>
            <input type="text" id="address" name="address" value="<?php echo htmlspecialchars($address); ?>"
              placeholder="Enter your address">
          </div>
        </div>

        <div class="form-actions">
          <button type="submit" class="btn save-btn">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" stroke="white" stroke-width="2"
              viewBox="0 0 24 24">
              <path d="M9 11l3 3L22 4" />
              <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
            </svg>
            Save Changes
          </button>
          <a href="profile.php" class="btn cancel-btn">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" stroke="currentColor"
              stroke-width="2" viewBox="0 0 24 24">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
            Cancel
          </a>
        </div>
      </form>

    </section>
  </main>

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
      <a href="#">Privacy Policy</a>
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