document.addEventListener('DOMContentLoaded', function() {
    const slides = document.querySelectorAll('.image-slider .slide');
    const dots = document.querySelectorAll('.slider-dot');
    const prevButton = document.querySelector('.slider-arrow.prev');
    const nextButton = document.querySelector('.slider-arrow.next');
    let currentSlide = 0;
    const totalSlides = slides.length;
    
    function updateSlides(newIndex) {
        // Remove active class from all slides and dots
        slides.forEach(slide => slide.classList.remove('active'));
        dots.forEach(dot => dot.classList.remove('active'));
        
        // Update current slide index
        currentSlide = (newIndex + totalSlides) % totalSlides;
        
        // Add active class to current slide and dot
        slides[currentSlide].classList.add('active');
        dots[currentSlide].classList.add('active');
    }
    
    // Dots
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => updateSlides(index));
    });
    
    // Arrows
    prevButton.addEventListener('click', () => updateSlides(currentSlide - 1));
    nextButton.addEventListener('click', () => updateSlides(currentSlide + 1));
    
    // Interval
    setInterval(() => updateSlides(currentSlide + 1), 3000);
});