<?php
  require_once '../includes/session_id.php';
  require_once '../includes/db.php';

  // Fetch pets for logged-in user
  $sql = "SELECT id, pet_name, pet_image, species, breed, month, year FROM mypet WHERE user_id = ?";
  $stmt = $conn->prepare($sql);
  $stmt->bind_param("i", $user_id);
  $stmt->execute();
  $result = $stmt->get_result();
  $pets = $result->fetch_all(MYSQLI_ASSOC);
  $stmt->close();
?>

<!-- popup -->
<?php include '../php/popup.php'; ?>

<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>My Pets</title>
  <link rel="stylesheet" href="../styles/Book_appointment_my_pet.css" />
  <link rel="stylesheet" href="/appointment/styles/popup.css">
  <link rel="stylesheet" href="../../../MARKETING/css/generalfooter.css">
</head>
<body>
  <!-- header-->
  <?php include '../header_footer/Header/Header.php'; ?>

  <!-- Main content -->
  <main>
    <div class="container">
      <div class="pets-header">
        <h1>My Pets</h1>
        <button class="add-pet" onclick="window.location.href='Book_appointment_add_pet.php'">
          + Add Pet
        </button>
      </div>

      <div class="pets-list">
        <?php if (!empty($pets)): ?>
          <?php foreach ($pets as $pet): ?>
            <div class="pet-card">
              <div class="pet-image">
                <img src="../uploads/pets/<?php echo htmlspecialchars($pet['pet_image']); ?>" 
                     alt="<?php echo htmlspecialchars($pet['pet_name']); ?>" />
              </div>

              <div class="pet-info">
                <h3><?php echo htmlspecialchars($pet['pet_name']); ?></h3>
                <p><strong>Species:</strong> <?php echo htmlspecialchars($pet['species']); ?></p>
                <p><strong>Breed:</strong> <?php echo htmlspecialchars($pet['breed']); ?></p>

                <!-- UPDATED AGE DISPLAY -->
                <p><strong>Age:</strong>
                  <?php echo (int)$pet['year']; ?> 
                  year<?php echo ((int)$pet['year'] != 1) ? 's' : ''; ?>,
                  <?php echo (int)$pet['month']; ?>
                  month<?php echo ((int)$pet['month'] != 1) ? 's' : ''; ?>
                </p>
              </div>

              <div class="pet-actions">
                <!-- Edit -->
                <a href="Book_appointment_edit_pet.php?pet_id=<?php echo (int)$pet['id']; ?>">
                  Edit
                </a>

                <!-- Delete -->
                <a href="../php/delete_pet.php?pet_id=<?php echo (int)$pet['id']; ?>"
                  class="open-confirmation"
                  data-action="delete"
                  data-name="<?php echo htmlspecialchars($pet['pet_name']); ?>">
                  Delete
                </a>
              </div>

            </div>
          <?php endforeach; ?>
        <?php else: ?>
          <p>You have no pets added yet.</p>
        <?php endif; ?>
      </div>
    </div>
  </main>

  <!-- Confirmation Popup -->
  <?php include '../php/confirmation.php'; ?>

  <!-- Script -->
  <script>
    document.querySelectorAll(".open-confirmation").forEach(link => {
      link.addEventListener("click", function(e) {
        e.preventDefault();
        const action = this.getAttribute("data-action");
        const name = this.getAttribute("data-name");
        const url = this.getAttribute("href");

        openConfirmation(action, name, function() {
          window.location.href = url; 
        });
      });
    });
  </script>

  <!-- footer-->
  <?php include '../../../MARKETING/generalfooter.php'; ?>
</body>
</html>
