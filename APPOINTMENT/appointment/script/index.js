document.addEventListener('DOMContentLoaded', function() {
  const loginBtn = document.getElementById('loginBtn');
  const loginPopup = document.getElementById('loginPopup');
  const adminBtn = document.getElementById('adminBtn');

  loginBtn.addEventListener('click', function(e) {
    const rect = loginBtn.getBoundingClientRect();
    loginPopup.style.position = 'absolute';
    loginPopup.style.left = rect.left + 'px';
    loginPopup.style.top = (rect.bottom + window.scrollY + 10) + 'px';
    loginPopup.style.display = loginPopup.style.display === 'none' || loginPopup.style.display === '' ? 'flex' : 'none';
  });

  document.addEventListener('mousedown', function(e) {
    if (!loginPopup.contains(e.target) && e.target !== loginBtn) {
      loginPopup.style.display = 'none';
    }
  });

});

document.addEventListener('DOMContentLoaded', function() {
  const adminBtn = document.getElementById('adminBtn');
  const overlay = document.getElementById('overlay');
  const closeBtn = document.getElementById('closeBtn');
    const loginForm = document.querySelector('.login-form');


  // Show popup
  adminBtn.addEventListener('click', function() {
    overlay.style.display = 'flex';
  });

  // Close popup with X button
  closeBtn.addEventListener('click', function() {
    overlay.style.display = 'none';
  });

  // Close popup if clicking outside the form
  overlay.addEventListener('click', function(e) {
    if (e.target === overlay) {
      overlay.style.display = 'none';
    }
  });

});

document.addEventListener("DOMContentLoaded", () => {
  const viewBtn = document.getElementById("viewDetailsBtn");
  const overlay = document.getElementById("overlay");
  const updatePopup = document.getElementById("updatePopup");
  const closePopup = document.getElementById("closePopup");

  const editBtn = document.getElementById("editBtn");
  const saveBtn = document.getElementById("saveBtn");
  const cancelBtn = document.getElementById("cancelBtn");
  const inputs = document.querySelectorAll("#updateForm input");

  const confirmPopup = document.getElementById("confirmPopup");
  const yesBtn = document.getElementById("yesBtn");
  const noBtn = document.getElementById("noBtn");

  // Show popup
  viewBtn.addEventListener("click", () => {
    overlay.style.display = "block";
    updatePopup.style.display = "block";
  });

  // Close popup
  closePopup.addEventListener("click", () => {
    overlay.style.display = "none";
    updatePopup.style.display = "none";
  });

  // Enable fields for editing
  editBtn.addEventListener("click", () => {
    inputs.forEach(input => {
      input.disabled = false;
      input.required = true;
    });
    editBtn.style.display = "none";
    saveBtn.style.display = "inline-block";
    cancelBtn.style.display = "inline-block";
  });

  // Cancel editing
  cancelBtn.addEventListener("click", () => {
    overlay.style.display = "none";
    updatePopup.style.display = "none";
  });

  // Save -> Show confirmation
  document.getElementById("updateForm").addEventListener("submit", e => {
    e.preventDefault();
    confirmPopup.style.display = "block";
  });

  // Yes -> Save changes, disable fields again
  yesBtn.addEventListener("click", () => {
    confirmPopup.style.display = "none";
    inputs.forEach(input => {
      input.disabled = true;
    });
    saveBtn.style.display = "none";
    cancelBtn.style.display = "none";
    editBtn.style.display = "inline-block";
  });

  // No -> Close confirmation only
  noBtn.addEventListener("click", () => {
    confirmPopup.style.display = "none";
  });
});


// Logout popup logic
document.addEventListener("DOMContentLoaded", () => {
  const userIcon = document.querySelector(".user-icon");
  const logoutPopup = document.querySelector(".logout-popup");
  const logoutBtn = document.getElementById("logoutBtn");

  const logoutConfirmPopup = document.getElementById("logoutConfirmPopup");
  const logoutYesBtn = document.getElementById("logoutYesBtn");
  const logoutNoBtn = document.getElementById("logoutNoBtn");

  // Show/hide logout popup on user icon click
  userIcon.addEventListener("click", () => {
    logoutPopup.style.display = 
      logoutPopup.style.display === "block" ? "none" : "block";
  });

  // When logout button clicked → show confirmation popup
  logoutBtn.addEventListener("click", () => {
    logoutConfirmPopup.style.display = "block";
  });

  // YES → go to index.html
  logoutYesBtn.addEventListener("click", () => {
    window.location.href = "index.html";
  });

  // NO → hide both popups
  logoutNoBtn.addEventListener("click", () => {
    logoutConfirmPopup.style.display = "none";
    logoutPopup.style.display = "none";
  });
});

