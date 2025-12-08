<?php
require_once '../includes/session_id.php';
require_once '../includes/hr_db.php';

// Get user data based on the logged-in user's ID
$user_id = $_SESSION['user_id'];

// Prepare statement safely
$user_query = $conn->prepare("SELECT * FROM users WHERE user_id = ?");
$user_query->bind_param("i", $user_id);
$user_query->execute();
$user_result = $user_query->get_result();
$user = $user_result->fetch_assoc();

if (!$user) {
    die("User not found.");
}

$full_name = trim(($user['first_name'] ?? '') . ' ' . ($user['middle_name'] ?? '') . ' ' . ($user['last_name'] ?? ''));
$email = $user['email'] ?? '';

// Fetch doctors
$doctor_sql = "SELECT employee_id, first_name, middle_name, last_name FROM employees WHERE department = ?";
$doctor_stmt = $conn->prepare($doctor_sql);
$department = "Doctor";
$doctor_stmt->bind_param("s", $department);
$doctor_stmt->execute();
$doctor_result = $doctor_stmt->get_result();
?>

<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Book Appointment</title>
  <link rel="stylesheet" href="../styles/Book_appointment_book.css">
  <link rel="stylesheet" href="../styles/popup.css">
  <link rel="stylesheet" href="../../../MARKETING/css/generalfooter.css">
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
    .time-btn {
      background-color: #F0F8FF;
      border-radius: 5px;
      border: 1px solid #ccc;
      padding: 10px;
      cursor: pointer;
      transition: all 0.3s ease;
    }
    .time-btn:hover {
      background-color: #003080;
      color: #fff;
    }
    .time-btn.active {
      background-color: #002060;
      color: #fff;
      font-weight: bold;
    }

    .time-btn.disabled {
      background-color: #ccc !important;
      color: #666 !important;
      cursor: not-allowed !important;
    }
  </style>
</head>
<body>
  <?php include '../header_footer/Header/Header.php'; ?>
  <?php include '../php/popup.php'; ?>

  <main>
    <div class="container">
      <h1>Book Your Visit</h1>
      <p class="subtitle">Schedule your pet's visit</p>
      <h2 class="form-title">Book Appointment</h2>

      <form id="appointmentForm" method="POST" action="../php/book.php">
        <input type="hidden" name="name" value="<?= htmlspecialchars($full_name) ?>">
        <input type="hidden" name="email" value="<?= htmlspecialchars($email) ?>">

        <div class="section owner-pet">
          <div class="section-header">Owner Information</div>

          <div class="form-row">
            <input type="tel" name="phone" placeholder="Phone Number *" required style="width: 98%;">
            <select name="vetdoc_id" id="vetdoc" required>
              <option value="">Select Veterinarian *</option>
              <?php
              while ($doctor = $doctor_result->fetch_assoc()) {
                  $doctor_id = $doctor['employee_id'];
                  $doctor_name = trim($doctor['first_name'] . ' ' . $doctor['middle_name'] . ' ' . $doctor['last_name']);
                  echo '<option value="'.htmlspecialchars($doctor_id).'" data-name="'.htmlspecialchars($doctor_name).'"> Dr. '.htmlspecialchars($doctor_name).'</option>';
              }
              ?>
            </select>
            <input type="hidden" name="vetdoc_name" id="vetdoc_name">
          </div>

          <div class="form-row">
            <p style="margin-top: 15px;"><strong>Status</strong></p>
            <div class="status-options">
              <label><input type="radio" name="status" value="existing" checked> Existing Pet</label>
              <label><input type="radio" name="status" value="new"> New Pet</label>
            </div>

            <select id="petDropdown" name="pet_name" class="select-pet" required>
              <option value="">Select Pet *</option>
              <?php
                $pet_sql = "SELECT id, pet_name FROM mypet WHERE user_id = ?";
                $pet_stmt = $conn->prepare($pet_sql);
                $pet_stmt->bind_param("i", $user_id);
                $pet_stmt->execute();
                $pet_result = $pet_stmt->get_result();
                if ($pet_result->num_rows > 0) {
                    while ($row = $pet_result->fetch_assoc()) {
                        echo '<option value="'.htmlspecialchars($row['pet_name']).'">'.htmlspecialchars($row['pet_name']).'</option>';
                    }
                } else {
                    echo '<option value="">No pets found</option>';
                }
              ?>
            </select>

            <button type="button" id="addPetBtn" class="add-pet-btn">Add Pet</button>
          </div>
        </div>

        <br><br>

        <div class="section appointment-details">
          <div class="section-header">Appointment Details</div>

          <div class="form-row">
            <div id="timeButtonsContainer" style="display: flex; flex-direction: column; gap: 10px;">
              <input id="timeInput" name="time" readonly placeholder="Select Time *" required 
                     style="width: 100%; padding: 10px; border-radius: 10px; border: 1px solid #ccc; background-color: #F0F8FF;">
              
              <button type="button" value="09:00:00" class="time-btn">9AM - 10AM</button>
              <button type="button" value="10:00:00" class="time-btn">10AM - 11AM</button>
              <button type="button" value="13:00:00" class="time-btn">1PM - 2PM</button>
              <button type="button" value="14:00:00" class="time-btn">2PM - 3PM</button>
              <button type="button" value="15:00:00" class="time-btn">3PM - 4PM</button>
              <button type="button" value="16:00:00" class="time-btn">4PM - 5PM</button>
            </div>

            <input type="date" name="date" id="appointmentDate" style="height:44px;" required>

            <select name="service" required style="width: 100%; height:44px; border-radius:10px; border:1px solid #ccc; background-color:#F0F8FF;">
              <option value="">Select Service *</option>
              <?php
              $app_conn = new mysqli('localhost', 'root', '', 'appointment_sia');
              if ($app_conn->connect_error) {
                  die("Appointment DB connection failed: " . $app_conn->connect_error);
              }

              $service_sql = "SELECT service_name, price FROM type_of_service";
              $service_result = $app_conn->query($service_sql);

              if ($service_result && $service_result->num_rows > 0) {
                  while ($service = $service_result->fetch_assoc()) {
                      $name = $service['service_name'];
                      $price = $service['price'];
                      echo '<option value="'.htmlspecialchars($name . '|' . $price).'">'.htmlspecialchars($name . ' - ₱'.$price).'</option>';
                  }
              } else {
                  echo '<option value="">No services found</option>';
              }

              $app_conn->close();
              ?>
            </select>
          </div>
        </div>

        <div class="form-row">
          <button type="submit" class="submit-btn">Book Appointment</button>
        </div>
      </form>

      <button type="button" style="width:100%; height:47px; border-radius:10px; margin-top:10px; background-color:#002060; color:white; font-weight:bold; font-size:15px;" onclick="window.location.href='Book_appointment_dashboard.php'">CANCEL</button>

    </div>
  </main>

  <?php include '../../../MARKETING/generalfooter.php'; ?>

<script>
const statusRadios = document.querySelectorAll('input[name="status"]');
const petDropdown = document.getElementById('petDropdown');
const addPetBtn = document.getElementById('addPetBtn');
const timeInput = document.getElementById('timeInput');

// Handle status change (existing/new pet)
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

// Add pet button
addPetBtn.addEventListener("click", function() {
    window.location.href = "/appointment/Book_appointment_add_pet.php";
});

// Time selection buttons with visual feedback
const timeButtons = document.querySelectorAll('.time-btn');
timeButtons.forEach(button => {
    button.addEventListener('click', () => {
        // Remove active class from all buttons
        timeButtons.forEach(btn => {
            btn.classList.remove('active');
        });
        
        // Add active class to clicked button
        button.classList.add('active');
        
        // Set the value (time in HH:MM:SS format) to the input
        timeInput.value = button.value;
    });
});

// Populate vet doctor name when selected
const vetdocSelect = document.getElementById('vetdoc');
const vetdocNameInput = document.getElementById('vetdoc_name');

vetdocSelect.addEventListener('change', function() {
    const selectedOption = this.options[this.selectedIndex];
    const doctorName = selectedOption.getAttribute('data-name');
    vetdocNameInput.value = doctorName || '';
});

// Set minimum date to today
const appointmentDate = document.getElementById('appointmentDate');
const today = new Date().toISOString().split('T')[0];
appointmentDate.setAttribute('min', today);



function fetchBookedTimes() {
    const doctorId = vetdocSelect.value;
    const date = appointmentDate.value;

    if (!doctorId || !date) return;

    // 🔥 Clear selected time if doctor/date changes
    timeInput.value = "";
    currentSelectedTime = null;

    fetch(`../php/fetch_booked.php?doctor_id=${doctorId}&date=${date}`)
        .then(response => response.json())
        .then(bookedTimes => {

            // Reset all buttons
            timeButtons.forEach(btn => {
                btn.disabled = false;
                btn.classList.remove("disabled");

                if (btn.originalText) {
                    btn.textContent = btn.originalText;
                }
            });

            // Disable booked time buttons
            timeButtons.forEach(btn => {
                if (bookedTimes.includes(btn.value)) {
                    btn.disabled = true;
                    btn.classList.add("disabled");

                    btn.originalText = btn.textContent;
                    btn.textContent = btn.textContent + " (Booked)";
                }
            });

        });
}

// Check whenever doctor or date changes
vetdocSelect.addEventListener("change", fetchBookedTimes);
appointmentDate.addEventListener("change", fetchBookedTimes);
</script>
</body>
</html>