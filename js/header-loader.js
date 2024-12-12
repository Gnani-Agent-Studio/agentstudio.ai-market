import { checkAuthState } from './auth-state.js';
import { supabase } from './supabase-client.js';

function getCurrentPage() {
    const path = window.location.pathname;
    return path.split('/').pop().replace('.html', '') || 'index';
}

export async function loadHeader() {
    try {
        await window.supabaseLoaded;
        
        const header = document.createElement('header');
        header.className = 'main-header';
        
        const nav = document.createElement('nav');
        nav.className = 'nav-container';
        
        // Create logo
        const logo = createLogo();
        
        // Create navigation menu
        const menu = await createNavMenu();
        
        // Add mobile menu toggle
        const menuToggle = createMobileToggle();
        
        nav.appendChild(logo);
        nav.appendChild(menu);
        nav.appendChild(menuToggle); // Move toggle to end
        
        header.appendChild(nav);
        document.body.prepend(header);
        
        // Initialize mobile menu behavior
        initializeMobileMenu(menuToggle, menu);
    } catch (error) {
        console.error('Error loading header:', error);
    }
}

function createLogo() {
    const logoDiv = document.createElement('div');
    logoDiv.className = 'logo';
    logoDiv.innerHTML = '<a href="index.html">Agent-Studio.AI</a>';
    return logoDiv;
}

function createMobileToggle() {
    const toggle = document.createElement('button');
    toggle.className = 'mobile-menu-toggle';
    toggle.setAttribute('aria-label', 'Toggle menu');
    toggle.innerHTML = `
        <span class="hamburger"></span>
    `;
    return toggle;
}

async function createNavMenu() {
    const menu = document.createElement('ul');
    menu.className = 'nav-menu';
    
    const currentPage = getCurrentPage();
    
    const menuItems = [
        { text: 'Home', href: 'index.html', class: currentPage === 'index' ? 'active' : '' },
        { text: 'AI Agents', href: 'ai-agents.html', class: currentPage === 'ai-agents' ? 'active' : '' },
        { text: 'For Users', href: 'for-users.html', class: currentPage === 'for-users' ? 'active' : '' },
        { text: 'For Developers', href: 'for-developers.html', class: currentPage === 'for-developers' ? 'active' : '' },
        { text: 'About Us', href: 'about.html', class: currentPage === 'about' ? 'active' : '' },
        { text: 'Pricing', href: 'pricing.html', class: currentPage === 'pricing' ? 'active' : '' },
        { text: 'Contact', href: 'contact.html', class: currentPage === 'contact' ? 'active' : '' },
    ];

    const isAuthenticated = await checkAuthState();

    if (isAuthenticated) {
        menuItems.push(createUserMenu());
    } else {
        menuItems.push(
            { text: 'Login', href: 'login.html', class: `nav-button login ${currentPage === 'login' ? 'active' : ''}` },
            { text: 'Sign Up', href: 'signup.html', class: `nav-button highlight ${currentPage === 'signup' ? 'active' : ''}` }
        );
    }

    menuItems.forEach(item => {
        const li = document.createElement('li');
        if (typeof item === 'object' && item.href) {
            li.innerHTML = `<a href="${item.href}" class="${item.class || ''}">${item.text}</a>`;
        } else {
            li.appendChild(item);
        }
        menu.appendChild(li);
    });

    return menu;
}

function createUserMenu() {
    const userMenu = document.createElement('div');
    userMenu.className = 'user-menu';
    
    const userData = JSON.parse(localStorage.getItem('user'));
    const userInitial = userData?.user_metadata?.full_name?.[0] || 
                       userData?.email?.[0]?.toUpperCase() || 'U';
    
    const avatarUrl = userData?.user_metadata?.avatar_url;
    
    const avatarContent = avatarUrl 
        ? `<img src="${avatarUrl}" alt="Profile" class="user-avatar-img">` 
        : userInitial;
    
    userMenu.innerHTML = `
        <div class="user-avatar">${avatarContent}</div>
        <div class="user-dropdown">
            <a href="profile.html">Profile</a>
            <button class="logout-link">Logout</button>
        </div>
    `;
    
    const logoutButton = userMenu.querySelector('.logout-link');
    logoutButton.addEventListener('click', handleLogout);
    
    return userMenu;
}

function initializeMobileMenu(toggle, menu) {
    const menuOverlay = document.querySelector('.menu-overlay');

    function toggleMenu() {
        const isOpen = menu.classList.contains('active');
        
        // Toggle menu
        toggle.classList.toggle('active');
        menu.classList.toggle('active');
        document.body.classList.toggle('menu-open');
        
        // Toggle overlay
        if (menuOverlay) {
            menuOverlay.classList.toggle('active');
            menuOverlay.style.display = isOpen ? 'none' : 'block';
        }
    }

    function closeMenu() {
        toggle.classList.remove('active');
        menu.classList.remove('active');
        document.body.classList.remove('menu-open');
        if (menuOverlay) {
            menuOverlay.classList.remove('active');
            menuOverlay.style.display = 'none';
        }
    }

    // Toggle menu on button click
    toggle.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        toggleMenu();
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (menu.classList.contains('active') && 
            !menu.contains(e.target) && 
            !toggle.contains(e.target)) {
            closeMenu();
        }
    });

    // Close menu when clicking links
    menu.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            closeMenu();
        });
    });

    // Close menu on escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && menu.classList.contains('active')) {
            closeMenu();
        }
    });

    // Close menu when clicking overlay
    if (menuOverlay) {
        menuOverlay.addEventListener('click', closeMenu);
    }

    // Handle window resize
    window.addEventListener('resize', () => {
        if (window.innerWidth > 1280) {
            menu.style.display = 'flex';
            menu.classList.remove('active');
            toggle.classList.remove('active');
            document.body.classList.remove('menu-open');
            if (menuOverlay) {
                menuOverlay.style.display = 'none';
                menuOverlay.classList.remove('active');
            }
        }
    });
}

async function handleLogout(e) {
    e.preventDefault();
    try {
        localStorage.removeItem('user');
        const { error } = await supabase.auth.signOut();
        
        if (error) {
            console.error('Supabase signout error:', error);
        }
        
        window.location.href = 'login.html';
    } catch (error) {
        console.error('Error logging out:', error);
        localStorage.removeItem('user');
        window.location.href = 'login.html';
    }
}