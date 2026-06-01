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

    // Load gallery component after the page is ready
    loadGalleryComponent();
});

function loadGalleryComponent() {
    const placeholder = document.getElementById('gallery-placeholder');
    if (!placeholder) {
        return;
    }

    const currentScript = document.currentScript || document.querySelector('script[src$="script.js"]');
    const baseUrl = currentScript ? currentScript.src.replace(/\/[^\/]*$/, '/') : window.location.href.replace(/\/[^\/]*$/, '/');
    const url = baseUrl + 'horizonal_scroll_view.html';
    console.log('Loading gallery component from', url);

    fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error('Unable to load gallery component');
            }
            return response.text();
        })
        .then(html => insertGalleryFromHTML(html, placeholder))
        .catch(fetchError => {
            console.warn('Fetch failed for gallery component, trying XHR fallback:', fetchError);
            if (window.location.protocol === 'file:') {
                console.warn('Using inline gallery fallback for local file protocol');
                insertGalleryFromHTML(galleryFallbackHTML, placeholder);
                attachGalleryFallbackBehavior(placeholder);
            } else {
                loadGalleryComponentXHR(url, placeholder);
            }
        });
}

function loadGalleryComponentXHR(url, placeholder) {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', url, true);
    xhr.responseType = 'text';

    xhr.onload = function () {
        if (xhr.status === 200 || xhr.status === 0) {
            insertGalleryFromHTML(xhr.responseText, placeholder);
        } else {
            console.error('XHR failed to load gallery component:', xhr.status, xhr.statusText);
            insertGalleryFromHTML(galleryFallbackHTML, placeholder);
            attachGalleryFallbackBehavior(placeholder);
        }
    };

    xhr.onerror = function () {
        console.error('XHR error while loading gallery component');
        insertGalleryFromHTML(galleryFallbackHTML, placeholder);
        attachGalleryFallbackBehavior(placeholder);
    };

    xhr.send();
}

function insertGalleryFromHTML(html, placeholder) {
    try {
        const template = document.createElement('template');
        template.innerHTML = html.trim();

        // Inject gallery-specific styles into <head>
        const styleElements = template.content.querySelectorAll('style');
        styleElements.forEach(styleEl => {
            document.head.appendChild(styleEl.cloneNode(true));
            styleEl.remove();
        });

        // Extract and append non-script nodes into the placeholder
        const scripts = template.content.querySelectorAll('script');
        scripts.forEach(script => script.remove());
        placeholder.appendChild(template.content.cloneNode(true));

        // Execute gallery-specific scripts
        scripts.forEach(oldScript => {
            const script = document.createElement('script');
            if (oldScript.src) {
                script.src = oldScript.src;
            }
            if (oldScript.textContent) {
                script.textContent = oldScript.textContent;
            }
            document.body.appendChild(script);
        });

        console.log('Gallery component loaded successfully');
    } catch (error) {
        console.error('Failed to parse gallery component HTML:', error);
    }
}

const galleryFallbackHTML = `
<section id="gallery" class="gallery-section">
    <div class="gallery-intro">
        <div>
            <span class="gallery-label">Gallery</span>
            <h2>Our Clinic Moments</h2>
            <p>Explore the atmosphere, care spaces, and smile stories from our clinic.</p>
        </div>
        <div class="gallery-actions">
            <span class="gallery-info"></span>
        </div>
    </div>

    <div class="gallery-grid">
        <button type="button" class="gallery-card" data-image="gallery/1.png" data-caption="Patient comfort lounge">
            <img src="gallery/1.png" alt="Patient comfort lounge">
            <div class="gallery-card-overlay">Patient comfort lounge</div>
        </button>
        <button type="button" class="gallery-card" data-image="gallery/2.png" data-caption="Modern dental suite">
            <img src="gallery/2.png" alt="Modern dental suite">
            <div class="gallery-card-overlay">Modern dental suite</div>
        </button>
        <button type="button" class="gallery-card" data-image="gallery/3.jpg" data-caption="Advanced treatment setup">
            <img src="gallery/3.jpg" alt="Advanced treatment setup">
            <div class="gallery-card-overlay">Advanced treatment setup</div>
        </button>
        <button type="button" class="gallery-card" data-image="gallery/4.jpg" data-caption="Friendly clinic environment">
            <img src="gallery/4.jpg" alt="Friendly clinic environment">
            <div class="gallery-card-overlay">Friendly clinic environment</div>
        </button>
        <button type="button" class="gallery-card" data-image="gallery/5.jpg" data-caption="Patient care moment">
            <img src="gallery/5.jpg" alt="Patient care moment">
            <div class="gallery-card-overlay">Patient care moment</div>
        </button>
        <button type="button" class="gallery-card" data-image="gallery/c.png" data-caption="Relaxing consultation area">
            <img src="gallery/c.png" alt="Relaxing consultation area">
            <div class="gallery-card-overlay">Relaxing consultation area</div>
        </button>
    </div>
</section>

<style>
.gallery-section {
    padding: 4rem 2rem;
    background: #f8fbff;
}

.gallery-intro {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;
    max-width: 1200px;
    margin: 0 auto 2rem;
    flex-wrap: wrap;
}

.gallery-label {
    display: inline-block;
    background: rgba(0, 102, 204, 0.12);
    color: #0057a3;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.12em;
    padding: 0.45rem 0.9rem;
    border-radius: 999px;
    font-size: 0.8rem;
    margin-bottom: 0.5rem;
}

.gallery-intro h2 {
    font-size: clamp(2rem, 2.5vw, 2.6rem);
    margin-bottom: 0.6rem;
}

.gallery-intro p {
    max-width: 680px;
    color: #4b5563;
    line-height: 1.75;
}

.gallery-actions {
    display: flex;
    align-items: center;
}

.gallery-info {
    color: #0a0e27;
    font-weight: 600;
}

.gallery-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
    gap: 1rem;
    max-width: 1200px;
    margin: 0 auto;
}

.gallery-card {
    position: relative;
    overflow: hidden;
    border-radius: 24px;
    border: 1px solid rgba(15, 23, 42, 0.08);
    box-shadow: 0 18px 50px rgba(15, 23, 42, 0.06);
    padding: 0;
    min-height: 220px;
    background: white;
    cursor: pointer;
    transition: transform 0.35s ease, box-shadow 0.35s ease;
}

.gallery-card:hover {
    transform: translateY(-6px);
    box-shadow: 0 24px 60px rgba(15, 23, 42, 0.12);
}

.gallery-card img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
}

.gallery-card-overlay {
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    padding: 1rem 1.2rem;
    background: linear-gradient(180deg, transparent 0%, rgba(6, 34, 87, 0.82) 100%);
    color: white;
    font-weight: 700;
    font-size: 0.95rem;
    line-height: 1.4;
}

.gallery-modal-overlay {
    position: fixed;
    inset: 0;
    background: rgba(7, 16, 47, 0.82);
    display: grid;
    place-items: center;
    padding: 1.5rem;
    z-index: 9999;
    backdrop-filter: blur(6px);
}

.gallery-modal {
    width: min(100%, 980px);
    max-height: min(100vh, 90vh);
    background: #0f172a;
    border-radius: 24px;
    overflow: hidden;
    position: relative;
    box-shadow: 0 28px 70px rgba(0, 0, 0, 0.35);
}

.gallery-modal img {
    width: 100%;
    height: auto;
    display: block;
    max-height: calc(90vh - 60px);
    object-fit: contain;
    background: #0f172a;
}

.gallery-modal-close {
    position: absolute;
    top: 1rem;
    right: 1rem;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    border: none;
    background: rgba(255, 255, 255, 0.12);
    color: white;
    font-size: 1.6rem;
    display: grid;
    place-items: center;
    cursor: pointer;
    transition: background 0.25s ease;
}

.gallery-modal-close:hover {
    background: rgba(255, 255, 255, 0.22);
}

@media (max-width: 860px) {
    .gallery-section {
        padding: 3rem 1.2rem;
    }

    .gallery-intro {
        text-align: center;
        justify-content: center;
    }

    .gallery-actions {
        justify-content: center;
    }
}

@media (max-width: 560px) {
    .gallery-grid {
        grid-template-columns: 1fr;
    }

    .gallery-card {
        min-height: 200px;
    }
}
</style>
`;

function attachGalleryFallbackBehavior(placeholder) {
    if (!placeholder) {
        return;
    }

    const galleryRoot = placeholder.querySelector('#gallery');
    if (!galleryRoot) {
        return;
    }

    galleryRoot.addEventListener('click', function (event) {
        const card = event.target.closest('.gallery-card');
        if (!card) {
            return;
        }

        const imageUrl = card.dataset.image;
        const caption = card.dataset.caption || 'Gallery image';
        if (!imageUrl) {
            return;
        }

        const overlay = document.createElement('div');
        overlay.className = 'gallery-modal-overlay';
        overlay.innerHTML = `
            <div class="gallery-modal">
                <button class="gallery-modal-close" aria-label="Close gallery view">&times;</button>
                <img src="${imageUrl}" alt="${caption}">
            </div>`;

        overlay.addEventListener('click', function (closeEvent) {
            if (closeEvent.target === overlay || closeEvent.target.closest('.gallery-modal-close')) {
                overlay.remove();
            }
        });

        document.body.appendChild(overlay);
    });
}

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

// PROFILE IMAGE FALLBACK - Show first letter if image fails to load
function showInitial(imgElement, fullName) {
    const initial = fullName.charAt(0).toUpperCase();
    const container = document.createElement('div');
    container.className = 'profile-pic-placeholder';
    container.textContent = initial;
    
    // Replace the broken image with the initial container
    imgElement.parentNode.replaceChild(container, imgElement);
}

console.log('OrbiCare Dental Clinic Website - Ready!');

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