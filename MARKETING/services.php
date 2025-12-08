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
    <title>Services - FUR-EVER CARE</title>
    <link rel="stylesheet" href="css/services.css">
</head>

<body>
    <header>
        <nav class="navbar">
            <a href="landing.php" style="text-decoration: none;" class="logo">
                <img src="image/VETERINARY_LOGO_SYSTEM.png" alt="FUR-EVER CARE">
                <span>FUR-EVER CARE</span>
            </a>
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

    <!-- Dashboard Header -->
    <div class="dashboard-header">
        <div class="dashboardlogo">
            <img src="image/dashboard logo.png" alt="Dashboard Logo">
        </div>
        <h1>My Pet <span>Dashboard</span></h1>
        <p>Welcome back! Here's everything you need to manage your pet's health and wellbeing.</p>
    </div>

    <!-- Tabs -->
    <div class="tabs-container">
        <div class="tabs">
            <a href="dashboard.php" class="tab">Overview</a>
            <a href="services.php" class="tab active">Services</a>
            <a href="offers.php" class="tab">Offers</a>
            <a href="vouchers.php" class="tab">Vouchers</a>
        </div>
    </div>

    <!-- Services Section -->
   <section class="services-section">
    <h1>Our Services</h1>
    <h2>We provide comprehensive veterinary care services to ensure the highest quality care for your beloved pets.</h2>

    <div class="services">

        <!-- General Checkups -->
        <div class="service-card">
            <div class="icon">🩺</div>
            <h3>General Checkups</h3>
            <p>Comprehensive health examinations to keep your pets healthy and happy.</p>
            <p><b>Includes:</b> Physical examination, Health assessment, Preventive care</p>

            <div class="price-box">
                <span>₱500 – ₱900</span>
            </div>
        </div>

        <!-- Vaccinations -->
        <div class="service-card">
            <div class="icon">💉</div>
            <h3>Vaccinations</h3>
            <p>Complete vaccination programs to protect your pets from diseases.</p>
            <p><b>Includes:</b> Core vaccines, Non-core vaccines, Health certificates</p>

            <div class="price-box">
                <span>₱350 – ₱700</span>
            </div>
        </div>

        <!-- Emergency Care -->
        <div class="service-card">
            <div class="icon">🚑</div>
            <h3>Emergency Care</h3>
            <p>24/7 emergency services for urgent medical situations.</p>
            <p><b>Includes:</b> Emergency surgery, Critical care, Trauma treatment</p>

            <div class="price-box">
                <span>₱1200 – ₱2500</span>
            </div>
        </div>

        <!-- Surgical Services -->
        <div class="service-card">
            <div class="icon">🔧</div>
            <h3>Surgical Services</h3>
            <p>Advanced surgical procedures performed by experienced veterinarians.</p>
            <p><b>Includes:</b> Spay/neuter, Orthopedic surgery, Soft tissue surgery</p>

            <div class="price-box">
                <span>₱2500 – ₱7000</span>
            </div>
        </div>

        <!-- Preventive Care -->
        <div class="service-card">
            <div class="icon">🛡️</div>
            <h3>Preventive Care</h3>
            <p>Proactive healthcare to prevent diseases and maintain wellness.</p>
            <p><b>Includes:</b> Parasite prevention, Dental care, Nutritional counseling</p>

            <div class="price-box">
                <span>₱400 – ₱1000</span>
            </div>
        </div>

        <!-- Wellness Programs -->
        <div class="service-card">
            <div class="icon">❤️</div>
            <h3>Wellness Programs</h3>
            <p>Customized wellness plans tailored to your pet's specific needs.</p>
            <p><b>Includes:</b> Puppy/kitten programs, Senior pet care, Weight management</p>

            <div class="price-box">
                <span>₱600 – ₱1500</span>
            </div>
        </div>

    </div>
</section>


    <?php include 'generalfooter.php'; ?>

</body>

</html>
<?php include './includes/chatbot.php'; ?>