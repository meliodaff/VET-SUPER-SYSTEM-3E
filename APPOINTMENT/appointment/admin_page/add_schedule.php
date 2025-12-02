<?php
include '../includes/session_id.php';
include '../includes/db.php';
?>

<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Vet Appointment System - Add Schedule</title>
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
      <a href="" class="nav-logout">
      <img src="image/arrow-out-right-square-half.png" class="nav-icon" alt="Dashboard Icon">  
        Logout
      </a>
  </div>

<main class="appointments-section">
  <br><br><br><br>
  <div style="border: 1px solid black; padding: 50px; border-radius:30px;">
    <h2 class="appointments-title">Add New Schedule</h2>

    <form action="../php/add_schedule_process.php" method="POST" class="add-schedule-form">
      
      <!-- Day of Week -->
      <div class="form-group">
        <label for="day_of_week">Day of Week:</label>
        <select id="day_of_week" name="day_of_week" required style="padding: 13px; font-size: 15px;">
          <option value="">Select Day</option>
          <option value="Sunday">Sunday</option>
          <option value="Monday">Monday</option>
          <option value="Tuesday">Tuesday</option>
          <option value="Wednesday">Wednesday</option>
          <option value="Thursday">Thursday</option>
          <option value="Friday">Friday</option>
          <option value="Saturday">Saturday</option>
        </select>
      </div>

      <!-- Start Time -->
      <div class="form-group">
        <label for="start_time">Start Time:</label>
        <input type="time" id="start_time" name="start_time" required style="padding: 13px; font-size: 15px;">
      </div>

      <!-- End Time -->
      <div class="form-group">
        <label for="end_time">End Time:</label>
        <input type="time" id="end_time" name="end_time" required style="padding: 13px; font-size: 15px;">
      </div>

      <button type="submit" class="btn-submit" 
        style="padding: 15px; width: 250px; background-color: green; color: white; border:none; border-radius: 13px;">
        ADD SCHEDULE
      </button>

    </form>

    <button type="button" onclick="history.back()" class="btn-submit"
      style="padding: 15px; width: 250px; background-color: red; color: white; border:none; border-radius: 13px; margin-top: 13px;">
      CANCEL
    </button>
  </div>
</main>

<script src="../script/index.js"></script>
</body>
</html>
