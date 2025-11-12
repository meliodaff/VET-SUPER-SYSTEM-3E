<!-- includes/popup.php -->
<?php if (isset($_GET['status'])): ?>
<div id="popup" class="popup">
    <div class="popup-content">

        <?php if ($_GET['status'] === 'added'): ?>
            <div class="icon">🐾</div>
            <h2>Successfully Added</h2>

        <?php elseif ($_GET['status'] === 'updated'): ?>
            <div class="icon">🐾</div>
            <h2>Successfully Updated</h2>

        <?php elseif ($_GET['status'] === 'deleted'): ?>
            <div class="icon">🐾</div>
            <h2>Successfully Deleted</h2>

        <?php elseif ($_GET['status'] === 'cancel'): ?>
            <div class="icon">⚠️</div>
            <h2>Payment Cancelled</h2>
            <p>Your payment was cancelled. You can try again or book later.</p>

        <?php elseif ($_GET['status'] === 'error'): ?>
            <div class="icon">❌</div>
            <h2>Error: Something went wrong!</h2>

        <?php elseif ($_GET['status'] === 'registered'): ?>
            <div class="icon">🎉</div>
            <h2>Registered Successfully</h2>

        <?php elseif ($_GET['status'] === 'reschedule'): ?>
            <div class="icon">🐾</div>
            <h2>Rescheduled Successfully</h2>

        <?php elseif ($_GET['status'] === 'rejected'): ?>
            <div class="icon">🐾</div>
            <h2>Rejected Successfully</h2>
        
        <?php elseif ($_GET['status'] === 'approved'): ?>
            <div class="icon">🐾</div>
            <h2>Approved Successfully</h2>

        <?php elseif ($_GET['status'] === 'done'): ?>
            <div class="icon">🐾</div>
            <h2>Done Successfully</h2>

        <?php elseif ($_GET['status'] === 'canceled'): ?>
            <div class="icon">🐾</div>
            <h2>Successfully Canceled</h2>
        
            
        <?php endif; ?>

        

        

        <a href="#" id="popupCloseBtn" class="btn">OK</a>
    </div>
</div>

<script>
  document.addEventListener("DOMContentLoaded", function() {
    const popup = document.getElementById("popup");
    const closeBtn = document.getElementById("popupCloseBtn");

    closeBtn.addEventListener("click", function(e) {
      e.preventDefault();
      popup.style.display = "none";
    });
  });
</script>
<?php endif; ?>
