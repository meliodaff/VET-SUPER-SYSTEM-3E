<?php
session_start();

// Check if user is logged in
if (!isset($_SESSION['user_id'])) {
  header('Location: login.php');
  exit;
}
?>
<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Security Settings - FUR-EVER CARE</title>
  <link rel="stylesheet" href="css/profile.css">
  <style>
    /* Alert Messages Styling */
    .alert-message {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 16px;
      border-radius: 8px;
      margin-bottom: 20px;
      animation: slideIn 0.3s ease-out;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    }

    .alert-message svg {
      width: 24px;
      height: 24px;
      flex-shrink: 0;
    }

    .alert-message.success {
      background-color: #d4edda;
      border: 1px solid #c3e6cb;
      color: #155724;
    }

    .alert-message.success svg {
      stroke: #28a745;
    }

    .alert-message.error {
      background-color: #f8d7da;
      border: 1px solid #f5c6cb;
      color: #721c24;
    }

    .alert-message.error svg {
      stroke: #dc3545;
    }

    .alert-message span {
      flex: 1;
      font-size: 14px;
      font-weight: 500;
    }

    @keyframes slideIn {
      from {
        opacity: 0;
        transform: translateY(-10px);
      }

      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    /* Button Loading State */
    .save-btn:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }

    /* Password Toggle Button Styling */
    .password-input {
      position: relative;
      display: flex;
      align-items: center;
    }

    .password-input input {
      width: 100%;
      padding-right: 45px !important;
    }

    .toggle-password {
      position: absolute;
      right: 10px;
      background: none;
      border: none;
      cursor: pointer;
      padding: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #666;
      transition: color 0.3s;
      z-index: 10;
    }

    .toggle-password:hover {
      color: #333;
    }

    .toggle-password svg {
      width: 20px;
      height: 20px;
      stroke: currentColor;
      fill: none;
    }
  </style>
</head>

<body>
  <header>
    <nav class="navbar">
      <a href="landing.php" style="text-decoration: none;" class="logo">
        <img src="image/VETERINARY_LOGO_SYSTEM.png" alt="FUR-EVER CARE">
        <span>FUR-EVER CARE</span>
        </div>
        <ul class="nav-links">
          <li><a href="index.php">Home</a></li>
          <li><a href="services.php">Services</a></li>
          <li><a href="#" class="book-now">Book Now</a></li>
          <li class="profile-menu">
            <a href="profile.php" class="profile-icon" title="Go to Profile">
              <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="12" fill="black" />
                <circle cx="12" cy="8" r="4" fill="white" />
                <path d="M12 14c-5 0-8 3-8 6v2h16v-2c0-3-3-6-8-6z" fill="white" />
              </svg>
            </a>
            <ul class="dropdown">
              <li><a href="profile.php">👤 My Profile</a></li>
              <li><a href="dashboard.php">📊 My Dashboard</a></li>
              <li><a href="appointment.php">📅 My Appointment</a></li>
              <li class="logout"><a href="logout.php">🚪 Log Out</a></li>
            </ul>
          </li>
        </ul>
    </nav>
  </header>

  <main class="profile-container">
    <div class="profile-header">
      <h1>My Profile</h1>
      <p class="subtitle">Manage your personal information and account settings</p>
    </div>

    <div class="profile-navigation">
      <a href="profile.php" class="nav-button">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="12" cy="8" r="4" />
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
        </svg>
        Personal Info
      </a>
      <a href="security.php" class="nav-button active">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
          <path d="M7 11V7a5 5 0 0 1 10 0v4" />
        </svg>
        Security
      </a>
    </div>

    <section class="profile-content">
      <div class="section-header">
        <div class="section-title">
          <h2>Security Settings</h2>
          <p>Manage your password and security preferences.</p>
        </div>
      </div>

      <div class="form-content">
        <h3>Change Password</h3>
        <div class="form-group">
          <label for="current-password">Current Password</label>
          <div class="password-input">
            <input type="password" id="current-password" name="current-password" autocomplete="current-password">
            <button type="button" class="toggle-password" aria-label="Show password">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path
                  d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                <line x1="1" y1="1" x2="23" y2="23" />
              </svg>
            </button>
          </div>
        </div>

        <div class="form-group">
          <label for="new-password">New Password</label>
          <div class="password-input">
            <input type="password" id="new-password" name="new-password" autocomplete="new-password">
            <button type="button" class="toggle-password" aria-label="Show password">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path
                  d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                <line x1="1" y1="1" x2="23" y2="23" />
              </svg>
            </button>
          </div>
          <small style="color: #666; font-size: 12px; margin-top: 5px; display: block;">
            Password must be at least 8 characters with uppercase, lowercase, and number
          </small>
        </div>

        <div class="form-group">
          <label for="confirm-password">Confirm New Password</label>
          <div class="password-input">
            <input type="password" id="confirm-password" name="confirm-password" autocomplete="new-password">
            <button type="button" class="toggle-password" aria-label="Show password">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path
                  d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                <line x1="1" y1="1" x2="23" y2="23" />
              </svg>
            </button>
          </div>
        </div>

        <div class="form-actions">
          <button type="submit" class="btn save-btn">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" stroke="white" stroke-width="2"
              viewBox="0 0 24 24">
              <path d="M9 11l3 3L22 4" />
              <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
            </svg>
            Update Password
          </button>
        </div>
      </div>
    </section>
  </main>

  <footer class="main-footer">
    <div class="footer-container">
      <div class="footer-brand">
        <img src="image/VETERINARY_LOGO_SYSTEM.png" alt="Fur-Ever Care Logo" class="footer-logo">
      </div>

      <div class="footer-center">
        <div class="footer-title">
          <h2>FUR-EVER CARE</h2>
          <p>VETERINARY SERVICES</p>
        </div>

        <div class="footer-schedule">
          <h3>SCHEDULE</h3>
          <div class="schedule-card">
            <div class="schedule-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" stroke="#002d72"
                stroke-width="2" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="10" />
                <path d="M12 6v6l4 2" />
              </svg>
            </div>
            <div class="schedule-text">
              <p>9:00 AM - 7:00 PM</p>
            </div>
          </div>
        </div>
      </div>

      <div class="footer-contact">
        <h3>CONTACT INFORMATION</h3>

        <div class="contact-item">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" stroke="white" stroke-width="2"
            viewBox="0 0 24 24">
            <path d="M21 10c0 6-9 13-9 13S3 16 3 10a9 9 0 1118 0z" />
            <circle cx="12" cy="10" r="3" />
          </svg>
          <p>123 Pet Care Avenue<br>Veterinary District, VC 12345</p>
        </div>

        <div class="contact-item">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" stroke="white" stroke-width="2"
            viewBox="0 0 24 24">
            <path
              d="M22 16.92V21a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.11 19.5 19.5 0 01-6-6A19.79 19.79 0 012 4.18 2 2 0 014 2h4.09a2 2 0 012 1.72c.12.81.37 1.61.72 2.34a2 2 0 01-.45 2.11L9 10a16 16 0 006 6l1.83-1.36a2 2 0 012.11-.45c.73.35 1.53.6 2.34.72a2 2 0 011.72 2.01z" />
          </svg>
          <p>(555) 123-PETS</p>
        </div>

        <div class="contact-item">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" stroke="white" stroke-width="2"
            viewBox="0 0 24 24">
            <path d="M4 4h16v16H4z" />
            <path d="M22 6l-10 7L2 6" />
          </svg>
          <p>furevercare@gmail.com</p>
        </div>

        <a href="careers.php" class="contact-item careers">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" stroke="currentColor"
            stroke-width="2" viewBox="0 0 24 24">
            <path
              d="M10 2h4a2 2 0 012 2v2h4a2 2 0 012 2v12a2 2 0 01-2 2H4a2 2 0 01-2-2V8a2 2 0 012-2h4V4a2 2 0 012-2z" />
            <path d="M16 10V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v6" />
          </svg>
          Careers
        </a>
      </div>
    </div>

    <div class="footer-bottom">
      <p>
        <svg class="paw-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
          <path
            d="M226.5 92.9c14.3 42.9-.3 86.2-32.6 96.8s-70.1-15.6-84.4-58.5s.3-86.2 32.6-96.8s70.1 15.6 84.4 58.5zM100.4 198.6c18.9 32.4 14.3 70.1-10.2 84.1s-59.7-.9-78.5-33.3S-2.7 179.3 21.8 165.3s59.7 .9 78.5 33.3zM69.2 401.2C121.6 259.9 214.7 224 256 224s134.4 35.9 186.8 177.2c3.6 9.7 5.2 20.1 5.2 30.5v1.6c0 25.8-20.9 46.7-46.7 46.7c-11.5 0-22.9-1.4-34-4.2l-88-22c-15.3-3.8-31.3-3.8-46.6 0l-88 22c-11.1 2.8-22.5 4.2-34 4.2C84.9 480 64 459.1 64 433.3v-1.6c0-10.4 1.6-20.8 5.2-30.5zM421.8 282.7c-24.5-14-29.1-51.7-10.2-84.1s54-47.3 78.5-33.3s29.1 51.7 10.2 84.1s-54 47.3-78.5 33.3zM310.1 189.7c-32.3-10.6-46.9-53.9-32.6-96.8s52.1-69.1 84.4-58.5s46.9 53.9 32.6 96.8s-52.1 69.1-84.4 58.5z"
            fill="currentColor" />
        </svg>
        All rights reserved (2025)
      </p>
      <a href="privacylogin.php">Privacy Policy</a>
      <p>
        <svg class="paw-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
          <path
            d="M226.5 92.9c14.3 42.9-.3 86.2-32.6 96.8s-70.1-15.6-84.4-58.5s.3-86.2 32.6-96.8s70.1 15.6 84.4 58.5zM100.4 198.6c18.9 32.4 14.3 70.1-10.2 84.1s-59.7-.9-78.5-33.3S-2.7 179.3 21.8 165.3s59.7 .9 78.5 33.3zM69.2 401.2C121.6 259.9 214.7 224 256 224s134.4 35.9 186.8 177.2c3.6 9.7 5.2 20.1 5.2 30.5v1.6c0 25.8-20.9 46.7-46.7 46.7c-11.5 0-22.9-1.4-34-4.2l-88-22c-15.3-3.8-31.3-3.8-46.6 0l-88 22c-11.1 2.8-22.5 4.2-34 4.2C84.9 480 64 459.1 64 433.3v-1.6c0-10.4 1.6-20.8 5.2-30.5zM421.8 282.7c-24.5-14-29.1-51.7-10.2-84.1s54-47.3 78.5-33.3s29.1 51.7 10.2 84.1s-54 47.3-78.5 33.3zM310.1 189.7c-32.3-10.6-46.9-53.9-32.6-96.8s52.1-69.1 84.4-58.5s46.9 53.9 32.6 96.8s-52.1 69.1-84.4 58.5z"
            fill="currentColor" />
        </svg>
      </p>
    </div>
  </footer>

  <script>
    document.addEventListener('DOMContentLoaded', function () {
      // Toggle password visibility
      const toggleButtons = document.querySelectorAll('.toggle-password');
      toggleButtons.forEach(button => {
        button.addEventListener('click', function () {
          const input = this.previousElementSibling;
          const svg = this.querySelector('svg');

          if (input.type === 'password') {
            // Show password - Eye Open icon
            input.type = 'text';
            svg.innerHTML = `
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
              <circle cx="12" cy="12" r="3"/>
            `;
            button.setAttribute('aria-label', 'Hide password');
          } else {
            // Hide password - Eye Closed icon
            input.type = 'password';
            svg.innerHTML = `
              <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
              <line x1="1" y1="1" x2="23" y2="23"/>
            `;
            button.setAttribute('aria-label', 'Show password');
          }
        });
      });

      // Handle form submission
      const saveBtn = document.querySelector('.save-btn');
      saveBtn.addEventListener('click', function (e) {
        e.preventDefault();

        const currentPassword = document.getElementById('current-password').value;
        const newPassword = document.getElementById('new-password').value;
        const confirmPassword = document.getElementById('confirm-password').value;

        // Client-side validation
        if (!currentPassword || !newPassword || !confirmPassword) {
          showMessage('Please fill in all fields', 'error');
          return;
        }

        if (newPassword.length < 8) {
          showMessage('New password must be at least 8 characters long', 'error');
          return;
        }

        // Check password strength
        if (!/[A-Z]/.test(newPassword)) {
          showMessage('Password must contain at least one uppercase letter', 'error');
          return;
        }

        if (!/[a-z]/.test(newPassword)) {
          showMessage('Password must contain at least one lowercase letter', 'error');
          return;
        }

        if (!/[0-9]/.test(newPassword)) {
          showMessage('Password must contain at least one number', 'error');
          return;
        }

        if (newPassword !== confirmPassword) {
          showMessage('New passwords do not match', 'error');
          return;
        }

        if (currentPassword === newPassword) {
          showMessage('New password must be different from current password', 'error');
          return;
        }

        // Disable button to prevent double submission
        saveBtn.disabled = true;
        const originalHTML = saveBtn.innerHTML;
        saveBtn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" stroke="white" stroke-width="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg> Updating...';

        // Send to backend
        const formData = new FormData();
        formData.append('current_password', currentPassword);
        formData.append('new_password', newPassword);

        fetch('change_password.php', {
          method: 'POST',
          body: formData
        })
          .then(response => response.json())
          .then(data => {
            if (data.success) {
              showMessage(data.message, 'success');
              // Clear form
              document.getElementById('current-password').value = '';
              document.getElementById('new-password').value = '';
              document.getElementById('confirm-password').value = '';
            } else {
              showMessage(data.message, 'error');
            }
          })
          .catch(error => {
            showMessage('An error occurred. Please try again.', 'error');
            console.log('Error:', error);
          })
          .finally(() => {
            // Re-enable button
            saveBtn.disabled = false;
            saveBtn.innerHTML = originalHTML;
          });
      });

      // Show message function
      function showMessage(message, type) {
        // Remove existing messages
        const existingMsg = document.querySelector('.alert-message');
        if (existingMsg) {
          existingMsg.remove();
        }

        // Create new message
        const alertDiv = document.createElement('div');
        alertDiv.className = `alert-message ${type}`;
        alertDiv.innerHTML = `
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            ${type === 'success'
            ? '<path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>'
            : '<circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/>'
          }
          </svg>
          <span>${message}</span>
        `;

        const formContent = document.querySelector('.form-content');
        formContent.insertBefore(alertDiv, formContent.firstChild);

        // Scroll to message
        alertDiv.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

        // Auto remove after 5 seconds
        setTimeout(() => {
          alertDiv.remove();
        }, 5000);
      }
    });
  </script>
</body>

</html>
<?php include './includes/chatbot.php'; ?>