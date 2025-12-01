<?php
require_once '../includes/session_id.php';
require_once '../includes/db.php';

// Get pet ID from query
if (!isset($_GET['pet_id'])) {
    header("Location: ../client_page/Book_appointment_my_pet.php");
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
    header("Location: ../client_page/Book_appointment_my_pet.php");
    exit;
}
?>

<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Edit Pet</title>
<link rel="stylesheet" href="../styles/Book_appointment_add_pet.css">
<link rel="stylesheet" href="../styles/popup.css">
<link rel="stylesheet" href="../../../MARKETING/css/generalfooter.css">
</head>

<!-- popup -->
<?php include '../php/popup.php'; ?>

<body>
<!-- Header -->
<?php include '../header_footer/Header/Header.php'; ?>

<main>
  <div class="container">
    <div class="add-pet-form-wrapper">
      <h1>Edit Pet</h1>
      <form action="../php/edit_pet.php" method="POST" enctype="multipart/form-data" class="add-pet-form">
        <input type="hidden" name="pet_id" value="<?php echo $pet['id']; ?>">

        <!-- Pet Name -->
        <div class="form-group">
          <label for="pet_name">Pet Name</label>
          <input type="text" id="pet_name" name="pet_name" 
                 value="<?php echo htmlspecialchars($pet['pet_name']); ?>" required>
        </div>

        <!-- Pet Image -->
        <div class="form-group">
          <label for="pet_image">Pet Image</label>
          <input type="file" id="pet_image" name="pet_image" accept="image/*">
        </div>

        <!-- Image Preview -->
        <div class="image-preview">
          <img src="../uploads/pets/<?php echo htmlspecialchars($pet['pet_image']); ?>" alt="Pet Image" width="300">
        </div>

        <!-- Species -->
        <div class="form-group">
          <label for="species">Species</label>
          <select id="species" name="species" onchange="toggleSpecies()" required>
            <option value="">Select Species</option>
            <?php 
            $speciesList = ["Dog","Cat","Bird","Rabbit","Hamster","Turtle","Fish","Reptile"];
            foreach($speciesList as $s) {
                $selected = ($pet['species'] === $s) ? 'selected' : '';
                echo "<option value='$s' $selected>$s</option>";
            }
            $isOtherSpecies = !in_array($pet['species'], $speciesList);
            echo "<option value='Other' ".($isOtherSpecies ? 'selected' : '').">Other</option>";
            ?>
          </select>
          <input type="text" id="otherSpecies" name="other_species" placeholder="Specify species"
                 value="<?php echo $isOtherSpecies ? htmlspecialchars($pet['species']) : ''; ?>" style="display:none;">
        </div>

        <!-- Breed -->
        <div class="form-group">
          <label for="breed">Breed</label>
          <select id="breed" name="breed" required></select>
          <input type="text" id="otherBreed" name="other_breed" placeholder="Specify breed"
                 value="<?php echo (!in_array($pet['breed'], [
                   "Shih Tzu","Labrador","Pomeranian","German Shepherd","Golden Retriever",
                   "Persian","Siamese","Ragdoll","Domestic Shorthair",
                   "Parrot","Lovebird","Cockatiel",
                   "Holland Lop","Netherland Dwarf",
                   "Syrian","Dwarf","Roborovski",
                   "Red-Eared Slider","Box Turtle",
                   "Goldfish","Betta","Guppy",
                   "Iguana","Snake","Gecko"
                 ])) ? htmlspecialchars($pet['breed']) : ''; ?>" style="display:none;">
        </div>

        <!-- Age -->
        <div class="form-group">
          <label for="age">Age</label>
          <input type="number" id="age" name="age" min="0" value="<?php echo (int)$pet['age']; ?>" required>
        </div>

        <!-- Submit -->
        <button type="submit"
                class="submit-btn open-confirmation"
                data-action="save changes"
                data-name="<?php echo htmlspecialchars($pet['pet_name']); ?>">
          Edit Pet
        </button>
      </form>

      <!-- Cancel Button -->
      <button type="button" style="width:100%; height:40px; border-radius: 20px; margin-top:10px;
        background-color: #002060; color: white; font-weight: bold; font-size:15px;"
        onclick="window.location.href='Book_appointment_my_pet.php'">
        Cancel
      </button>
    </div>
  </div>
</main>

<!-- Footer -->
<?php include '../../../MARKETING/generalfooter.php'; ?>
<?php include '../php/confirmation.php'; ?>

<!-- JS -->
<script>
// Breed options
const breedOptions = {
  Dog: ["Shih Tzu","Labrador","Pomeranian","German Shepherd","Golden Retriever"],
  Cat: ["Persian","Siamese","Ragdoll","Domestic Shorthair"],
  Bird: ["Parrot","Lovebird","Cockatiel"],
  Rabbit: ["Holland Lop","Netherland Dwarf"],
  Hamster: ["Syrian","Dwarf","Roborovski"],
  Turtle: ["Red-Eared Slider","Box Turtle"],
  Fish: ["Goldfish","Betta","Guppy"],
  Reptile: ["Iguana","Snake","Gecko"],
  Other: []
};

// Update breed dropdown
function updateBreeds() {
  const species = document.getElementById("species").value;
  const breed = document.getElementById("breed");
  breed.innerHTML = "<option value=''>Select Breed</option>";

  if (breedOptions[species]) {
    breedOptions[species].forEach(b => {
      const option = document.createElement("option");
      option.value = b;
      option.textContent = b;
      if (b === "<?php echo htmlspecialchars($pet['breed']); ?>") option.selected = true;
      breed.appendChild(option);
    });
  }
}

// Show/hide Other fields
function toggleSpecies() {
  const species = document.getElementById("species").value;
  const breedDropdown = document.getElementById("breed");
  const otherSpeciesField = document.getElementById("otherSpecies");
  const otherBreedField = document.getElementById("otherBreed");

  if (species === "Other") {
    otherSpeciesField.style.display = "block";
    otherSpeciesField.required = true;

    breedDropdown.style.display = "none";
    breedDropdown.required = false;

    otherBreedField.style.display = "block";
    otherBreedField.required = true;
  } else {
    otherSpeciesField.style.display = "none";
    otherSpeciesField.required = false;

    breedDropdown.style.display = "block";
    breedDropdown.required = true;

    otherBreedField.style.display = "none";
    otherBreedField.required = false;

    updateBreeds();
  }
}

// Initialize
updateBreeds();
toggleSpecies();

// Event listener
document.getElementById("species").addEventListener("change", updateBreeds);
document.getElementById("species").addEventListener("change", toggleSpecies);

// Confirmation popup
document.querySelectorAll(".open-confirmation").forEach(btn => {
  btn.addEventListener("click", function(e) {
    e.preventDefault();
    const action = this.getAttribute("data-action");
    const name = this.getAttribute("data-name");
    const form = this.closest("form");
    openConfirmation(action, name, () => {
      form.submit();
    });
  });
});
</script>
</body>
</html>
