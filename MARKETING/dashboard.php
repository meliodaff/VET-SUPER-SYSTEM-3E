<?php
session_start();

// Check if user is logged in (optional - uncomment if needed)
// if (!isset($_SESSION['user_id'])) {
//     header('Location: login.php');
//     exit();
// }

// Sample data - replace with database queries
$user_name = $_SESSION['user_name'] ?? 'Guest';
$pets = [
  [
    'name' => 'Buddy',
    'breed' => 'Golden Retriever',
    'age' => '3 years old',
    'last_visit' => '09/22/25',
    'next_visit' => '10/22/25'
  ],
  [
    'name' => 'Luna',
    'breed' => 'Persian Cat',
    'age' => '2 years old',
    'last_visit' => '08/12/25',
    'next_visit' => 'Schedule Needed'
  ]
];

$appointments = [
  [
    'service' => 'General Check-up',
    'pet' => 'Buddy',
    'date' => '10/22/25',
    'status' => 'Confirmed',
    'status_color' => 'green'
  ],
  [
    'service' => 'Grooming Session',
    'pet' => 'Luna',
    'date' => '10/22/25',
    'status' => 'Pending',
    'status_color' => 'purple'
  ]
];

$summary = [
  'total_visits' => 5,
  'active_promotions' => 2,
  'available_vouchers' => 2
];
?>
<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Dashboard - FUR-EVER CARE</title>
  <link rel="stylesheet" href="css/dashboard.css">
</head>

<body>
  <header>
    <nav class="navbar">
      <div class="logo">
        <img src="image/VETERINARY_LOGO_SYSTEM.png" alt="FUR-EVER CARE">
        <span>FUR-EVER CARE</span>
      </div>
      <ul class="nav-links">
        <li><a href="index.php">Home</a></li>
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

  <!-- Dashboard Header -->
  <div class="dashboard-header">
    <div class="dashboardlogo">
      <img src="image/dashboard logo.png" alt="Dashboard Logo">
    </div>
    <h1>My Pet <span>Dashboard</span></h1>
    <p>Welcome
      back<?php echo !empty($user_name) && $user_name !== 'Guest' ? ', ' . htmlspecialchars($user_name) : ''; ?>! Here's
      everything you need to manage your pet's health and wellbeing.</p>
  </div>

  <!-- Tabs -->
  <div class="tabs-container">
    <div class="tabs">
      <a href="dashboard.php" class="tab active">Overview</a>
      <a href="services.php" class="tab">Services</a>
      <a href="offers.php" class="tab">Offers</a>
      <a href="vouchers.php" class="tab">Vouchers</a>
    </div>
  </div>

  <!-- Pets Section -->
  <div class="pets-section">
    <h2>My Pets</h2>
    <div class="pets-container">
      <?php foreach ($pets as $pet): ?>
        <div class="pet-card">
          <h3><?php echo htmlspecialchars($pet['name']); ?></h3>
          <p><?php echo htmlspecialchars($pet['breed']); ?> • <?php echo htmlspecialchars($pet['age']); ?></p>
          <p>Last Visit: <?php echo htmlspecialchars($pet['last_visit']); ?></p>
          <p>
            <?php echo $pet['next_visit'] === 'Schedule Needed' ? $pet['next_visit'] : 'Next: ' . htmlspecialchars($pet['next_visit']); ?>
          </p>
          <button onclick="window.location.href='book-appointment.php?pet=<?php echo urlencode($pet['name']); ?>'">Book
            Appointment</button>
        </div>
      <?php endforeach; ?>
    </div>
  </div>

  <!-- Summary Section -->
  <div class="summary-section">
    <h2>Your Pet Care Summary</h2>
    <div class="summary-boxes">
      <div class="summary-box">
        <h3><?php echo $summary['total_visits']; ?></h3>
        <p>Total Visits</p>
      </div>
      <div class="summary-box">
        <h3><?php echo $summary['active_promotions']; ?></h3>
        <p>Active Promotions</p>
      </div>
      <div class="summary-box">
        <h3><?php echo $summary['available_vouchers']; ?></h3>
        <p>Available Vouchers</p>
      </div>
    </div>
  </div>

  <!-- Appointments Section -->
  <div class="appointments-section">
    <h2>Upcoming Appointments</h2>
    <?php foreach ($appointments as $appointment): ?>
      <div class="appointment-card">
        <p><strong><?php echo htmlspecialchars($appointment['service']); ?></strong> -
          <?php echo htmlspecialchars($appointment['pet']); ?> - <?php echo htmlspecialchars($appointment['date']); ?>
        </p>
        <span
          style="color: <?php echo htmlspecialchars($appointment['status_color']); ?>; font-weight:bold;"><?php echo htmlspecialchars($appointment['status']); ?></span>
      </div>
    <?php endforeach; ?>
  </div>

 
</body>

</html>
<?php include 'generalfooter.php'; ?>

<?php include './includes/chatbot.php'; ?>