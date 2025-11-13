<?php
session_start();

// Check if user is logged in
$is_logged_in = isset($_SESSION['user_id']);
$user_name = $_SESSION['user_name'] ?? '';

// Services data
$services = [
    [
        'icon' => '<path d="M12 2a9 9 0 0 1 9 9c0 3.6-3.6 9-9 9s-9-5.4-9-9a9 9 0 0 1 9-9zM12 16v.01"/><path d="M12 12l.01-.01"/>',
        'title' => 'General Checkups',
        'description' => 'Comprehensive health examinations to keep your pets healthy and happy.',
        'details' => 'Physical examination, Health assessment, and Preventive care recommendations'
    ],
    [
        'icon' => '<path d="M19 2H5a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2zM8 12h8M8 16h8M8 8h8"/>',
        'title' => 'Vaccinations',
        'description' => 'Complete vaccination programs to protect your pets from diseases.',
        'details' => 'Core vaccines, Non-core vaccines, Vaccination schedules, and health certificates'
    ],
    [
        'icon' => '<path d="M12 2l9 4v6c0 5.25-7.2 9-9 9s-9-3.75-9-9V6l9-4z"/><path d="M12 7v5"/><path d="M12 15h.01"/>',
        'title' => 'Emergency Care',
        'description' => '24/7 emergency services for urgent medical situations.',
        'details' => 'Emergency surgery, Critical care, Trauma treatment, and 24/7 availability'
    ],
    [
        'icon' => '<path d="M14 3v4a1 1 0 0 0 1 1h4"/><path d="M17 21H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h7l5 5v11a2 2 0 0 1-2 2z"/><line x1="9" y1="17" x2="15" y2="17"/><line x1="9" y1="13" x2="15" y2="13"/>',
        'title' => 'Surgical Services',
        'description' => 'Advanced surgical procedures performed by experienced veterinarians.',
        'details' => 'Spay/neuter surgery, Orthopedic surgery, Soft tissue surgery, and Dental surgery'
    ],
    [
        'icon' => '<path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"/><path d="M12 6v6l4 2"/>',
        'title' => 'Preventive Care',
        'description' => 'Proactive healthcare to prevent diseases and maintain wellness.',
        'details' => 'Parasite prevention, Dental care, Nutritional counseling, and Senior pet care'
    ],
    [
        'icon' => '<path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>',
        'title' => 'Wellness Programs',
        'description' => 'Customized wellness plans tailored to your pet\'s specific needs.',
        'details' => 'Puppy/kitten programs, Senior pet care, Weight management, and Behavioral counseling'
    ]
];

// Hero slider images
$slider_images = [
    ['src' => 'image/Doggo1.png', 'alt' => 'Dog'],
    ['src' => 'image/catto00.jpeg', 'alt' => 'Cat 1'],
    ['src' => 'image/doggo01.jpeg', 'alt' => 'Dog 2'],
    ['src' => 'image/puffcatto.jpeg', 'alt' => 'Fluffy Cat'],
    ['src' => 'image/catto01.jpeg', 'alt' => 'Cat 2']
];
?>
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>FUR-EVER CARE</title>
    <link rel="stylesheet" href="css/style.css">
    <link rel="stylesheet" href="css/PCA.css">
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
    <script src="script.js" defer></script>
    <script src="pca.js" defer></script>
</head>

<body>
    <header>
        <nav class="navbar">
            <div class="logo">
                <img src="image/VETERINARY_LOGO_SYSTEM.png" alt="FUR-EVER CARE">
                <span>FUR-EVER CARE</span>
            </div>
            <ul class="nav-links">
                <li><a href="#home">Home</a></li>
                <li><a href="#services">Services</a></li>
                <li><a href="#" class="book-now">Book Now</a></li>
                <?php if ($is_logged_in): ?>
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
                <?php else: ?>
                    <li><a href="signin.php" class="sign-in">Log In</a></li>
                <?php endif; ?>
            </ul>
        </nav>
    </header>
    <main>
        <section class="hero" id="home">
            <div class="hero-content">
                <h1>Loving Care for<br><span class="highlight">Your Precious Pets</span></h1>
                <p>Your pet's happiness is our priority!</p>
                <div class="hero-buttons">
                    <button class="get-started">Get Started</button>
                    <button class="learn-more">Learn More</button>
                </div>
            </div>
            <div class="hero-image">
                <div class="image-slider">
                    <?php foreach ($slider_images as $index => $image): ?>
                        <img class="slide <?php echo $index === 0 ? 'active' : ''; ?>"
                            src="<?php echo htmlspecialchars($image['src']); ?>"
                            alt="<?php echo htmlspecialchars($image['alt']); ?>" />
                    <?php endforeach; ?>
                </div>
                <div class="slider-controls">
                    <?php foreach ($slider_images as $index => $image): ?>
                        <span class="slider-dot <?php echo $index === 0 ? 'active' : ''; ?>"
                            data-slide="<?php echo $index; ?>"></span>
                    <?php endforeach; ?>
                </div>
                <button class="slider-arrow prev" aria-label="Previous slide">&#8249;</button>
                <button class="slider-arrow next" aria-label="Next slide">&#8250;</button>
            </div>
        </section>

        <section class="intro">
            <div class="intro-content">
                <div class="intro-text">
                    <h2>We Give Care that Lasts<br><span class="highlight">Fur-Ever</span></h2>
                    <h3>A Heartfelt Mission at Fur-ever Care Veterinary Services.</h3>
                    <p>Fur-ever Care Veterinary Services started with a deep love for animals and a dream to build a
                        special place where pets get the best care with lots of kindness. Our founder wanted to change
                        how veterinary clinics work, moving away from cold, routine visits.</p>
                    <p>At Fur-ever Care, every pet is treated like a beloved family member. Our name says it all: we
                        give care that lasts fur-ever, mixing modern medicine with a warm, caring touch.</p>
                    <p>Today, we help many pets in our community, staying true to our goal of offering a kind and
                        complete system where pets and their families feel loved and supported every step of the way.
                    </p>
                </div>
                <div class="intro-image">
                    <img src="image/Doggo2.jpg" alt="Veterinarian caring for a dog">
                </div>
            </div>
        </section>

        <section class="mv-section">
            <div class="mv-container">
                <h2>Mission & Vision</h2>
                <p class="mv-subtitle">Dedicated to creating magical moments of healing through innovative technology
                    and boundless compassion for every precious pet.</p>

                <div class="mv-cards">
                    <div class="mv-card mission">
                        <div class="card-icon">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <circle cx="12" cy="12" r="9" />
                                <circle cx="12" cy="12" r="5" />
                                <path d="M12 3v2M12 19v2M3 12h2M19 12h2" />
                                <path d="M12 7v5l3 3" />
                            </svg>
                        </div>
                        <h3>Our Mission</h3>
                        <p>To provide compassionate, high-quality veterinary care that strengthens the precious bond
                            between pets and their families. Through personalized attention, ongoing education, and
                            ethical practice, we deliver exceptional clinical outcomes, empower pet owners, and foster
                            lasting trust.</p>
                        <ul class="feature-list">
                            <li>
                                <svg class="feature-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                    stroke-width="2">
                                    <path
                                        d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                                </svg>
                                Compassionate care for every precious pet
                            </li>
                            <li>
                                <svg class="feature-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                    stroke-width="2">
                                    <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
                                </svg>
                                Advanced medical technology & safety
                            </li>
                            <li>
                                <svg class="feature-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                    stroke-width="2">
                                    <circle cx="12" cy="12" r="3" />
                                    <path d="M19.5 12a7.5 7.5 0 0 0-15 0" />
                                    <path d="M22 12c0 5.52-4.48 10-10 10S2 17.52 2 12 6.48 2 12 2s10 4.48 10 10z" />
                                </svg>
                                Supporting loving pet families
                            </li>
                        </ul>
                    </div>

                    <div class="mv-card vision">
                        <div class="card-icon">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7z" />
                                <circle cx="12" cy="12" r="3" />
                                <path d="M12 5v2M12 17v2M5 12H3M21 12h-2" />
                            </svg>
                        </div>
                        <h3>Our Vision</h3>
                        <p>To be the most beloved veterinary practice that continuously pioneers innovative technology
                            with exceptional care, setting magical new standards in pet health management and creating
                            unbreakable bonds between pets, families, and our amazing veterinary team.</p>
                        <ul class="feature-list">
                            <li>
                                <svg class="feature-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                    stroke-width="2">
                                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                                    <polyline points="22 4 12 14.01 9 11.01" />
                                </svg>
                                Industry leading care standards
                            </li>
                            <li>
                                <svg class="feature-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                    stroke-width="2">
                                    <circle cx="12" cy="12" r="7" />
                                    <path d="M12 9v6M15 12H9" />
                                    <path d="M21.5 12H19M5 12H2.5M12 5V2.5M12 21.5V19" />
                                </svg>
                                Innovative healing solutions
                            </li>
                            <li>
                                <svg class="feature-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                    stroke-width="2">
                                    <path
                                        d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                                </svg>
                                Lasting loving relationships
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </section>

        <section class="services" id="services">
            <div class="services-container">
                <h2>Our Services</h2>
                <p class="services-subtitle">We provide comprehensive veterinary care services to ensure the highest
                    quality care for your beloved pets.</p>

                <div class="services-grid">
                    <?php foreach ($services as $service): ?>
                        <div class="service-card">
                            <div class="service-icon">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
                                    stroke="currentColor" stroke-width="2">
                                    <?php echo $service['icon']; ?>
                                </svg>
                            </div>
                            <h3><?php echo htmlspecialchars($service['title']); ?></h3>
                            <p><?php echo htmlspecialchars($service['description']); ?></p>
                            <p class="service-details"><?php echo htmlspecialchars($service['details']); ?></p>
                        </div>
                    <?php endforeach; ?>
                </div>
            </div>
        </section>

        <section class="book-section">
            <div class="book-container">
                <div class="book-image">
                    <img src="image/Catto.jpg" alt="Cute cat sitting in flowers">
                </div>
                <div class="book-content">
                    <h2>Take Care of Your<br>Pet's Health</h2>
                    <p>Did you know that it is advisable to examine your pet every six months? Book your appointment
                        now!</p>
                    <button class="book-now-btn"
                        onclick="window.location.href='<?php echo $is_logged_in ? 'book-appointment.php' : 'signin.php'; ?>'">
                        <svg class="paw-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                            <path
                                d="M226.5 92.9c14.3 42.9-.3 86.2-32.6 96.8s-70.1-15.6-84.4-58.5s.3-86.2 32.6-96.8s70.1 15.6 84.4 58.5zM100.4 198.6c18.9 32.4 14.3 70.1-10.2 84.1s-59.7-.9-78.5-33.3S-2.7 179.3 21.8 165.3s59.7 .9 78.5 33.3zM69.2 401.2C121.6 259.9 214.7 224 256 224s134.4 35.9 186.8 177.2c3.6 9.7 5.2 20.1 5.2 30.5v1.6c0 25.8-20.9 46.7-46.7 46.7c-11.5 0-22.9-1.4-34-4.2l-88-22c-15.3-3.8-31.3-3.8-46.6 0l-88 22c-11.1 2.8-22.5 4.2-34 4.2C84.9 480 64 459.1 64 433.3v-1.6c0-10.4 1.6-20.8 5.2-30.5zM421.8 282.7c-24.5-14-29.1-51.7-10.2-84.1s54-47.3 78.5-33.3s29.1 51.7 10.2 84.1s-54 47.3-78.5 33.3zM310.1 189.7c-32.3-10.6-46.9-53.9-32.6-96.8s52.1-69.1 84.4-58.5s46.9 53.9 32.6 96.8s-52.1 69.1-84.4 58.5z"
                                fill="currentColor" />
                        </svg>
                        Book Now!
                    </button>
                </div>
            </div>
        </section>
    </main>

    <!-- Footer -->
    <footer class="main-footer">
        <div class="footer-container">
            <!-- Left Section: Logo -->
            <div class="footer-brand">
                <img src="image/VETERINARY_LOGO_SYSTEM.png" alt="Fur-Ever Care Logo" class="footer-logo">
            </div>

            <!-- Middle Section: Title + Schedule -->
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

            <!-- Right Section: Contact Info -->
            <div class="footer-contact">
                <h3>CONTACT INFORMATION</h3>

                <div class="contact-item">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" stroke="white"
                        stroke-width="2" viewBox="0 0 24 24">
                        <path d="M21 10c0 6-9 13-9 13S3 16 3 10a9 9 0 1118 0z" />
                        <circle cx="12" cy="10" r="3" />
                    </svg>
                    <p>123 Pet Care Avenue<br>Veterinary District, VC 12345</p>
                </div>

                <div class="contact-item">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" stroke="white"
                        stroke-width="2" viewBox="0 0 24 24">
                        <path
                            d="M22 16.92V21a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.11 19.5 19.5 0 01-6-6A19.79 19.79 0 012 4.18 2 2 0 014 2h4.09a2 2 0 012 1.72c.12.81.37 1.61.72 2.34a2 2 0 01-.45 2.11L9 10a16 16 0 006 6l1.83-1.36a2 2 0 012.11-.45c.73.35 1.53.6 2.34.72a2 2 0 011.72 2.01z" />
                    </svg>
                    <p>(555) 123-PETS</p>
                </div>

                <div class="contact-item">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" stroke="white"
                        stroke-width="2" viewBox="0 0 24 24">
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

        <!-- Bottom Bar -->
        <div class="footer-bottom">
            <p>
                <svg class="paw-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                    <path
                        d="M226.5 92.9c14.3 42.9-.3 86.2-32.6 96.8s-70.1-15.6-84.4-58.5s.3-86.2 32.6-96.8s70.1 15.6 84.4 58.5zM100.4 198.6c18.9 32.4 14.3 70.1-10.2 84.1s-59.7-.9-78.5-33.3S-2.7 179.3 21.8 165.3s59.7 .9 78.5 33.3zM69.2 401.2C121.6 259.9 214.7 224 256 224s134.4 35.9 186.8 177.2c3.6 9.7 5.2 20.1 5.2 30.5v1.6c0 25.8-20.9 46.7-46.7 46.7c-11.5 0-22.9-1.4-34-4.2l-88-22c-15.3-3.8-31.3-3.8-46.6 0l-88 22c-11.1 2.8-22.5 4.2-34 4.2C84.9 480 64 459.1 64 433.3v-1.6c0-10.4 1.6-20.8 5.2-30.5zM421.8 282.7c-24.5-14-29.1-51.7-10.2-84.1s54-47.3 78.5-33.3s29.1 51.7 10.2 84.1s-54 47.3-78.5 33.3zM310.1 189.7c-32.3-10.6-46.9-53.9-32.6-96.8s52.1-69.1 84.4-58.5s46.9 53.9 32.6 96.8s-52.1 69.1-84.4 58.5z"
                        fill="currentColor" />
                </svg>
                All rights reserved (2025)
            </p>
            <a href="privacy.php">Privacy Policy</a>
            <p>
                <svg class="paw-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                    <path
                        d="M226.5 92.9c14.3 42.9-.3 86.2-32.6 96.8s-70.1-15.6-84.4-58.5s.3-86.2 32.6-96.8s70.1 15.6 84.4 58.5zM100.4 198.6c18.9 32.4 14.3 70.1-10.2 84.1s-59.7-.9-78.5-33.3S-2.7 179.3 21.8 165.3s59.7 .9 78.5 33.3zM69.2 401.2C121.6 259.9 214.7 224 256 224s134.4 35.9 186.8 177.2c3.6 9.7 5.2 20.1 5.2 30.5v1.6c0 25.8-20.9 46.7-46.7 46.7c-11.5 0-22.9-1.4-34-4.2l-88-22c-15.3-3.8-31.3-3.8-46.6 0l-88 22c-11.1 2.8-22.5 4.2-34 4.2C84.9 480 64 459.1 64 433.3v-1.6c0-10.4 1.6-20.8 5.2-30.5zM421.8 282.7c-24.5-14-29.1-51.7-10.2-84.1s54-47.3 78.5-33.3s29.1 51.7 10.2 84.1s-54 47.3-78.5 33.3zM310.1 189.7c-32.3-10.6-46.9-53.9-32.6-96.8s52.1-69.1 84.4-58.5s46.9 53.9 32.6 96.8s-52.1 69.1-84.4 58.5z"
                        fill="currentColor" />
                </svg>
            </p>
        </div>
    </footer>

    <?php include './includes/chatbot.php'; ?>

</body>

</html>