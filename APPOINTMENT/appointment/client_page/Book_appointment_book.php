<?php
require_once '../includes/session_id.php';
require_once '../includes/hr_db.php';

// Get logged-in user info
$user_id = $_SESSION['user_id'] ?? 0;
$user_query = $conn->prepare("SELECT * FROM users WHERE user_id = ?");
$user_query->bind_param("i", $user_id);
$user_query->execute();
$user_result = $user_query->get_result();
$user = $user_result->fetch_assoc();

$full_name = trim(($user['first_name'] ?? '') . ' ' . ($user['middle_name'] ?? '') . ' ' . ($user['last_name'] ?? ''));
$email = $user['email'] ?? '';

// Fetch doctors
$doctor_sql = "SELECT * FROM employees WHERE department = ?";
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
/* General styling */
.submit-btn { padding:12px 20px; background:#002060; color:#fff; border:none; border-radius:8px; font-weight:bold; cursor:pointer; }
.submit-btn:hover { background:#001040; }

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

.time-btn { background-color:#F0F8FF; border-radius:5px; border:1px solid #ccc; padding:10px; cursor:pointer; margin-bottom:5px; }
.time-btn:hover { background-color:#003080; color:#fff; }
.time-btn.active { background-color:#002060; color:#fff; font-weight:bold; }
.time-btn.disabled { background-color:#ccc !important; color:#666 !important; cursor:not-allowed !important; }

/* Tooltip styling */
#vetTooltip {
    position:absolute;
    display:none;
    background:#F8F8F8;
    border:1px solid #ccc;
    padding:10px;
    border-radius:5px;
    white-space:pre-line;
    z-index:1000;
    max-width:250px;
    box-shadow:0px 2px 5px rgba(0,0,0,0.2);
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

<!-- Owner Info -->
<div class="section owner-pet">
<div class="section-header">Owner Information</div>
<div class="form-row">
<input type="tel" name="phone" placeholder="Phone Number *" required style="width:98%;">

<!-- Veterinarian Select -->
<select name="vetdoc_id" id="vetdoc" required>
    <option value="">Select Veterinarian *</option>
    <?php
    while($doctor = $doctor_result->fetch_assoc()){
        $doc_full_name = trim($doctor['first_name'].' '.$doctor['middle_name'].' '.$doctor['last_name']);
        $credentials = "Full Name: {$doc_full_name}\nGender: {$doctor['gender']}\nEmail: {$doctor['contact_email']}\nPhone: {$doctor['phone_number']}\nAddress: {$doctor['address']}";
        echo '<option value="'.htmlspecialchars($doctor['employee_id']).'" data-credentials="'.htmlspecialchars($credentials).'">Dr. '.htmlspecialchars($doc_full_name).'</option>';
    }
    ?>
</select>
<div id="vetTooltip"></div>
</div>

<!-- Pet Selection -->
<div class="form-row">
<p><strong>Status</strong></p>
<label><input type="radio" name="status" value="existing" checked> Existing Pet</label>
<label><input type="radio" name="status" value="new"> New Pet</label>

<select id="petDropdown" name="pet_name" required>
    <option value="">Select Pet *</option>
    <?php
    $conn_pet = new mysqli('localhost','root','','appointment_sia');
    $pet_stmt = $conn_pet->prepare("SELECT id, pet_name FROM mypet WHERE user_id=?");
    $pet_stmt->bind_param("i",$user_id);
    $pet_stmt->execute();
    $pet_result = $pet_stmt->get_result();
    while($pet = $pet_result->fetch_assoc()){
        echo '<option value="'.htmlspecialchars($pet['pet_name']).'">'.htmlspecialchars($pet['pet_name']).'</option>';
    }
    $conn_pet->close();
    ?>
</select>
<button type="button" id="addPetBtn" class="add-pet-btn">Add Pet</button>
</div>
</div>
<br>
<br>
<!-- Appointment Details -->
<div class="section appointment-details">
<div class="section-header">Appointment Details</div>
<div class="form-row">
<div id="timeButtonsContainer" style="display:flex; flex-direction:column; gap:10px;">
<input id="timeInput" name="time" readonly placeholder="Select Time *" required style="width:100%; padding:10px; border-radius:10px; border:1px solid #ccc; background-color:#F0F8FF;">
<button type="button" class="time-btn" value="09:00:00">9AM - 10AM</button>
<button type="button" class="time-btn" value="10:00:00">10AM - 11AM</button>
<button type="button" class="time-btn" value="13:00:00">1PM - 2PM</button>
<button type="button" class="time-btn" value="14:00:00">2PM - 3PM</button>
<button type="button" class="time-btn" value="15:00:00">3PM - 4PM</button>
<button type="button" class="time-btn" value="16:00:00">4PM - 5PM</button>
</div>

<input type="date" name="date" id="appointmentDate" style="height:44px;" required>

<select name="service" required style="width:100%; height:44px;">
<option value="">Select Service *</option>
<?php
$app_conn = new mysqli('localhost','root','','appointment_sia');
$service_result = $app_conn->query("SELECT service_name, price FROM type_of_service");
while($service = $service_result->fetch_assoc()){
    echo '<option value="'.htmlspecialchars($service['service_name'].'|'.$service['price']).'">'.htmlspecialchars($service['service_name'].' - ₱'.$service['price']).'</option>';
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
const timeButtons = document.querySelectorAll('.time-btn');
const vetdocSelect = document.getElementById('vetdoc');
const vetdocNameInput = document.createElement('input'); // optional hidden if needed
const appointmentDate = document.getElementById('appointmentDate');
const vetTooltip = document.getElementById('vetTooltip');

// Handle status change
statusRadios.forEach(radio => {
    radio.addEventListener("change", () => {
        if(radio.value === "new" && radio.checked){
            petDropdown.style.display="none";
            petDropdown.removeAttribute("required");
            addPetBtn.style.display="inline-block";
        } else {
            petDropdown.style.display="block";
            petDropdown.setAttribute("required",true);
            addPetBtn.style.display="none";
        }
    });
});

// Add Pet button
addPetBtn.addEventListener("click",()=>{ window.location.href="/appointment/Book_appointment_add_pet.php"; });

// Time button selection
timeButtons.forEach(button => {
    button.addEventListener('click', ()=>{
        timeButtons.forEach(btn=>btn.classList.remove('active'));
        button.classList.add('active');
        timeInput.value = button.value;
    });
});

// Set min date
const today = new Date().toISOString().split('T')[0];
appointmentDate.setAttribute('min', today);

// Tooltip hover
vetdocSelect.addEventListener('mousemove', e=>{
    const option = vetdocSelect.options[vetdocSelect.selectedIndex];
    if(option && option.dataset.credentials){
        vetTooltip.style.display='block';
        vetTooltip.textContent = option.dataset.credentials;
        vetTooltip.style.top = (e.pageY+10)+'px';
        vetTooltip.style.left = (e.pageX+10)+'px';
    }
});
vetdocSelect.addEventListener('mouseleave', ()=>{ vetTooltip.style.display='none'; });

// Fetch booked times (optional if you have fetch_booked.php)
function fetchBookedTimes(){
    const doctorId = vetdocSelect.value;
    const date = appointmentDate.value;
    if(!doctorId || !date) return;

    timeInput.value = "";
    timeButtons.forEach(btn=>{ btn.disabled=false; btn.classList.remove("disabled"); btn.textContent = btn.dataset.text || btn.textContent; });

    fetch(`../php/fetch_booked.php?doctor_id=${doctorId}&date=${date}`)
    .then(res=>res.json())
    .then(bookedTimes=>{
        timeButtons.forEach(btn=>{
            if(bookedTimes.includes(btn.value)){
                btn.disabled=true;
                btn.classList.add("disabled");
                btn.dataset.text = btn.textContent;
                btn.textContent += " (Booked)";
            }
        });
    });
}
vetdocSelect.addEventListener("change", fetchBookedTimes);
appointmentDate.addEventListener("change", fetchBookedTimes);
</script>

</body>
</html>
