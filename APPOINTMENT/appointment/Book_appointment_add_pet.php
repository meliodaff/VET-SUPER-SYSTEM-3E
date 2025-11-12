<?php

?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
    <link rel="stylesheet" href="/appointment/styles/Book_appointment_add_pet.css">
    <link rel="stylesheet" href="/appointment/styles/popup.css">
</head>

<!-- popup -->
<?php include 'php/popup.php'; ?>


<body>
  <!-- Header -->
    <?php include 'header_footer/Header/Header.php'; ?>

          <!-- Add Pet Form Page --> 
          <!--main-->
          <main> 
              <div class="container"> 
                  <div class="add-pet-form-wrapper"> 
                      <h1>Add Pet</h1> 
                      <form action="php/add_pet.php" method="POST" enctype="multipart/form-data" class="add-pet-form"> 
                          <div class="form-group">
                              <label for="pet_name">Pet Name</label>
                              <input type="text" id="pet_name" name="pet_name" required>
                          </div>
                          <div class="form-group">
                              <label for="pet_image">Pet Image</label>
                              <input type="file" id="pet_image" name="pet_image" accept="image/*" required>
                          </div>
                          <div class="form-group">
                              <label for="species">Species</label>
                              <input type="text" id="species" name="species" required>
                          </div>
                          <div class="form-group">
                              <label for="breed">Breed</label>
                              <input type="text" id="breed" name="breed" required>
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


    <!-- Footer -->
  <iframe src="header_footer/footer/Footer.html" style="width:100%; height:523px; border:none;"></iframe>
</body>
</html>