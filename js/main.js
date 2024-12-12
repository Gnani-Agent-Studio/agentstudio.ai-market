import { loadHeader } from './header-loader.js';
import { supabase } from './supabase-client.js';

document.addEventListener('DOMContentLoaded', async () => {
    try {
        // Wait for Supabase to be ready
        await window.supabaseLoaded;
        
        // Load header
        await loadHeader();

        // Initialize mobile menu behavior
        initializeMobileMenu();

    } catch (error) {
        console.error('Error initializing page:', error);
    }
});

function initializeMobileMenu() {
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const navMenu = document.querySelector('.nav-menu');
    const menuOverlay = document.querySelector('.menu-overlay');

    if (mobileMenuToggle && navMenu) {
        // Toggle menu on button click
        mobileMenuToggle.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            toggleMenu();
        });

        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (navMenu.classList.contains('active') && 
                !navMenu.contains(e.target) && 
                !mobileMenuToggle.contains(e.target)) {
                closeMenu();
            }
        });

        // Close menu when clicking a link
        navMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                closeMenu();
            });
        });

        // Close menu on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && navMenu.classList.contains('active')) {
                closeMenu();
            }
        });

        // Handle overlay clicks
        if (menuOverlay) {
            menuOverlay.addEventListener('click', closeMenu);
        }
    }

    function toggleMenu() {
        mobileMenuToggle.classList.toggle('active');
        navMenu.classList.toggle('active');
        document.body.classList.toggle('menu-open');
        if (menuOverlay) {
            menuOverlay.style.display = document.body.classList.contains('menu-open') ? 'block' : 'none';
        }
    }

    function closeMenu() {
        mobileMenuToggle.classList.remove('active');
        navMenu.classList.remove('active');
        document.body.classList.remove('menu-open');
        if (menuOverlay) {
            menuOverlay.style.display = 'none';
        }
    }
} 