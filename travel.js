// Main JavaScript file for M41 Travel

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('M41 Travel website loaded');
    
    // Initialize all functionality
    initMobileMenu();
    initSmoothScroll();
    initFormHandling();
    initAnimations();
    initTouchSupport();
    setViewportHeight();
    initImageLoading();
});

// ==================== MOBILE MENU FUNCTIONALITY ====================
function initMobileMenu() {
    const mobileMenuToggle = document.getElementById('mobileMenuToggle');
    const navInner = document.querySelector('.nav-inner');
    const navItems = document.querySelectorAll('.nav-item');
    
    if (!mobileMenuToggle || !navInner) return;
    
    // Create mobile menu toggle if it doesn't exist in HTML
    if (!mobileMenuToggle) {
        const toggleBtn = document.createElement('button');
        toggleBtn.id = 'mobileMenuToggle';
        toggleBtn.className = 'mobile-menu-toggle';
        toggleBtn.innerHTML = '<i class="fas fa-bars"></i>';
        
        const headerContainer = document.querySelector('.header .container');
        if (headerContainer) {
            headerContainer.appendChild(toggleBtn);
        }
    }
    
    // Toggle menu function
    function toggleMenu() {
        navInner.classList.toggle('active');
        const icon = mobileMenuToggle.querySelector('i');
        if (navInner.classList.contains('active')) {
            icon.classList.remove('fa-bars');
            icon.classList.add('fa-times');
            // Prevent body scroll when menu is open
            document.body.style.overflow = 'hidden';
        } else {
            icon.classList.remove('fa-times');
            icon.classList.add('fa-bars');
            // Restore body scroll
            document.body.style.overflow = '';
        }
    }
    
    // Toggle menu on button click
    mobileMenuToggle.addEventListener('click', function(e) {
        e.stopPropagation();
        toggleMenu();
    });
    
    // Close menu when clicking on nav item
    navItems.forEach(item => {
        item.addEventListener('click', function() {
            if (navInner.classList.contains('active')) {
                toggleMenu();
            }
        });
    });
    
    // Close menu when clicking outside
    document.addEventListener('click', function(e) {
        if (navInner.classList.contains('active') && 
            !navInner.contains(e.target) && 
            e.target !== mobileMenuToggle && 
            !mobileMenuToggle.contains(e.target)) {
            toggleMenu();
        }
    });
    
    // Close menu on escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && navInner.classList.contains('active')) {
            toggleMenu();
        }
    });
}

// ==================== SMOOTH SCROLL ====================
function initSmoothScroll() {
    const headerHeight = document.querySelector('.header') ? document.querySelector('.header').offsetHeight : 80;
    
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#' || targetId === '#!') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                e.preventDefault();
                
                // Close mobile menu if open
                const navInner = document.querySelector('.nav-inner');
                const mobileMenuToggle = document.getElementById('mobileMenuToggle');
                if (navInner && navInner.classList.contains('active') && mobileMenuToggle) {
                    navInner.classList.remove('active');
                    mobileMenuToggle.querySelector('i').classList.remove('fa-times');
                    mobileMenuToggle.querySelector('i').classList.add('fa-bars');
                    document.body.style.overflow = '';
                }
                
                // Calculate offset based on screen size
                let offset = headerHeight;
                if (window.innerWidth <= 768) {
                    offset = headerHeight + 20; // Extra space for mobile
                }
                
                const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - offset;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
                
                // Update URL without page jump
                if (history.pushState) {
                    history.pushState(null, null, targetId);
                } else {
                    location.hash = targetId;
                }
            }
        });
    });
}

// ==================== FORM HANDLING ====================
function initFormHandling() {
    const adventureForm = document.getElementById('adventureForm');
    
    if (!adventureForm) return;
    
    // Form validation
    function validateForm() {
        let isValid = true;
        const firstNameInput = document.getElementById('first_name');
        const emailInput = document.getElementById('email');
        
        // Clear previous errors
        clearFormErrors();
        
        // Validate first name
        if (!firstNameInput || !firstNameInput.value.trim()) {
            showFormError(firstNameInput, 'Please enter your first name');
            isValid = false;
        }
        
        // Validate email
        if (!emailInput || !emailInput.value.trim()) {
            showFormError(emailInput, 'Please enter your email address');
            isValid = false;
        } else if (!isValidEmail(emailInput.value)) {
            showFormError(emailInput, 'Please enter a valid email address');
            isValid = false;
        }
        
        // Validate reCAPTCHA (if present)
        if (typeof grecaptcha !== 'undefined') {
            const recaptchaResponse = grecaptcha.getResponse();
            if (!recaptchaResponse) {
                alert('Please complete the reCAPTCHA verification.');
                isValid = false;
            }
        }
        
        return isValid;
    }
    
    // Submit handler
    adventureForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        if (!validateForm()) {
            return;
        }
        
        const submitButton = adventureForm.querySelector('.btn-submit-3d') || 
                            adventureForm.querySelector('button[type="submit"]');
        const originalText = submitButton.innerHTML;
        const originalBgColor = submitButton.style.backgroundColor;
        
        // Show loading state
        submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i><span>Sending...</span>';
        submitButton.disabled = true;
        submitButton.style.backgroundColor = '#2a9d8f';
        
        try {
            // Prepare form data
            const formData = new FormData(adventureForm);
            const data = Object.fromEntries(formData);
            
            // Add reCAPTCHA token if available
            if (typeof grecaptcha !== 'undefined') {
                data['g-recaptcha-response'] = grecaptcha.getResponse();
            }
            
            // Simulate API call (replace with actual endpoint)
            // In production, replace this with your actual backend endpoint
            console.log('Form data to be sent:', data);
            
            // For demo purposes, simulate a successful submission
            await new Promise(resolve => setTimeout(resolve, 1500));
            
            // Show success state
            submitButton.innerHTML = '<i class="fas fa-check"></i><span>Message Sent!</span>';
            submitButton.style.backgroundColor = '#27ae60';
            
            // Show success message
            showFormMessage('Your adventure request has been sent successfully! We will contact you soon.', 'success');
            
            // Reset form after delay
            setTimeout(() => {
                adventureForm.reset();
                if (typeof grecaptcha !== 'undefined') {
                    grecaptcha.reset();
                }
                submitButton.innerHTML = originalText;
                submitButton.style.backgroundColor = originalBgColor;
                submitButton.disabled = false;
                clearFormMessage();
            }, 3000);
            
        } catch (error) {
            console.error('Error submitting form:', error);
            
            // Show error state
            submitButton.innerHTML = '<i class="fas fa-exclamation-triangle"></i><span>Error Sending</span>';
            submitButton.style.backgroundColor = '#e74c3c';
            
            // Show error message
            showFormMessage('Failed to send message. Please try again or contact us directly.', 'error');
            
            // Reset button after delay
            setTimeout(() => {
                submitButton.innerHTML = originalText;
                submitButton.style.backgroundColor = originalBgColor;
                submitButton.disabled = false;
                clearFormMessage();
            }, 3000);
        }
    });
    
    // Helper functions
    function showFormError(inputElement, message) {
        if (!inputElement) return;
        
        inputElement.style.borderColor = '#e74c3c';
        
        // Remove existing error
        const existingError = inputElement.parentNode.querySelector('.error-message');
        if (existingError) existingError.remove();
        
        // Create error message
        const errorElement = document.createElement('div');
        errorElement.className = 'error-message';
        errorElement.style.color = '#e74c3c';
        errorElement.style.fontSize = '0.8rem';
        errorElement.style.marginTop = '0.3rem';
        errorElement.textContent = message;
        
        inputElement.parentNode.appendChild(errorElement);
        
        // Focus the field
        inputElement.focus();
        
        // Remove error on input
        inputElement.addEventListener('input', function clearError() {
            this.style.borderColor = '';
            if (errorElement.parentNode) {
                errorElement.remove();
            }
            this.removeEventListener('input', clearError);
        });
    }
    
    function clearFormErrors() {
        document.querySelectorAll('.error-message').forEach(el => el.remove());
        document.querySelectorAll('.form-group input, .form-group textarea').forEach(el => {
            el.style.borderColor = '';
        });
    }
    
    function showFormMessage(message, type) {
        clearFormMessage();
        
        const messageElement = document.createElement('div');
        messageElement.className = `form-message form-message-${type}`;
        messageElement.innerHTML = `
            <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
            <span>${message}</span>
        `;
        
        // Add styles
        const styles = document.createElement('style');
        styles.textContent = `
            .form-message {
                padding: 1rem;
                margin: 1rem 0;
                border-radius: 10px;
                display: flex;
                align-items: center;
                gap: 0.8rem;
                font-weight: 600;
                animation: fadeIn 0.3s ease-out;
            }
            .form-message-success {
                background: rgba(39, 174, 96, 0.1);
                color: #27ae60;
                border: 2px solid rgba(39, 174, 96, 0.2);
            }
            .form-message-error {
                background: rgba(231, 76, 60, 0.1);
                color: #e74c3c;
                border: 2px solid rgba(231, 76, 60, 0.2);
            }
            @keyframes fadeIn {
                from { opacity: 0; transform: translateY(-10px); }
                to { opacity: 1; transform: translateY(0); }
            }
        `;
        document.head.appendChild(styles);
        
        adventureForm.insertBefore(messageElement, adventureForm.firstChild);
    }
    
    function clearFormMessage() {
        document.querySelectorAll('.form-message').forEach(el => el.remove());
    }
    
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
}

// ==================== ANIMATIONS & INTERACTIONS ====================
function initAnimations() {
    // Intersection Observer for scroll animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in-up');
            }
        });
    }, observerOptions);
    
    // Observe elements
    const elementsToAnimate = document.querySelectorAll(
        'section, .tour-card-3d, .team-card-3d, .itinerary-card-3d, .gallery-item, .picture-item'
    );
    
    elementsToAnimate.forEach(el => {
        observer.observe(el);
    });
    
    // Card flip animation for touch devices
    const flipCards = document.querySelectorAll('.tour-card-3d');
    flipCards.forEach(card => {
        card.addEventListener('click', function(e) {
            if (window.innerWidth <= 768 && !e.target.closest('a')) {
                this.querySelector('.card-inner').style.transform = 
                    this.querySelector('.card-inner').style.transform === 'rotateY(180deg)' 
                    ? 'rotateY(0deg)' 
                    : 'rotateY(180deg)';
            }
        });
    });
    
    // Add CSS for animations
    const animationCSS = document.createElement('style');
    animationCSS.textContent = `
        .fade-in-up {
            animation: fadeInUp 0.6s ease-out forwards;
        }
        
        @keyframes fadeInUp {
            from {
                opacity: 0;
                transform: translateY(30px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
        
        /* Mobile-specific card flip */
        @media (max-width: 768px) {
            .tour-card-3d {
                cursor: pointer;
            }
            .tour-card-3d .card-inner {
                transition: transform 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275);
            }
        }
    `;
    document.head.appendChild(animationCSS);
}

// ==================== TOUCH SUPPORT ====================
function initTouchSupport() {
    // Check if touch device
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    
    if (isTouchDevice) {
        document.body.classList.add('touch-device');
        
        // Add touch feedback
        const touchElements = document.querySelectorAll(
            '.btn-3d, .btn-itinerary, .country-tag, .nav-item, .tour-card-3d'
        );
        
        touchElements.forEach(el => {
            el.addEventListener('touchstart', function() {
                this.classList.add('touch-active');
            }, { passive: true });
            
            el.addEventListener('touchend', function() {
                this.classList.remove('touch-active');
            }, { passive: true });
            
            el.addEventListener('touchcancel', function() {
                this.classList.remove('touch-active');
            }, { passive: true });
        });
        
        // Prevent long press on buttons
        const buttons = document.querySelectorAll('button, .btn-3d, .btn-itinerary');
        buttons.forEach(btn => {
            btn.addEventListener('contextmenu', function(e) {
                e.preventDefault();
                return false;
            });
        });
        
        // Add touch-specific CSS
        const touchCSS = document.createElement('style');
        touchCSS.textContent = `
            .touch-device .btn-3d:hover,
            .touch-device .btn-itinerary:hover,
            .touch-device .country-tag:hover,
            .touch-device .nav-item:hover {
                transform: none !important;
            }
            
            .touch-device .touch-active {
                transform: scale(0.98) !important;
                transition: transform 0.1s !important;
            }
            
            .touch-device .tour-card-3d:hover .card-inner {
                transform: none !important;
            }
            
            /* Improve touch targets */
            @media (max-width: 768px) {
                .nav-item,
                .btn-3d,
                .btn-itinerary,
                .country-tag {
                    min-height: 44px;
                    min-width: 44px;
                }
                
                /* Prevent blue tap highlight on iOS */
                button, 
                input, 
                textarea,
                select,
                a {
                    -webkit-tap-highlight-color: transparent;
                }
            }
        `;
        document.head.appendChild(touchCSS);
    }
}

// ==================== VIEWPORT HEIGHT FIX ====================
function setViewportHeight() {
    // Fix for mobile viewport height
    function updateViewportHeight() {
        const vh = window.innerHeight * 0.01;
        document.documentElement.style.setProperty('--vh', `${vh}px`);
        
        // Set hero section height
        const heroSection = document.querySelector('.hero-section');
        if (heroSection) {
            heroSection.style.height = `calc(var(--vh, 1vh) * 100)`;
        }
    }
    
    // Initial call
    updateViewportHeight();
    
    // Update on resize and orientation change
    window.addEventListener('resize', updateViewportHeight);
    window.addEventListener('orientationchange', updateViewportHeight);
}

// ==================== IMAGE LOADING ====================
function initImageLoading() {
    // Lazy load images
    const images = document.querySelectorAll('img[data-src]');
    
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                    observer.unobserve(img);
                }
            });
        });
        
        images.forEach(img => imageObserver.observe(img));
    } else {
        // Fallback for older browsers
        images.forEach(img => {
            img.src = img.dataset.src;
        });
    }
    
    // Add loading states for images
    const imageContainers = document.querySelectorAll('.gallery-img-wrapper, .picture-wrapper, .team-img-container');
    imageContainers.forEach(container => {
        const img = container.querySelector('img');
        if (img && !img.complete) {
            container.classList.add('loading');
            
            img.addEventListener('load', function() {
                container.classList.remove('loading');
                container.classList.add('loaded');
            });
            
            img.addEventListener('error', function() {
                container.classList.remove('loading');
                container.classList.add('error');
                console.warn('Failed to load image:', img.src);
            });
        }
    });
    
    // Add loading styles
    const loadingCSS = document.createElement('style');
    loadingCSS.textContent = `
        .loading {
            position: relative;
            background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
            background-size: 200% 100%;
            animation: loading 1.5s infinite;
        }
        
        .loading::before {
            content: '';
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 30px;
            height: 30px;
            border: 3px solid rgba(212, 175, 55, 0.3);
            border-top-color: var(--accent-gold);
            border-radius: 50%;
            animation: spin 1s linear infinite;
        }
        
        @keyframes loading {
            0% { background-position: 200% 0; }
            100% { background-position: -200% 0; }
        }
        
        @keyframes spin {
            to { transform: translate(-50%, -50%) rotate(360deg); }
        }
        
        .loaded img {
            animation: fadeIn 0.5s ease-out;
        }
    `;
    document.head.appendChild(loadingCSS);
}

// ==================== PERFORMANCE OPTIMIZATIONS ====================
// Throttle scroll events
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// Debounce resize events
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Initialize scroll animations with throttle
window.addEventListener('scroll', throttle(function() {
    // Header background on scroll
    const header = document.querySelector('.header');
    const scrolled = window.pageYOffset;
    
    if (header) {
        if (scrolled > 100) {
            header.style.backgroundColor = 'rgba(10, 25, 47, 0.98)';
            header.style.backdropFilter = 'blur(15px)';
        } else {
            header.style.backgroundColor = 'rgba(10, 25, 47, 0.95)';
            header.style.backdropFilter = 'blur(10px)';
        }
    }
    
    // Parallax effect (optional)
    const parallaxElements = document.querySelectorAll('.parallax');
    parallaxElements.forEach(element => {
        const speed = element.dataset.speed || 0.5;
        const yPos = -(scrolled * speed);
        element.style.transform = `translateY(${yPos}px)`;
    });
}, 100));

// Handle window resize with debounce
window.addEventListener('resize', debounce(function() {
    // Re-initialize mobile menu if needed
    const navInner = document.querySelector('.nav-inner');
    const mobileMenuToggle = document.getElementById('mobileMenuToggle');
    
    if (window.innerWidth > 992 && navInner && navInner.classList.contains('active')) {
        navInner.classList.remove('active');
        if (mobileMenuToggle) {
            mobileMenuToggle.querySelector('i').classList.remove('fa-times');
            mobileMenuToggle.querySelector('i').classList.add('fa-bars');
        }
        document.body.style.overflow = '';
    }
}, 250));

// ==================== ACCESSIBILITY ====================
// Add keyboard navigation support
document.addEventListener('keydown', function(e) {
    // Tab key navigation focus styles
    if (e.key === 'Tab') {
        document.body.classList.add('keyboard-navigation');
    }
});

// Remove focus styles on mouse click
document.addEventListener('mousedown', function() {
    document.body.classList.remove('keyboard-navigation');
});

// Skip to main content link
const skipLink = document.createElement('a');
skipLink.href = '#main-content';
skipLink.className = 'skip-to-content';
skipLink.textContent = 'Skip to main content';
skipLink.style.cssText = `
    position: absolute;
    top: -40px;
    left: 0;
    background: var(--accent-gold);
    color: var(--primary-dark);
    padding: 8px;
    z-index: 10000;
    text-decoration: none;
    font-weight: bold;
`;
skipLink.addEventListener('focus', function() {
    this.style.top = '0';
});
document.body.insertBefore(skipLink, document.body.firstChild);

// ==================== ERROR HANDLING ====================
// Global error handler
window.addEventListener('error', function(e) {
    console.error('Global error:', e.error);
    
    // Log to analytics in production
    if (typeof ga !== 'undefined') {
        ga('send', 'exception', {
            exDescription: e.error.message,
            exFatal: false
        });
    }
});

// Unhandled promise rejection handler
window.addEventListener('unhandledrejection', function(e) {
    console.error('Unhandled promise rejection:', e.reason);
});

// ==================== THREE.JS BACKGROUND (OPTIONAL) ====================
function initThreeJSBackground() {
    const container = document.getElementById('threejs-background');
    if (!container || typeof THREE === 'undefined') return;
    
    // Only run on desktop for performance
    if (window.innerWidth < 992) {
        container.style.display = 'none';
        return;
    }
    
    try {
        // Setup Three.js scene
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer({ 
            alpha: true, 
            antialias: true,
            powerPreference: 'low-power' // Better for mobile
        });
        
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); // Limit for performance
        container.appendChild(renderer.domElement);
        
        // Create simple mountains (low poly for performance)
        const createMountain = (x, y, z, size) => {
            const geometry = new THREE.ConeGeometry(size, size * 1.5, 4);
            const material = new THREE.MeshBasicMaterial({
                color: 0x1a365d,
                transparent: true,
                opacity: 0.08
            });
            const mountain = new THREE.Mesh(geometry, material);
            mountain.position.set(x, y, z);
            scene.add(mountain);
            return mountain;
        };
        
        // Add mountains
        const mountains = [];
        for (let i = 0; i < 6; i++) { // Reduced count for performance
            const x = (Math.random() - 0.5) * 60;
            const z = (Math.random() - 0.5) * 40 - 30;
            const size = 3 + Math.random() * 4;
            mountains.push(createMountain(x, -15, z, size));
        }
        
        camera.position.z = 25;
        camera.position.y = 5;
        
        // Animation with frame limiting for performance
        let frameCount = 0;
        function animate() {
            requestAnimationFrame(animate);
            
            // Only update every other frame on mobile
            if (window.innerWidth < 1200 && frameCount % 2 === 0) {
                frameCount++;
                return;
            }
            
            // Slow rotation
            mountains.forEach((mountain, i) => {
                mountain.rotation.y += 0.0005 * (i + 1);
            });
            
            renderer.render(scene, camera);
            frameCount++;
        }
        
        // Handle resize
        const handleResize = debounce(() => {
            if (window.innerWidth < 992) {
                container.style.display = 'none';
                return;
            }
            
            container.style.display = 'block';
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
            renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        }, 250);
        
        window.addEventListener('resize', handleResize);
        
        // Start animation
        animate();
        
    } catch (error) {
        console.warn('Three.js initialization failed:', error);
        container.style.display = 'none';
    }
}

// Initialize Three.js when available
if (typeof THREE !== 'undefined') {
    document.addEventListener('DOMContentLoaded', initThreeJSBackground);
}

// ==================== BROWSER COMPATIBILITY ====================
// Check for modern browser features
function checkBrowserCompatibility() {
    const features = {
        'IntersectionObserver': 'IntersectionObserver' in window,
        'Fetch': 'fetch' in window,
        'Promise': 'Promise' in window,
        'CSSVariables': window.CSS && window.CSS.supports && window.CSS.supports('(--v:0)'),
        'Flexbox': 'flexWrap' in document.documentElement.style
    };
    
    const missingFeatures = Object.entries(features).filter(([_, supported]) => !supported);
    
    if (missingFeatures.length > 0) {
        console.warn('Missing browser features:', missingFeatures.map(([name]) => name));
        
        // Add warning for very old browsers
        if (!features.CSSVariables || !features.Fetch) {
            const warning = document.createElement('div');
            warning.style.cssText = `
                background: #f8d7da;
                color: #721c24;
                padding: 10px;
                text-align: center;
                border-bottom: 1px solid #f5c6cb;
                font-size: 14px;
            `;
            warning.innerHTML = `
                Your browser is outdated. Some features may not work properly.
                <a href="https://browsehappy.com/" style="color: #721c24; font-weight: bold;">
                    Update your browser
                </a> for the best experience.
            `;
            document.body.insertBefore(warning, document.body.firstChild);
        }
    }
}

// Run compatibility check
checkBrowserCompatibility();

// ==================== UTILITY FUNCTIONS ====================
// Get current breakpoint
function getCurrentBreakpoint() {
    const width = window.innerWidth;
    if (width >= 1200) return 'xl';
    if (width >= 992) return 'lg';
    if (width >= 768) return 'md';
    if (width >= 576) return 'sm';
    return 'xs';
}

// Check if element is in viewport
function isInViewport(element) {
    const rect = element.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
}

// Get scroll position
function getScrollPosition() {
    return {
        x: window.pageXOffset || document.documentElement.scrollLeft,
        y: window.pageYOffset || document.documentElement.scrollTop
    };
}

// Format currency
function formatCurrency(amount, currency = 'USD') {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: currency,
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(amount);
}

// Initialize currency formatting on itinerary prices
function initCurrencyFormatting() {
    const priceElements = document.querySelectorAll('.itinerary-price');
    priceElements.forEach(el => {
        const text = el.textContent.trim();
        if (text.startsWith('$') && !isNaN(parseFloat(text.replace('$', '').replace(',', '')))) {
            const amount = parseFloat(text.replace('$', '').replace(',', ''));
            el.textContent = formatCurrency(amount);
        }
    });
}

// Run currency formatting
initCurrencyFormatting();

// Export utility functions for debugging
if (process.env.NODE_ENV === 'development') {
    window.M41Travel = {
        getCurrentBreakpoint,
        isInViewport,
        getScrollPosition,
        formatCurrency
    };
}

console.log('M41 Travel JavaScript initialized successfully');