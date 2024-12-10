document.addEventListener('DOMContentLoaded', () => {
    // Only add custom cursor on non-touch devices
    if (window.matchMedia("(pointer: fine)").matches) {
        const cursor = document.createElement('div');
        const follower = document.createElement('div');
        
        cursor.className = 'custom-cursor';
        follower.className = 'custom-cursor-follower';
        
        document.body.appendChild(cursor);
        document.body.appendChild(follower);
        
        let cursorX = 0;
        let cursorY = 0;
        let followerX = 0;
        let followerY = 0;

        document.addEventListener('mousemove', (e) => {
            cursorX = e.clientX;
            cursorY = e.clientY;

            // Set initial position immediately
            cursor.style.transform = `translate3d(${cursorX - 20}px, ${cursorY - 20}px, 0)`;
            follower.style.transform = `translate3d(${cursorX - 6}px, ${cursorY - 6}px, 0)`;
        });

        // Smoother animation loop
        function updateCursor() {
            followerX += (cursorX - followerX) * 0.3;
            followerY += (cursorY - followerY) * 0.3;
            
            cursor.style.transform = `translate3d(${cursorX - 20}px, ${cursorY - 20}px, 0)`;
            follower.style.transform = `translate3d(${followerX - 6}px, ${followerY - 6}px, 0)`;
            
            requestAnimationFrame(updateCursor);
        }
        updateCursor();

        // Add cursor styles to body
        document.body.style.cursor = 'none';
    } else {
        // For touch devices, show regular cursor
        document.body.style.cursor = 'auto';
    }

    // Mobile menu functionality
    const mobileMenuButton = document.querySelector('.mobile-menu-button');
    const navDropdown = document.querySelector('.nav-dropdown');
    const submenuTriggers = document.querySelectorAll('.submenu-trigger');

    if (mobileMenuButton) {
        mobileMenuButton.addEventListener('click', () => {
            navDropdown.classList.toggle('active');
            mobileMenuButton.innerHTML = navDropdown.classList.contains('active') 
                ? '<i class="fas fa-times"></i>'
                : '<i class="fas fa-bars"></i>';
        });

        // Handle submenu toggles
        submenuTriggers.forEach(trigger => {
            trigger.addEventListener('click', (e) => {
                e.preventDefault();
                const parent = trigger.parentElement;
                parent.classList.toggle('active');
            });
        });

        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!navDropdown.contains(e.target) && !mobileMenuButton.contains(e.target)) {
                navDropdown.classList.remove('active');
                mobileMenuButton.innerHTML = '<i class="fas fa-bars"></i>';
                
                // Close all submenus
                document.querySelectorAll('.has-submenu').forEach(item => {
                    item.classList.remove('active');
                });
            }
        });

        // Prevent menu from closing when clicking inside
        navDropdown.addEventListener('click', (e) => {
            e.stopPropagation();
        });
    }

    // Handle 404 for broken links
    const handleBrokenLinks = () => {
        const links = document.querySelectorAll('a');
        links.forEach(link => {
            link.addEventListener('click', (e) => {
                if (link.getAttribute('href') === '#' || !link.getAttribute('href')) {
                    e.preventDefault();
                    const main = document.querySelector('main') || document.body;
                    const notFound = document.createElement('div');
                    notFound.className = 'page-not-found';
                    insertContent(notFound, `
                        <h1 class="gradient-text">Page Coming Soon</h1>
                        <p>${sanitizeHTML('This feature is currently under development.')}</p>
                        <a href="javascript:history.back()">Go Back</a>
                    `);
                    main.innerHTML = '';
                    main.appendChild(notFound);
                }
            });
        });
    };

    handleBrokenLinks();

    // Intersection Observer for animations
    const observerOptions = {
        threshold: 0.2,
        rootMargin: '0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    document.querySelectorAll('.feature-card, .benefit-item, .icon-container').forEach(el => {
        el.classList.add('animate-on-scroll');
        observer.observe(el);
    });

    // Ambient light effect for benefit items
    const benefits = document.querySelector('.benefits-grid');
    
    if (benefits) {
        benefits.addEventListener('mousemove', (e) => {
            document.querySelectorAll('.benefit-item').forEach(card => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;

                card.style.setProperty('--mouse-x', `${x}px`);
                card.style.setProperty('--mouse-y', `${y}px`);
            });
        });
    }

    // Add floating animation to cards
    document.querySelectorAll('.agent-card, .benefit-item').forEach(card => {
        card.classList.add('floating');
        card.style.animationDelay = `${Math.random() * 2}s`;
    });

    // Add glow effect to icons on scroll
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('glow');
            }
        });
    }, { threshold: 0.5 });

    document.querySelectorAll('.icon-container').forEach(icon => {
        observer.observe(icon);
    });

    // Initialize neural animation for about page
    const aboutHero = document.querySelector('.about-hero');
    if (aboutHero) {
        const neuralNetwork = createNeuralNetwork();
        const particles = createParticles();
        const dataStreams = createDataStreams();
        
        aboutHero.appendChild(neuralNetwork);
        aboutHero.appendChild(particles);
        aboutHero.appendChild(dataStreams);

        // Add floating animation to feature items
        document.querySelectorAll('.feature-list li').forEach((item, index) => {
            item.style.animationDelay = `${index * 0.1}s`;
            item.classList.add('fade-in-up');
        });

        // Add parallax effect
        document.addEventListener('mousemove', (e) => {
            const moveX = (e.clientX - window.innerWidth / 2) * 0.01;
            const moveY = (e.clientY - window.innerHeight / 2) * 0.01;

            neuralNetwork.style.transform = `translate(${moveX}px, ${moveY}px)`;
            particles.style.transform = `translate(${moveX * 1.5}px, ${moveY * 1.5}px)`;
        });
    }

    // Image security validation
    function validateImage(url) {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = function() {
                // Check if image is from allowed domain
                const allowedDomains = [
                    'agent-studio.ai',
                    'cdn.agent-studio.ai',
                    'images.agent-studio.ai'
                ];
                
                try {
                    const imageUrl = new URL(url);
                    if (!allowedDomains.includes(imageUrl.hostname)) {
                        reject(new Error('Invalid image domain'));
                        return;
                    }
                    
                    // Check image dimensions
                    if (this.width > 4000 || this.height > 4000) {
                        reject(new Error('Image dimensions too large'));
                        return;
                    }
                    
                    // Check file size (if available)
                    if (this.size && this.size > 5 * 1024 * 1024) { // 5MB limit
                        reject(new Error('Image file size too large'));
                        return;
                    }
                    
                    resolve(url);
                } catch (error) {
                    reject(new Error('Invalid image URL'));
                }
            };
            
            img.onerror = function() {
                reject(new Error('Failed to load image'));
            };
            
            img.src = url;
        });
    }

    // Use the validation when loading images
    function loadSecureImage(imgElement, url) {
        validateImage(url)
            .then(validatedUrl => {
                imgElement.src = validatedUrl;
            })
            .catch(error => {
                console.error('Image validation failed:', error);
                imgElement.src = 'images/fallback-image.svg'; // Load fallback image
            });
    }

    // Apply to all images
    document.querySelectorAll('img').forEach(img => {
        if (img.src) {
            loadSecureImage(img, img.src);
        }
    });

    // Form handling with loading states
    document.querySelectorAll('form').forEach(form => {
        form.addEventListener('submit', (e) => {
            const submitButton = form.querySelector('[type="submit"]');
            if (submitButton) {
                submitButton.classList.add('loading');
                submitButton.disabled = true;
            }
        });
    });
});

function createNeuralNetwork() {
    const container = document.createElement('div');
    container.className = 'neural-network';
    
    // Create nodes
    for (let i = 0; i < 20; i++) {
        const node = document.createElement('div');
        node.className = 'neural-node';
        node.style.left = `${Math.random() * 100}%`;
        node.style.top = `${Math.random() * 100}%`;
        node.style.animationDelay = `${Math.random() * 2}s`;
        container.appendChild(node);
    }
    
    // Create connections
    for (let i = 0; i < 30; i++) {
        const connection = document.createElement('div');
        connection.className = 'neural-connection';
        connection.style.left = `${Math.random() * 100}%`;
        connection.style.top = `${Math.random() * 100}%`;
        connection.style.width = `${50 + Math.random() * 100}px`;
        connection.style.transform = `rotate(${Math.random() * 360}deg)`;
        connection.style.animationDelay = `${Math.random() * 3}s`;
        container.appendChild(connection);
    }

    return container;
}

function createParticles() {
    const container = document.createElement('div');
    container.className = 'particles-container';
    
    for (let i = 0; i < 50; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.left = `${Math.random() * 100}%`;
        particle.style.top = `${Math.random() * 100}%`;
        particle.style.animationDuration = `${10 + Math.random() * 20}s`;
        particle.style.animationDelay = `${Math.random() * 5}s`;
        container.appendChild(particle);
    }

    return container;
}

function createDataStreams() {
    const container = document.createElement('div');
    container.className = 'data-streams';
    
    for (let i = 0; i < 10; i++) {
        const stream = document.createElement('div');
        stream.className = 'data-stream';
        stream.style.left = `${Math.random() * 100}%`;
        stream.style.height = `${50 + Math.random() * 100}px`;
        stream.style.animationDelay = `${Math.random() * 2}s`;
        container.appendChild(stream);
    }

    return container;
}

// HTML sanitization function
function sanitizeHTML(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
}

// Use when inserting dynamic content
function insertContent(element, content) {
    if (typeof content === 'string') {
        element.innerHTML = sanitizeHTML(content);
    }
} 