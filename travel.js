// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    
    // Remove preloader after page loads
    window.addEventListener('load', function() {
        const preloader = document.querySelector('.preloader');
        setTimeout(() => {
            preloader.style.opacity = '0';
            setTimeout(() => {
                preloader.style.display = 'none';
            }, 500);
        }, 1000);
    });
    
    // Mobile menu toggle
    const menuToggle = document.getElementById('menuToggle');
    const navMenu = document.querySelector('.nav-menu');
    
    if (menuToggle) {
        menuToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            this.innerHTML = navMenu.classList.contains('active') 
                ? '<i class="fas fa-times"></i>' 
                : '<i class="fas fa-bars"></i>';
        });
    }
    
    // Close mobile menu when clicking a link
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            navMenu.classList.remove('active');
            menuToggle.innerHTML = '<i class="fas fa-bars"></i>';
        });
    });
    
    // Video play button
    const playButton = document.getElementById('playVideo');
    const showcaseVideo = document.querySelector('.showcase-video');
    
    if (playButton && showcaseVideo) {
        playButton.addEventListener('click', function() {
            if (showcaseVideo.paused) {
                showcaseVideo.play();
                playButton.innerHTML = '<i class="fas fa-pause"></i>';
                playButton.style.opacity = '0.7';
            } else {
                showcaseVideo.pause();
                playButton.innerHTML = '<i class="fas fa-play"></i>';
                playButton.style.opacity = '1';
            }
        });
        
        showcaseVideo.addEventListener('play', function() {
            playButton.innerHTML = '<i class="fas fa-pause"></i>';
            playButton.style.opacity = '0.7';
        });
        
        showcaseVideo.addEventListener('pause', function() {
            playButton.innerHTML = '<i class="fas fa-play"></i>';
            playButton.style.opacity = '1';
        });
    }
    
    // Form submission handling
    const adventureForm = document.getElementById('adventureForm');
    
    if (adventureForm) {
        adventureForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Basic form validation
            const firstName = document.getElementById('firstName');
            const email = document.getElementById('email');
            
            if (!firstName.value.trim()) {
                showFormError(firstName, 'Please enter your first name');
                return;
            }
            
            if (!email.value.trim() || !isValidEmail(email.value)) {
                showFormError(email, 'Please enter a valid email address');
                return;
            }
            
            // In a real implementation, you would send the form data to a server
            // For now, we'll just show a success message
            const submitButton = adventureForm.querySelector('.btn-submit');
            const originalText = submitButton.innerHTML;
            
            submitButton.innerHTML = '<i class="fas fa-check"></i><span>Message Sent!</span>';
            submitButton.style.backgroundColor = '#2a9d8f';
            
            setTimeout(() => {
                submitButton.innerHTML = originalText;
                submitButton.style.backgroundColor = '';
                adventureForm.reset();
            }, 3000);
        });
    }
    
    // Helper function for form validation
    function showFormError(inputElement, message) {
        inputElement.style.borderBottomColor = '#e74c3c';
        
        // Remove any existing error message
        const existingError = inputElement.parentNode.querySelector('.error-message');
        if (existingError) existingError.remove();
        
        // Create and insert error message
        const errorElement = document.createElement('div');
        errorElement.className = 'error-message';
        errorElement.style.color = '#e74c3c';
        errorElement.style.fontSize = '0.8rem';
        errorElement.style.marginTop = '0.3rem';
        errorElement.textContent = message;
        
        inputElement.parentNode.appendChild(errorElement);
        
        // Focus the problematic field
        inputElement.focus();
        
        // Remove error styling after correction
        inputElement.addEventListener('input', function() {
            this.style.borderBottomColor = '';
            if (errorElement) errorElement.remove();
        }, { once: true });
    }
    
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
    
    // Parallax effect on scroll
    window.addEventListener('scroll', function() {
        const scrolled = window.pageYOffset;
        const parallaxElements = document.querySelectorAll('.parallax');
        
        parallaxElements.forEach(element => {
            const speed = element.getAttribute('data-speed') || 0.5;
            element.style.transform = `translateY(${scrolled * speed}px)`;
        });
        
        // Header background on scroll
        const header = document.querySelector('.header');
        if (scrolled > 100) {
            header.style.backgroundColor = 'rgba(13, 27, 42, 0.98)';
            header.style.backdropFilter = 'blur(15px)';
        } else {
            header.style.backgroundColor = 'rgba(13, 27, 42, 0.95)';
            header.style.backdropFilter = 'blur(10px)';
        }
    });
    
    // Initialize Vanilla Tilt for 3D card effects
    if (typeof VanillaTilt !== 'undefined') {
        VanillaTilt.init(document.querySelectorAll('[data-tilt]'), {
            max: 15,
            speed: 400,
            glare: true,
            'max-glare': 0.5,
            scale: 1.05
        });
    }
    
    // Animate elements on scroll
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, observerOptions);
    
    // Observe elements to animate
    const animateElements = document.querySelectorAll('.experience-card, .team-member, .itinerary-card, .info-card');
    animateElements.forEach(el => {
        observer.observe(el);
    });
    
    // Add CSS for animation
    const style = document.createElement('style');
    style.textContent = `
        .animate-in {
            animation: fadeInUp 0.8s ease-out forwards;
        }
        
        @keyframes fadeInUp {
            from {
                opacity: 0;
                transform: translateY(30px) translateZ(-50px);
            }
            to {
                opacity: 1;
                transform: translateY(0) translateZ(0);
            }
        }
        
        .experience-card:nth-child(2) .animate-in,
        .team-member:nth-child(2) .animate-in,
        .itinerary-card:nth-child(2) .animate-in {
            animation-delay: 0.2s;
        }
        
        .experience-card:nth-child(3) .animate-in,
        .team-member:nth-child(3) .animate-in,
        .itinerary-card:nth-child(3) .animate-in {
            animation-delay: 0.4s;
        }
        
        .error-message {
            color: #e74c3c;
            font-size: 0.8rem;
            margin-top: 0.3rem;
        }
    `;
    document.head.appendChild(style);
});

// Simple Three.js background (optional - for more advanced 3D)
function initThreeJSBackground() {
    // Check if Three.js is loaded
    if (typeof THREE === 'undefined') return;
    
    const container = document.getElementById('threejs-background');
    if (!container) return;
    
    // Setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    container.appendChild(renderer.domElement);
    
    // Create mountains
    const createMountain = (x, y, z, height) => {
        const geometry = new THREE.ConeGeometry(5, height, 8);
        const material = new THREE.MeshBasicMaterial({ 
            color: 0x1a365d,
            transparent: true,
            opacity: 0.1
        });
        const mountain = new THREE.Mesh(geometry, material);
        mountain.position.set(x, y, z);
        scene.add(mountain);
        return mountain;
    };
    
    // Add mountains
    const mountains = [];
    for (let i = 0; i < 10; i++) {
        const x = (Math.random() - 0.5) * 100;
        const z = (Math.random() - 0.5) * 100 - 50;
        const height = 5 + Math.random() * 10;
        mountains.push(createMountain(x, -20, z, height));
    }
    
    // Camera position
    camera.position.z = 30;
    camera.position.y = 5;
    
    // Animation
    function animate() {
        requestAnimationFrame(animate);
        
        // Rotate mountains slowly
        mountains.forEach((mountain, i) => {
            mountain.rotation.y += 0.001 * (i + 1);
        });
        
        renderer.render(scene, camera);
    }
    
    // Handle window resize
    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });
    
    animate();
}

// Initialize Three.js background when Three.js is loaded
if (typeof THREE !== 'undefined') {
    window.addEventListener('load', initThreeJSBackground);
}