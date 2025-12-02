<?php
    include '../includes/session_id.php';
    include '../includes/db.php';
?>

<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Vet Appointment System</title>
  <link rel="stylesheet" href="../styles/index.css">
  <link rel="stylesheet" href="../styles/index_Footer.css">
  <link rel="stylesheet" href="../styles/index_Header.css">

    <link rel="stylesheet" href="../../../MARKETING/css/generalfooter.css">
</head>
<body>

  <!-- Header Section -->
  <header class="header">
    <div class="header-left">
      <div class="logo-wrapper">
        <img src="../image/logo.png" alt="Logo" class="logo-header" />
      </div>
      <h1 class="brand-name">FUR-EVER CARE</h1>
    </div>
    <div class="header-right">
      <nav class="nav-links">
        <img src="../image/profile 1.png" alt="User" class="user-icon" />
      </nav>
    </div>
  </header>

      <div class="side-nav">
      <a href="" class="nav-item">
        <img src="image/home.png" class="nav-icon" alt="Dashboard Icon">
        Dashboard
      </a>
      <a href="" class="nav-item">
        <img src="image/user.png" class="nav-icon" alt="Dashboard Icon">
        Employee Profile
      </a>
      <a href="" class="nav-item">
          <img src="image/Group.png" class="nav-icon" alt="Dashboard Icon">
        Applicant
      </a>
      <a href="" class="nav-item">
      <img src="image/calendar.png" class="nav-icon" alt="Dashboard Icon">
        Schedule
      </a>
      <a href="" class="nav-item">
      <img src="image/gift.png" class="nav-icon" alt="Dashboard Icon">
        Incentives
      </a>
      <a href="" class="nav-item">
      <img src="image/chart-line.png" class="nav-icon" alt="Dashboard Icon">  
        Analytics
      </a>
      <a href="" class="nav-item">
      <img src="image/megaphone-alt.png" class="nav-icon" alt="Dashboard Icon">  
        Announcement
      </a>
      <a href="" class="nav-item">
      <img src="image/star.png" class="nav-icon" alt="Dashboard Icon">  
        Performance Rating
      </a>
      <a href="" class="nav-item">
      <img src="image/community.png" class="nav-icon" alt="Dashboard Icon">  
        Employee Portal
      </a>

      <!-- Logout at bottom using padding trick -->
      <a href="http://localhost:5173/login" class="nav-logout">
      <img src="image/arrow-out-right-square-half.png" class="nav-icon" alt="Dashboard Icon">  
        Logout
      </a>
  </div>

   <main class="appointments-section">
    <br>
    <br>
    <br>
    <br>
    <div style=" border: 1px solid black; padding: 50px; border-radius:30px;" >
    <h2 class="appointments-title">Add New Service</h2>

    <form action="../php/add_service_process.php" method="POST" class="add-service-form">
      <div class="form-group">
        <label for="service_name">Service Name:</label>
        <input type="text" id="service_name" name="service_name" placeholder="Enter service name" required style=" padding: 13px; font-size: 15px;">
      </div>

      <div class="form-group">
        <label for="price">Price (₱):</label>
        <input type="number" id="price" name="price" step="0.01" placeholder="Enter price" required style=" padding: 13px; font-size: 15px;">
      </div>

      <div class="form-group">
        <label for="description">Description:</label>
        <textarea id="description" name="description" rows="4" placeholder="Enter service description" required style=" padding: 20px; font-size: 15px;"></textarea>
      </div>

      <button type="submit" class="btn-submit" style="padding: 15px; width: 250px; background-color: green; color: white; border:none; border-radius: 13px;">
       ADD SERVICE
    </button>
    </form>
        <button type="button"  onclick="history.back()"  class="btn-submit"style="padding: 15px; width: 250px; background-color: red; color: white; border:none; border-radius: 13px; margin-top: 13px;">
       CANCEL
    </button>
    </div>
  </main>

 <!-- footer -->


  <script src="../script/index.js"></script>
</body>
</html>
