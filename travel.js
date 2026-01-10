// M41 Travel - Main JavaScript File
document.addEventListener('DOMContentLoaded', function() {
    console.log('M41 Travel Website Initialized');
    
    // Initialize all components
    initMobileNavigation();
    initSmoothScroll();
    initFormValidation();
    initAnimations();
    initCardInteractions();
    initImageLoading();
    initThreeJSBackground();
    
    // Fix for GitHub Pages display issues
    fixGitHubDisplayIssues();
});

// ==================== MOBILE NAVIGATION ====================
function initMobileNavigation() {
    const mobileMenuToggle = document.getElementById('mobileMenuToggle');
    const navInner = document.querySelector('.nav-inner');
    const navItems = document.querySelectorAll('.nav-item');
    
    if (!mobileMenuToggle || !navInner) return;
    
    // Toggle mobile menu
    function toggleMobileMenu() {
        mobileMenuToggle.classList.toggle('active');
        navInner.classList.toggle('active');
        
        // Toggle body scroll lock
        if (navInner.classList.contains('active')) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
    }
    
    // Add click event to hamburger button
    mobileMenuToggle.addEventListener('click', function(e) {
        e.stopPropagation();
        toggleMobileMenu();
    });
    
    // Close menu when clicking on nav items
    navItems.forEach(item => {
        item.addEventListener('click', function() {
            if (navInner.classList.contains('active')) {
                toggleMobileMenu();
            }
        });
    });
    
    // Close menu when clicking outside
    document.addEventListener('click', function(e) {
        if (navInner.classList.contains('active') && 
            !navInner.contains(e.target) && 
            !mobileMenuToggle.contains(e.target)) {
            toggleMobileMenu();
        }
    });
    
    // Close menu on escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && navInner.classList.contains('active')) {
            toggleMobileMenu();
        }
    });
    
    // Close menu on window resize (if resized to desktop)
    window.addEventListener('resize', function() {
        if (window.innerWidth > 992 && navInner.classList.contains('active')) {
            toggleMobileMenu();
        }
    });
}

// ==================== SMOOTH SCROLL ====================
function initSmoothScroll() {
    const header = document.querySelector('.header');
    const headerHeight = header ? header.offsetHeight : 80;
    
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                e.preventDefault();
                
                // Calculate offset based on screen size
                let offset = headerHeight;
                if (window.innerWidth <= 768) {
                    offset = headerHeight + 10;
                }
                
                const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - offset;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// ==================== FORM VALIDATION ====================
function initFormValidation() {
    const adventureForm = document.getElementById('adventureForm');
    if (!adventureForm) return;
    
    // Form validation function
    function validateForm() {
        let isValid = true;
        const firstName = document.getElementById('first_name');
        const email = document.getElementById('email');
        
        // Reset previous errors
        clearFormErrors();
        
        // Validate first name
        if (!firstName.value.trim()) {
            showFormError(firstName, 'First name is required');
            isValid = false;
        }
        
        // Validate email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email.value.trim()) {
            showFormError(email, 'Email is required');
            isValid = false;
        } else if (!emailRegex.test(email.value)) {
            showFormError(email, 'Please enter a valid email address');
            isValid = false;
        }
        
        return isValid;
    }
    
    // Show form error
    function showFormError(input, message) {
        input.style.borderColor = '#e74c3c';
        
        // Remove existing error
        const existingError = input.parentNode.querySelector('.error-message');
        if (existingError) existingError.remove();
        
        // Create error message
        const errorElement = document.createElement('div');
        errorElement.className = 'error-message';
        errorElement.style.cssText = `
            color: #e74c3c;
            font-size: 0.8rem;
            margin-top: 0.3rem;
            font-weight: 600;
        `;
        errorElement.textContent = message;
        
        input.parentNode.appendChild(errorElement);
        input.focus();
    }
    
    // Clear form errors
    function clearFormErrors() {
        document.querySelectorAll('.error-message').forEach(el => el.remove());
        document.querySelectorAll('.form-group input, .form-group textarea').forEach(el => {
            el.style.borderColor = '#e2e8f0';
        });
    }
    
    // Form submission
    adventureForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        if (!validateForm()) {
            return;
        }
        
        const submitButton = this.querySelector('.btn-submit-3d');
        const originalText = submitButton.innerHTML;
        const originalBg = submitButton.style.background;
        
        // Show loading state
        submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i><span>Sending...</span>';
        submitButton.disabled = true;
        submitButton.style.background = 'var(--accent-teal)';
        
        // Simulate form submission (replace with actual AJAX call)
        setTimeout(() => {
            // Show success message
            submitButton.innerHTML = '<i class="fas fa-check"></i><span>Message Sent!</span>';
            submitButton.style.background = '#27ae60';
            
            // Show success alert
            alert('Your adventure request has been sent successfully! We will contact you soon.');
            
            // Reset form after 3 seconds
            setTimeout(() => {
                adventureForm.reset();
                submitButton.innerHTML = originalText;
                submitButton.style.background = originalBg;
                submitButton.disabled = false;
                clearFormErrors();
                
                // Reset reCAPTCHA if exists
                if (typeof grecaptcha !== 'undefined') {
                    grecaptcha.reset();
                }
            }, 3000);
        }, 1500);
    });
}

// ==================== ANIMATIONS ====================
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
}

// ==================== CARD INTERACTIONS ====================
function initCardInteractions() {
    const tourCards = document.querySelectorAll('.tour-card-3d');
    
    // Add touch support for card flip on mobile
    tourCards.forEach(card => {
        // For mobile touch devices
        card.addEventListener('touchstart', function() {
            this.classList.add('touch-active');
        });
        
        card.addEventListener('touchend', function() {
            this.classList.remove('touch-active');
            
            // On mobile, allow tap to flip (if not clicking a link)
            if (window.innerWidth <= 768) {
                const cardInner = this.querySelector('.card-inner');
                if (cardInner) {
                    cardInner.style.transform = cardInner.style.transform === 'rotateY(180deg)' 
                        ? 'rotateY(0deg)' 
                        : 'rotateY(180deg)';
                }
            }
        });
    });
}

// ==================== IMAGE LOADING ====================
function initImageLoading() {
    // Lazy load images
    const images = document.querySelectorAll('img[data-src]');
    
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                    imageObserver.unobserve(img);
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
    
    // Add loading animation for images
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
}

// ==================== THREE.JS BACKGROUND ====================
function initThreeJSBackground() {
    const container = document.getElementById('threejs-background');
    if (!container || typeof THREE === 'undefined') return;
    
    // Only run on desktop for performance
    if (window.innerWidth < 992) {
        container.style.display = 'none';
        return;
    }
    
    try {
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer({ 
            alpha: true, 
            antialias: true,
            powerPreference: 'low-power'
        });
        
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        container.appendChild(renderer.domElement);
        
        // Create mountains
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
        for (let i = 0; i < 6; i++) {
            const x = (Math.random() - 0.5) * 60;
            const z = (Math.random() - 0.5) * 40 - 30;
            const size = 3 + Math.random() * 4;
            mountains.push(createMountain(x, -15, z, size));
        }
        
        camera.position.z = 25;
        camera.position.y = 5;
        
        // Animation
        function animate() {
            requestAnimationFrame(animate);
            
            // Slow rotation
            mountains.forEach((mountain, i) => {
                mountain.rotation.y += 0.0005 * (i + 1);
            });
            
            renderer.render(scene, camera);
        }
        
        // Handle resize
        window.addEventListener('resize', () => {
            if (window.innerWidth < 992) {
                container.style.display = 'none';
                return;
            }
            
            container.style.display = 'block';
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        });
        
        animate();
        
    } catch (error) {
        console.warn('Three.js initialization failed:', error);
        container.style.display = 'none';
    }
}

// ==================== FIX FOR GITHUB PAGES DISPLAY ISSUES ====================
function fixGitHubDisplayIssues() {
    // Fix for font loading issues on GitHub Pages
    if (window.location.hostname.includes('github.io') || 
        window.location.hostname.includes('github.com')) {
        
        // Force font loading
        const fontLoader = document.createElement('style');
        fontLoader.textContent = `
            @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;600;700;800&family=Open+Sans:wght@300;400;600&display=swap');
        `;
        document.head.appendChild(fontLoader);
        
        // Check if fonts are loaded
        document.fonts.ready.then(() => {
            console.log('Fonts loaded successfully');
        }).catch(err => {
            console.warn('Font loading error:', err);
        });
        
        // Fix for hero section font size on GitHub Pages
        const heroTitle = document.querySelector('.hero-title');
        if (heroTitle && heroTitle.offsetHeight > 300) {
            heroTitle.style.fontSize = '2rem';
            document.querySelectorAll('.title-line').forEach(line => {
                line.style.fontSize = '1.2rem';
            });
        }
    }
    
    // Fix for missing tours section (ensure it's displayed)
    const toursSection = document.querySelector('.tours-section');
    if (toursSection) {
        toursSection.style.display = 'block';
        toursSection.style.visibility = 'visible';
        toursSection.style.opacity = '1';
        toursSection.style.minHeight = 'auto';
    }
    
    // Check for any hidden sections and make them visible
    document.querySelectorAll('section').forEach(section => {
        const computedStyle = window.getComputedStyle(section);
        if (computedStyle.display === 'none' || computedStyle.visibility === 'hidden') {
            section.style.display = 'block';
            section.style.visibility = 'visible';
            section.style.opacity = '1';
        }
    });
}

// ==================== PERFORMANCE OPTIMIZATIONS ====================
// Throttle function for scroll events
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

// Debounce function for resize events
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

// Handle scroll with throttle
window.addEventListener('scroll', throttle(function() {
    const header = document.querySelector('.header');
    const scrolled = window.pageYOffset;
    
    if (header && scrolled > 100) {
        header.style.backgroundColor = 'rgba(10, 25, 47, 0.98)';
    } else if (header) {
        header.style.backgroundColor = 'rgba(10, 25, 47, 0.95)';
    }
}, 100));

// Handle resize with debounce
window.addEventListener('resize', debounce(function() {
    // Re-check Three.js background on resize
    const threeContainer = document.getElementById('threejs-background');
    if (threeContainer) {
        if (window.innerWidth < 992) {
            threeContainer.style.display = 'none';
        } else {
            threeContainer.style.display = 'block';
        }
    }
}, 250));

// ==================== ACCESSIBILITY ====================
// Add keyboard navigation support
document.addEventListener('keydown', function(e) {
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
skipLink.href = '#home';
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
    border-radius: 0 0 4px 0;
`;
skipLink.addEventListener('focus', function() {
    this.style.top = '0';
});
document.body.insertBefore(skipLink, document.body.firstChild);

// ==================== ERROR HANDLING ====================
window.addEventListener('error', function(e) {
    console.error('Global error:', e.error);
});

window.addEventListener('unhandledrejection', function(e) {
    console.error('Unhandled promise rejection:', e.reason);
});

// ==================== BROWSER COMPATIBILITY ====================
function checkBrowserCompatibility() {
    const features = {
        'IntersectionObserver': 'IntersectionObserver' in window,
        'CSSVariables': window.CSS && window.CSS.supports && window.CSS.supports('(--v:0)'),
        'Flexbox': 'flexWrap' in document.documentElement.style
    };
    
    const missingFeatures = Object.entries(features).filter(([_, supported]) => !supported);
    
    if (missingFeatures.length > 0 && !window.location.hostname.includes('github')) {
        console.warn('Missing browser features:', missingFeatures.map(([name]) => name));
    }
}

// Run compatibility check
checkBrowserCompatibility();

// ==================== INITIALIZATION COMPLETE ====================
console.log('M41 Travel website fully initialized');