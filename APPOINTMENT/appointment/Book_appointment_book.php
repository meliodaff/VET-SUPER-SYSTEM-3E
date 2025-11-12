<?php
  require_once 'includes/session_id.php';
  require_once 'includes/db.php';

// Get user data based on the logged-in user's ID
$user_id = $_SESSION['user_id'];

$user_query = $conn->prepare("SELECT * FROM registered WHERE user_id = ?");
$user_query->bind_param("i", $user_id);
$user_query->execute();
$user_result = $user_query->get_result();
$user = $user_result->fetch_assoc();
?>

<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Book Appointment</title>
  <link rel="stylesheet" href="styles/Book_appointment_book.css">
  <link rel="stylesheet" href="/appointment/styles/popup.css">
  <style>
    .add-pet-btn {
      display: none;
      margin-top: 10px;
      padding: 10px 20px;
      background: #002060;
      color: #fff;
      border: none;
      border-radius: 8px;
      font-weight: bold;
      cursor: pointer;
    }
    .add-pet-btn:hover {
      background: #001040;
    }
    .submit-btn {
      padding: 12px 20px;
      background: #002060;
      color: #fff;
      border: none;
      border-radius: 8px;
      font-weight: bold;
      cursor: pointer;
    }
    .submit-btn:hover {
      background: #001040;
    }
  </style>
</head>

<body>
  <!-- Header -->
  <?php include 'header_footer/Header/Header.php'; ?>


    <!-- popup -->
    <?php include 'php/popup.php'; ?>


  <!-- Main Content -->
  <main>
    <div class="container">
      <h1>Book Your Visit</h1>
      <p class="subtitle">Schedule your pet's visit</p>
      <h2 class="form-title">Book Appointment</h2>

      <!-- FORM -->
      <form id="appointmentForm" method="POST" action="php/book.php">
        
        <!-- OWNER INFORMATION -->
        <div class="section owner-pet">
          <div class="section-header">Owner Information</div>

          <div class="form-row">
            <input type="text" name="fname" placeholder="Full Name *" required>
            <select name="vetdoc" required>
              <option value="">Select Veterinarian *</option>
              <option value="Dr. Smith">Dr. Smith</option>
              <option value="Dr. Johnson">Dr. Johnson</option>
            </select>
          </div>

          <div class="form-row">
            <div style="width: 50%;">
              <input type="tel" name="phone" placeholder="Phone Number *" required style="width: 98%;">
            </div>
            <label><strong>Status</strong></label>
            <div class="status-options">
              <label><input type="radio" name="status" value="existing" checked> Existing Pet</label>
              <label><input type="radio" name="status" value="new"> New Pet</label>
            </div>
          </div>

          <div class="form-row">
            <div style="width: 50%;">
              <input type="email" name="email" placeholder="Email Address *" required style="width: 98%;">
            </div>

            <select id="petDropdown" name="pet_name" class="select-pet" required>
              <option value="">Select Pet *</option>
              <?php
                $sql = "SELECT id, pet_name FROM mypet WHERE user_id = {$_SESSION['user_id']}";
                $result = $conn->query($sql);
                if ($result->num_rows > 0) {
                  while ($row = $result->fetch_assoc()) {
                    echo '<option value="'.$row['pet_name'].'">'.$row['pet_name'].'</option>';
                  }
                } else {
                  echo '<option value="">No pets found</option>';
                }
              ?>
            </select>

            <button type="button" id="addPetBtn" class="add-pet-btn">Add Pet</button>
          </div>
        </div>

        <!-- APPOINTMENT DETAILS -->
        <div class="section appointment-details">
          <div class="section-header">Appointment Details</div>

          <div class="form-row">
            <input type="date" name="date" required>
            <input type="time" name="time" required>

            <!-- Service type: value contains both name and price -->
            <select name="service" id="service" required>
              <option value="">Service Type *</option>
              <?php
                $sql = "SELECT id, service_name, price FROM type_of_service";
                $result = $conn->query($sql);
                if ($result->num_rows > 0) {
                  while ($row = $result->fetch_assoc()) {
                    echo '<option value="'.$row['service_name'].'|'.$row['price'].'">'.$row['service_name'].' - ₱'.$row['price'].'</option>';
                  }
                }
              ?>
            </select>
          </div>
        </div>

        <!-- SUBMIT -->
        <div class="form-row">
          <button type="submit" class="submit-btn">Book Appointment</button>
        </div>
      </form>
                             <button type="submit" style="width:100%; height:47px; border-radius: 10px; margin-top:10px;
              background-color: #002060; color: white; font-weight: bold; font-size:15px;
            " onclick="window.location.href='Book_appointment_dashboard.php'">
                  CANCEL
              </button>
    </div>
  </main>

  <!-- Footer -->
  <iframe src="header_footer/footer/Footer.html" style="width:100%; height:523px; border:none;"></iframe>

  <!-- EXISTING/NEW PET BUTTON HANDLING -->
  <script>
    const statusRadios = document.querySelectorAll('input[name="status"]');
    const petDropdown = document.getElementById('petDropdown');
    const addPetBtn = document.getElementById('addPetBtn');

    statusRadios.forEach(radio => {
      radio.addEventListener("change", () => {
        if (radio.value === "new" && radio.checked) {
          petDropdown.style.display = "none";
          petDropdown.removeAttribute("required");
          addPetBtn.style.display = "inline-block";
        } else {
          petDropdown.style.display = "block";
          petDropdown.setAttribute("required", true);
          addPetBtn.style.display = "none";
        }
      });
    });

    document.getElementById("addPetBtn").addEventListener("click", function() {
      window.location.href = "/appointment/Book_appointment_add_pet.php";
    });
  </script>

</body>
</html>
