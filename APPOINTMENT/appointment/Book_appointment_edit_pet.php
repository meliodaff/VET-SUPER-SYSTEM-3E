<?php
  require_once 'includes/session_id.php';
  require_once 'includes/db.php';

  // Get pet ID from query
  if (!isset($_GET['pet_id'])) {
      header("Location: ../Book_appointment_my_pet.php");
      exit;
  }

  $pet_id = (int)$_GET['pet_id'];
  $user_id = $_SESSION['user_id'];

  // Fetch pet details
  $stmt = $conn->prepare("SELECT * FROM mypet WHERE id = ? AND user_id = ?");
  $stmt->bind_param("ii", $pet_id, $user_id);
  $stmt->execute();
  $result = $stmt->get_result();
  $pet = $result->fetch_assoc();

  if (!$pet) {
      header("Location: ../Book_appointment_my_pet.php");
      exit;
  }
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Edit Pet</title>
    <link rel="stylesheet" href="/appointment/styles/Book_appointment_add_pet.css">
    <link rel="stylesheet" href="/appointment/styles/popup.css">
</head>


<!-- popup -->
<?php include 'php/popup.php'; ?>


<body>
  <!-- Header -->
  <?php include 'header_footer/Header/Header.php'; ?>

  <!-- Edit Pet Form Page -->
  <main>
    <div class="container">
      <div class="add-pet-form-wrapper">
        <h1>Edit Pet</h1>
        <form action="php/edit_pet.php" method="POST" enctype="multipart/form-data" class="add-pet-form">
            <input type="hidden" name="pet_id" value="<?php echo $pet['id']; ?>">

            <div class="form-group">
                <label for="pet_name">Pet Name</label>
                <input type="text" id="pet_name" name="pet_name" 
                       value="<?php echo htmlspecialchars($pet['pet_name']); ?>" required>
            </div>

            <div class="form-group">
                <label for="pet_image">Pet Image</label>
                <input type="file" id="pet_image" name="pet_image" accept="image/*">
            </div>

            <div class="image-preview">
                <img src="uploads/pets/<?php echo htmlspecialchars($pet['pet_image']); ?>" alt="Pet Image" width="300">
            </div>

            <div class="form-group">
                <label for="species">Species</label>
                <input type="text" id="species" name="species" 
                       value="<?php echo htmlspecialchars($pet['species']); ?>" required>
            </div>

            <div class="form-group">
                <label for="breed">Breed</label>
                <input type="text" id="breed" name="breed" 
                       value="<?php echo htmlspecialchars($pet['breed']); ?>" required>
            </div>

            <div class="form-group">
                <label for="age">Age</label>
                <input type="number" id="age" name="age" min="0" 
                       value="<?php echo (int)$pet['age']; ?>" required>
            </div>

            <button type="submit"
                    class="submit-btn open-confirmation"
                    data-action="save changes"
                    data-name="<?php echo htmlspecialchars($pet['pet_name']); ?>">
                Edit Pet
            </button>
        </form>
                 <button type="submit" style="width:100%; height:40px; border-radius: 20px; margin-top:10px;
        background-color: #002060; color: white; font-weight: bold; font-size:15px;
       " onclick="window.location.href='Book_appointment_my_pet.php'">
            Cancel
        </button>
      </div>
        
    </div>
  </main>

  <!-- Footer -->
  <iframe src="header_footer/footer/Footer.html" style="width:100%; height:523px; border:none;"></iframe>


   <!-- Confirmation Popup (reusable) -->
  <?php include 'php/confirmation.php'; ?>


  <!-- Script -->
  <script>
    document.querySelectorAll(".open-confirmation").forEach(btn => {
      btn.addEventListener("click", function(e) {
        e.preventDefault();
        const action = this.getAttribute("data-action");
        const name = this.getAttribute("data-name");
        const form = this.closest("form"); // get the form element

        // Open the confirmation popup and submit form on confirm
        openConfirmation(action, name, () => {
          form.submit(); // submits the form to edit_pet.php
        });
      });
    });
  </script>


</body>
</html>
