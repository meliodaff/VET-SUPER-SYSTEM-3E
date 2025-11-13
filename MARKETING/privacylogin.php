<?php
// Optionally, you can include a PHP session or database connection here to retrieve user information if necessary
// session_start();
// include('db_connection.php');
?>

<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Edit Profile - FUR-EVER CARE</title>
    <link rel="stylesheet" href="css/privacylogin.css">
</head>

<body>
    <header>
        <nav class="navbar">
            <div class="logo">
                <a href="#home" style="text-decoration: none;" class="logo">
                    <img src="image/VETERINARY_LOGO_SYSTEM.png" alt="FUR-EVER CARE">
                    <span>FUR-EVER CARE</span>
                </a>
            </div>
            <ul class="nav-links">
                <li><a href="index.php">Home</a></li>
                <li><a href="#services">Services</a></li>
                <li><a href="#" class="book-now">Book Now</a></li>

                <li class="profile-menu">
                    <a href="#" class="profile-icon" title="Go to Profile">
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
                        <li class="logout"><a href="index.php">🚪 Log Out</a></li>
                    </ul>
                </li>
            </ul>
        </nav>
    </header>


    <main class="privacy-content">
        <div class="privacy-container">
            <h1>Privacy Policy</h1>
            <p class="last-updated">Last Updated: September 2025</p>

            <p class="intro">At Fur-ever Care Veterinary Services, we are committed to protecting the privacy of our
                clients and their pets. This Privacy Policy outlines how we collect, use, and safeguard your personal
                information.</p>

            <section class="privacy-section">
                <h2>1. Information We Collect</h2>
                <p>We collect information you provide, such as:</p>
                <ul>
                    <li>Contact details (name, email, phone number, address)</li>
                    <li>Pet information (name, breed, medical history)</li>
                    <li>Payment details for services</li>
                </ul>
            </section>

            <section class="privacy-section">
                <h2>2. How We Use Your Information</h2>
                <p>We use your information to:</p>
                <ul>
                    <li>Provide veterinary care and manage appointments</li>
                    <li>Process payments and communicate with you</li>
                    <li>Improve our services and website functionality</li>
                    <li>Schedule and manage appointments</li>
                </ul>
            </section>

            <section class="privacy-section">
                <h2>3. Sharing Information</h2>
                <p>We do not sell or share your personal information with third parties, except:</p>
                <ul>
                    <li>With your consent</li>
                    <li>To comply with legal obligations</li>
                    <li>With trusted service providers (e.g., payment processors) who follow strict privacy standards
                    </li>
                </ul>
            </section>

            <section class="privacy-section">
                <h2>4. Data Security</h2>
                <p>We use secure systems and encryption to protect your information. However, no system is completely
                    risk-free, and we work hard to keep your data safe.</p>
            </section>

            <section class="privacy-section">
                <h2>5. Your Rights</h2>
                <p>You may:</p>
                <ul>
                    <li>Request access to or correction of your information</li>
                    <li>Ask us to delete your data</li>
                    <li>Opt out of marketing communications</li>
                </ul>
            </section>

            <section class="privacy-section">
                <h2>6. Changes to This Policy</h2>
                <p>We may update this policy as needed. Changes will be posted on our website with the updated effective
                    date.</p>
            </section>
        </div>
    </main>

    <section class="meet-us">
        <div class="meet-us-container">
            <h2>Ready to Meet Us?</h2>
            <p>We'd love to meet you and your furry family member! Schedule a visit today.</p>

            <div class="contact-cards">
                <div class="contact-info-card">
                    <div class="card-icon">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" />
                        </svg>
                    </div>
                    <h3>Location</h3>
                    <p>123 Pet Care Avenue<br>Veterinary District, VC<br>12345</p>
                </div>

                <div class="contact-info-card">
                    <div class="card-icon">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path
                                d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.362 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.338 1.85.573 2.81.7A2 2 0 0122 16.92z" />
                        </svg>
                    </div>
                    <h3>Contact</h3>
                    <p>(555) 123-PETS</p>
                </div>

                <div class="contact-info-card">
                    <div class="card-icon">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <rect x="2" y="4" width="20" height="16" rx="2" />
                            <path d="M2 8l10 6 10-6" />
                        </svg>
                    </div>
                    <h3>Email</h3>
                    <p>furevercare@gmail.com</p>
                </div>
            </div>

            <a href="#" class="schedule-visit-btn">Schedule Your Pet's Visit Today</a>
        </div>
    </section>

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
                            <p>Mon-Fri: 8:
                                <?php include './includes/chatbot.php'; ?>