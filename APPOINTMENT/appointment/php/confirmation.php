<!-- Confirmation Popup -->
<div id="confirmationPopup" class="popup" style="display:none;">
  <div class="popup-content">
    <div class="icon">⚠️</div>
    <h2 id="confirmationMessage">Are you sure?</h2>
    <div class="actions">
      <a href="#" id="confirmYes" class="btn danger">Yes</a>
      <a href="#" id="confirmNo" class="btn">Cancel</a>
    </div>
  </div>
</div>

<script>
  let onConfirmCallback = null;

  // Open confirmation popup dynamically
  function openConfirmation(action, data, callback) {
    const popup = document.getElementById("confirmationPopup");
    const msg = document.getElementById("confirmationMessage");
    onConfirmCallback = callback; // save the callback

    msg.textContent = `Are you sure you want to ${action} ${data}?`;
    popup.style.display = "flex";
  }

  // Handle confirm
  document.getElementById("confirmYes").addEventListener("click", function(e) {
    e.preventDefault();
    document.getElementById("confirmationPopup").style.display = "none";
    if (onConfirmCallback) {
      onConfirmCallback(); // call the callback, e.g., submit the form
    }
  });

  // Handle cancel
  document.getElementById("confirmNo").addEventListener("click", function(e) {
    e.preventDefault();
    document.getElementById("confirmationPopup").style.display = "none";
  });
</script>
