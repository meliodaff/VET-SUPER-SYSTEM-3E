<?php
// Include database configuration first (it handles session_start)
require_once 'config.php';
require_once 'notification.php';

// Check if user is logged in
if (!isset($_SESSION['logged_in']) || $_SESSION['logged_in'] !== true || !isset($_SESSION['user_id'])) {
  header("Location: signin.php");
  exit();
}

$success = getTempData('success');
$error = getTempData('error');

// Get the logged-in user's ID
$user_id = $_SESSION['user_id'];

// Fetch user data from database
$conn = getDBConnection();
$stmt = $conn->prepare("SELECT first_name, last_name, email, phone_number, address FROM users WHERE id = ?");
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
  // User not found, logout
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
  <title>My Profile - FUR-EVER CARE</title>
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
        <a href="landing.php" style="text-decoration: none;" class="logo">
          <img src="image/VETERINARY_LOGO_SYSTEM.png" alt="FUR-EVER CARE">
          <span>FUR-EVER CARE</span>
        </a>
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
      <h1>My Profile</h1>
      <p class="subtitle">Manage your personal information and account settings</p>
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
          <p>Manage your personal details and contact information.</p>
        </div>
        <a href="editprof.php" class="edit-profile">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
          </svg>
          Edit Profile
        </a>
      </div>

      <?php if ($success): ?>
        <div class="alert alert-success"><?php echo htmlspecialchars($success); ?></div>
      <?php endif; ?>

      <?php if ($error): ?>
        <div class="alert alert-error"><?php echo htmlspecialchars($error); ?></div>
      <?php endif; ?>
      
      <div class="form-grid">
        <div class="form-group">
          <label for="first-name">First Name</label>
          <input type="text" id="first-name" value="<?php echo htmlspecialchars($first_name); ?>" readonly>
        </div>
        <div class="form-group">
          <label for="last-name">Last Name</label>
          <input type="text" id="last-name" value="<?php echo htmlspecialchars($last_name); ?>" readonly>
        </div>
        <div class="form-group">
          <label for="email">Email Address</label>
          <input type="email" id="email" value="<?php echo htmlspecialchars($email); ?>" readonly>
        </div>
        <div class="form-group">
          <label for="phone">Phone Number</label>
          <input type="text" id="phone" value="<?php echo htmlspecialchars($phone_number); ?>" readonly
            placeholder="Not set">
        </div>
        <div class="form-group full-width">
          <label for="address">Address</label>
          <input type="text" id="address" value="<?php echo htmlspecialchars($address); ?>" readonly
            placeholder="Not set">
        </div>
      </div>
    </section>
  </main>

 <?php include 'generalfooter.php'; ?>

</body>

</html>
<?php include './includes/chatbot.php'; ?>