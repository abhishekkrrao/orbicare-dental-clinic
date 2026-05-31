// ============================================
// MODERN DENTAL CLINIC WEBSITE JAVASCRIPT
// ============================================

// CAROUSEL FUNCTIONALITY
let currentSlide = 0;
let slides = [];
let dots = [];
let totalSlides = 0;

function showSlide(n) {
    // Validate index
    if (n >= totalSlides) {
        currentSlide = 0;
    } else if (n < 0) {
        currentSlide = totalSlides - 1;
    } else {
        currentSlide = n;
    }

    // Remove active class from all slides and dots
    slides.forEach(slide => slide.classList.remove('active'));
    dots.forEach(dot => dot.classList.remove('active'));

    // Add active class to current slide and dot
    if (slides[currentSlide]) {
        slides[currentSlide].classList.add('active');
    }
    if (dots[currentSlide]) {
        dots[currentSlide].classList.add('active');
    }
    
    console.log('Showing slide:', currentSlide);
}

function changeSlide(direction) {
    currentSlide += direction;
    if (currentSlide >= totalSlides) {
        currentSlide = 0;
    } else if (currentSlide < 0) {
        currentSlide = totalSlides - 1;
    }
    showSlide(currentSlide);
    resetAutoSlide();
    console.log('Changed slide to:', currentSlide);
}

function changeSlideByDot(n) {
    currentSlide = n;
    showSlide(currentSlide);
    resetAutoSlide();
    console.log('Dot clicked, showing slide:', currentSlide);
}

// Expose functions to global scope
window.currentSlide = changeSlideByDot;
window.changeSlide = changeSlide;

// Auto-slide every 5 seconds
let autoSlideTimer;

function autoSlide() {
    currentSlide++;
    if (currentSlide >= totalSlides) {
        currentSlide = 0;
    }
    showSlide(currentSlide);
}

function resetAutoSlide() {
    clearInterval(autoSlideTimer);
    autoSlideTimer = setInterval(autoSlide, 5000);
}

// Initialize carousel
document.addEventListener('DOMContentLoaded', () => {
    // Get slides and dots after DOM is loaded
    slides = document.querySelectorAll('.carousel-slide');
    dots = document.querySelectorAll('.dot');
    totalSlides = slides.length;
    
    console.log('Carousel initialized with', totalSlides, 'slides');
    
    if (slides.length > 0) {
        showSlide(0);
        autoSlideTimer = setInterval(autoSlide, 5000);
    }
});

// HAMBURGER MENU TOGGLE
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

if (hamburger) {
    hamburger.addEventListener('click', () => {
        navMenu.classList.toggle('active');
    });

    // Close menu when a link is clicked
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
        });
    });
}

// FORM SUBMISSION
const appointmentForm = document.getElementById('appointmentForm');

if (appointmentForm) {
    appointmentForm.addEventListener('submit', (e) => {
        e.preventDefault();

        // Get form values
        const name = appointmentForm.querySelector('input[type="text"]').value;
        const email = appointmentForm.querySelector('input[type="email"]').value;
        const phone = appointmentForm.querySelector('input[type="tel"]').value;
        const service = appointmentForm.querySelector('select').value;
        const date = appointmentForm.querySelector('input[type="date"]').value;
        const time = appointmentForm.querySelector('input[type="time"]').value;
        const notes = appointmentForm.querySelector('textarea').value;

        // Validate form
        if (!name || !email || !phone || !service || !date || !time) {
            alert('Please fill in all required fields');
            return;
        }

        // Show success notification
        showNotification('Appointment Request Received!', 'We will contact you shortly to confirm your appointment.');

        // Log to console (in production, this would send to a server)
        console.log('Appointment Data:', {
            name,
            email,
            phone,
            service,
            date,
            time,
            notes
        });

        // Reset form
        appointmentForm.reset();
    });
}

// NOTIFICATION FUNCTION
function showNotification(title, message) {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: linear-gradient(135deg, #00d4ff, #0066cc);
        color: white;
        padding: 20px 30px;
        border-radius: 8px;
        box-shadow: 0 4px 15px rgba(0, 102, 204, 0.3);
        z-index: 9999;
        max-width: 400px;
        animation: slideInRight 0.3s ease-out;
    `;

    notification.innerHTML = `
        <div style="font-weight: 600; margin-bottom: 8px;">${title}</div>
        <div style="font-size: 0.9rem; opacity: 0.9;">${message}</div>
    `;

    document.body.appendChild(notification);

    // Add animation if not already added
    if (!document.querySelector('style[data-notification]')) {
        const style = document.createElement('style');
        style.setAttribute('data-notification', 'true');
        style.textContent = `
            @keyframes slideInRight {
                from {
                    opacity: 0;
                    transform: translateX(100px);
                }
                to {
                    opacity: 1;
                    transform: translateX(0);
                }
            }
        `;
        document.head.appendChild(style);
    }

    // Remove notification after 4 seconds
    setTimeout(() => {
        notification.style.animation = 'slideInRight 0.3s ease-out reverse';
        setTimeout(() => notification.remove(), 300);
    }, 4000);
}

// SMOOTH SCROLL BEHAVIOR FOR NAVIGATION
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href !== '#' && document.querySelector(href)) {
            e.preventDefault();
            const target = document.querySelector(href);
            const offsetTop = target.offsetTop - 80; // Account for fixed navbar

            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    });
});

// SCROLL ANIMATION FOR ELEMENTS
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.animation = 'slideInUp 0.6s ease-out forwards';
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Observe all service cards and testimonial cards
document.querySelectorAll('.service-card, .testimonial-card, .stat-widget').forEach(el => {
    el.style.opacity = '0';
    observer.observe(el);
});

// ADD SLIDEUP ANIMATION STYLE
if (!document.querySelector('style[data-slideup]')) {
    const animationStyle = document.createElement('style');
    animationStyle.setAttribute('data-slideup', 'true');
    animationStyle.textContent = `
        @keyframes slideInUp {
            from {
                opacity: 0;
                transform: translateY(30px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
    `;
    document.head.appendChild(animationStyle);
}

// NAVBAR BACKGROUND ON SCROLL
const navbar = document.querySelector('.navbar');
if (navbar) {
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.style.background = 'rgba(255, 255, 255, 0.98)';
            navbar.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)';
        } else {
            navbar.style.background = 'rgba(255, 255, 255, 0.95)';
            navbar.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.1)';
        }
    });
}

// MOBILE RESPONSIVE MENU
function handleResize() {
    if (window.innerWidth > 768 && navMenu) {
        navMenu.classList.remove('active');
    }
}

window.addEventListener('resize', handleResize);

// COUNTER ANIMATION FOR STATISTICS
function animateCounter(element, target, duration = 2000) {
    const start = 0;
    const startTime = Date.now();

    const animate = () => {
        const elapsed = Date.now() - startTime;
        const progress = elapsed / duration;

        if (progress < 1) {
            const value = Math.floor(start + (target - start) * progress);
            element.textContent = value + '+';
            requestAnimationFrame(animate);
        } else {
            element.textContent = target + '+';
        }
    };

    animate();
}

// Observe statistics section and start counter animation
const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const counters = entry.target.querySelectorAll('.stat-content h3');
            counters.forEach(counter => {
                const match = counter.textContent.match(/(\d+)/);
                if (match) {
                    const target = parseInt(match[1]);
                    animateCounter(counter, target);
                }
            });
            statsObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

const statsDashboard = document.querySelector('.stats-dashboard');
if (statsDashboard) {
    statsObserver.observe(statsDashboard);
}

// FORM INPUT FOCUS EFFECTS
const formInputs = document.querySelectorAll('.appointment-form input, .appointment-form select, .appointment-form textarea');

formInputs.forEach(input => {
    input.addEventListener('focus', () => {
        input.style.background = 'rgba(255, 255, 255, 0.2)';
    });

    input.addEventListener('blur', () => {
        input.style.background = 'rgba(255, 255, 255, 0.1)';
    });
});

// TESTIMONIAL READ MORE/LESS FUNCTIONALITY
function toggleTestimonial(id) {
    const testimonialText = document.getElementById('testimonial-' + id);
    const readMoreBtn = event.target;

    if (testimonialText.classList.contains('testimonial-text-collapsed')) {
        // Expand
        testimonialText.classList.remove('testimonial-text-collapsed');
        testimonialText.classList.add('testimonial-text-expanded');
        readMoreBtn.textContent = 'Read Less';
        readMoreBtn.style.color = 'var(--secondary-color)';
    } else {
        // Collapse
        testimonialText.classList.remove('testimonial-text-expanded');
        testimonialText.classList.add('testimonial-text-collapsed');
        readMoreBtn.textContent = 'Read More';
        readMoreBtn.style.color = 'var(--primary-color)';
    }
}

console.log('SmileLine Dental Website - Ready!');

const branchData = {
    manikonda: {
        name: "Dr. Gowds Dental Hospital Manikonda",
        address: "2nd Floor, 4-5, Puppalaguda Rd, Lalamma Gardens, Manikonda, Hyderabad, Telangana 500089",
        mapUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3807.50!2d78.3887!3d17.4116!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bcb940026e6d7a7%3A0xc4802e3b2e566872!2sManikonda%2C%20Hyderabad!5e0!3m2!1sen!2sin!4v1717080000000"
    },
    gachibowli: {
        name: "Dr. Gowds Dental Hospital Gachibowli",
        address: "DLF Cyber City Road, Gachibowli, Hyderabad, 500032",
        mapUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3806.32!2d78.34!3d17.44!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bcb939!2sGachibowli!5e0"
    }
    // Add other branches here...
};

const tabs = document.querySelectorAll('.tab-btn');
const branchNameLabel = document.getElementById('branchName');
const branchAddressLabel = document.getElementById('branchAddress');
const mapIframe = document.getElementById('mapIframe');

tabs.forEach(tab => {
    tab.addEventListener('click', () => {
        // 1. Update active button style
        tabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');

        // 2. Get data for selected branch
        const branchKey = tab.getAttribute('data-branch');
        const data = branchData[branchKey];

        // 3. Update UI if data exists
        if (data) {
            branchNameLabel.innerText = data.name;
            branchAddressLabel.innerText = data.address;
            mapIframe.src = data.mapUrl;
        }
    });
});