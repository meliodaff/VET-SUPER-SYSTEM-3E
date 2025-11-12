<?php
  require_once 'includes/session_id.php';
  require_once 'includes/db.php';

  function getTotalNotifications($conn) {
      $sql = "SELECT COUNT(*) AS total_read FROM notifications WHERE is_read > 0";
      $res = $conn->query($sql);
      $row = $res->fetch_assoc();
      return $row['total_read'] ?? 0;
  }

  $total_read = getTotalNotifications($conn);
?>

<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Header Example</title>
  <style>
    body {
      margin: 0;
      font-family: Arial, sans-serif;
    }

    /* Header */
    .header {
      display: flex;
      align-items: center;
      width: 92%;
      height: 85px;
      justify-content: space-between;
      background: #afecff;
      padding: 15px 30px 15px 0;
      border-radius: 15px;
      box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
      margin: 20px auto 0 auto;
    }

    /* Logo */
    .logo {
      display: flex;
      align-items: center;
      font-weight: bold;
      font-size: 20px;
      color: #003366;
    }

    .logo img {
      height: 90px;
      width: 90px;
      margin-left: 20px;
      margin-right: 15px;
    }

    /* Navigation */
    .nav {
      display: flex;
      gap: 20px;
      align-items: center;
      margin-left: 400px;
    }

    .nav a {
      text-decoration: none;
      color: #000;
      font-size: 16px;
      transition: color 0.3s;
    }

    .nav a:hover {
      color: #0077cc;
    }

    /* Book Now Button */
    .book-btn {
      background: #fffefe;
      color: #5100ff;
      border: 2px solid #454545;
      padding: 5px 15px;
      border-radius: 5px;
      cursor: pointer;
    }

    /* Profile */
    .profile {
      position: relative;
      display: inline-block;
    }

    .profile-icon {
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
    }

    .profile-icon img {
      width: 70px;
      height: 70px;
      border-radius: 50%;
    }

    .profile-icon:hover {
      background: #7caff8ff;
      border-radius: 50%;
    }

    /* Dropdown Menu (hidden by default) */
    .dropdown {
      display: none;
      position: absolute;
      right: 0;
      top: 45px;
      background: white;
      border-radius: 8px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.15);
      min-width: 150px;
      overflow: hidden;
      z-index: 10;
    }

    /* Dropdown links */
    .dropdown a {
      display: block;
      padding: 10px 15px;
      text-decoration: none;
      color: #333;
      transition: background 0.3s;
    }

    .dropdown a:hover {
      background: #f2f2f2;
    }

    /* Show dropdown when active */
    .dropdown.active {
      display: block;
    }
  </style>
</head>
<body>

  <header class="header">
    <!-- Logo -->
    <div class="logo">
      <img src="/appointment/Image/logo.png" alt="Logo">
      FUR-EVER CARE
    </div>  

    <!-- Navigation -->
    <nav class="nav">
      <a href="#">Home</a>
      <a href="#">About</a>
      <a href="#">Services</a>
      <a href="#">Contact</a>
        <button class="book-btn" 
          onclick="window.location.href='/appointment/Book_appointment_book.php'">
          Book Now
        </button>
    </nav>

    <!-- Profile with dropdown -->
    <div class="profile">
      <div class="profile-icon" id="profileIcon"><img src="/appointment/Image/profile 1.png" alt="Logo"></div>
      <div class="dropdown" id="dropdown">
        <a href="Book_appointment_profile.php">My Profile</a>
        <a href="Book_appointment_dashboard.php">Dashboard</a>
        <a href="Book_appointment_my_pet.php">My Pets</a>
        <?php if ($total_read > 0): ?>
          <a href="notification.php" style="color: blue;">Notification</a>
        <?php else: ?>
          <a href="notification.php">Notification</a>
        <?php endif; ?>
        <a href="admin_page/index.html">Logout</a>
      </div>
    </div>
  </header>

  <script>
    const profileIcon = document.getElementById('profileIcon');
    const dropdown = document.getElementById('dropdown');

    // Toggle dropdown on click
    profileIcon.addEventListener('click', function(e) {
      e.stopPropagation();
      dropdown.classList.toggle('active');
    });

    // Close dropdown when clicking outside
    document.addEventListener('click', function(e) {
      if (!profileIcon.contains(e.target) && !dropdown.contains(e.target)) {
        dropdown.classList.remove('active');
      }
    });
  </script>

</body>
</html>