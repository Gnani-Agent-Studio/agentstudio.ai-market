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

    // Mobile menu toggle
    const mobileMenuButton = document.querySelector('.mobile-menu-button');
    const navMenu = document.querySelector('.nav-menu');

    if (mobileMenuButton) {
        mobileMenuButton.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            mobileMenuButton.classList.toggle('active');
        });
    }

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