<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
    <link rel="stylesheet" href="../styles/Book_appointment_add_pet.css">
    <link rel="stylesheet" href="../styles/popup.css">

        <link rel="stylesheet" href="../../../MARKETING/css/generalfooter.css">

</head>

<!-- popup -->
<?php include '../php/popup.php'; ?>


<body>
  <!-- Header -->
    <?php include '../header_footer/Header/Header.php'; ?>

          <!-- Add Pet Form Page --> 
          <!--main-->
          <main> 
              <div class="container"> 
                  <div class="add-pet-form-wrapper"> 
                      <h1>Add Pet</h1> 
                      <form action="../php/add_pet.php" method="POST" enctype="multipart/form-data" class="add-pet-form"> 
                          <div class="form-group">
                              <label for="pet_name">Pet Name</label>
                              <input type="text" id="pet_name" name="pet_name" required>
                          </div>
                          <div class="form-group">
                              <label for="pet_image">Pet Image</label>
                              <input type="file" id="pet_image" name="pet_image" accept="image/*" required>
                          </div>
                            <!-- Species -->
                            <div class="form-group">
                                <label for="species">Species</label>
                                <select id="species" name="species" onchange="toggleSpecies()" required>
                                    <option value="">Select Species</option>
                                    <option value="Dog">Dog</option>
                                    <option value="Cat">Cat</option>
                                    <option value="Bird">Bird</option>
                                    <option value="Rabbit">Rabbit</option>
                                    <option value="Hamster">Hamster</option>
                                    <option value="Turtle">Turtle</option>
                                    <option value="Fish">Fish</option>
                                    <option value="Reptile">Reptile</option>
                                    <option value="Other">Other</option>
                                </select>

                                <!-- Other Species Input -->
                                <input type="text" id="otherSpecies" name="other_species" placeholder="Specify species" style="display:none;">
                            </div>

                            <!-- Breed -->
                            <div class="form-group">
                                <label for="breed">Breed</label>

                                <!-- Breed Dropdown -->
                                <select id="breed" name="breed" required>
                                    <option value="">Select Breed</option>
                                </select>

                                <!-- Other Breed Input -->
                                <input type="text" id="otherBreed" name="other_breed" placeholder="Specify breed" style="display:none;">
                            </div>
                          <div class="form-group">
                              <label for="age">Age</label>
                              <input type="number" id="age" name="age" min="0" required>
                          </div>
                          <button type="submit" class="submit-btn">+ Add Pet</button> 
                      </form> 
                                    <!-- Buttons back-->
       <button type="submit" style="width:100%; height:40px; border-radius: 15px; margin-top:10px;
        background-color: #002060; color: white; font-weight: bold; font-size:15px;
       " onclick="window.location.href='Book_appointment_my_pet.php'">
            Cancel
        </button>
                  </div> 
              </div> 
          </main> 


   <script>
// Breed list based on species
const breedOptions = {
    Dog: ["Shih Tzu", "Labrador", "Pomeranian", "German Shepherd", "Golden Retriever"],
    Cat: ["Persian", "Siamese", "Ragdoll", "Domestic Shorthair"],
    Bird: ["Parrot", "Lovebird", "Cockatiel"],
    Rabbit: ["Holland Lop", "Netherland Dwarf"],
    Hamster: ["Syrian", "Dwarf", "Roborovski"],
    Turtle: ["Red-Eared Slider", "Box Turtle"],
    Fish: ["Goldfish", "Betta", "Guppy"],
    Reptile: ["Iguana", "Snake", "Gecko"],
    Other: []
};

// Update breed list when species changes
function updateBreeds() {
    const species = document.getElementById("species").value;
    const breed = document.getElementById("breed");

    breed.innerHTML = "<option value=''>Select Breed</option>";

    if (breedOptions[species]) {
        breedOptions[species].forEach(b => {
            const option = document.createElement("option");
            option.value = b;
            option.textContent = b;
            breed.appendChild(option);
        });
    }
}

// Show/hide input fields when species = Other
function toggleSpecies() {
    const species = document.getElementById("species").value;

    const breedDropdown = document.getElementById("breed");
    const otherSpeciesField = document.getElementById("otherSpecies");
    const otherBreedField = document.getElementById("otherBreed");

    if (species === "Other") {
        otherSpeciesField.style.display = "block";
        otherSpeciesField.required = true;

        breedDropdown.style.display = "none";
        breedDropdown.required = false; // IMPORTANT FIX

        otherBreedField.style.display = "block";
        otherBreedField.required = true;

    } else {
        otherSpeciesField.style.display = "none";
        otherSpeciesField.required = false;

        breedDropdown.style.display = "block";
        breedDropdown.required = true; // RESTORE REQUIRED

        otherBreedField.style.display = "none";
        otherBreedField.required = false;

        updateBreeds();
    }
}

document.getElementById("species").addEventListener("change", updateBreeds);
</script>


    <!-- Footer -->
  <?php
    include '../../../MARKETING/generalfooter.php';
  ?></body>
</html>