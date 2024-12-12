import { loadHeader } from '../components/header/header-loader.js';
import { loadFooter } from '../components/footer/footer-loader.js';
import { checkSession } from './auth/supabase-client.js';

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', async () => {
    try {
        // Check auth state first
        await checkSession();
        
        // Then load header and footer
        await loadHeader();
        loadFooter();

        // Initialize custom cursor
        if (window.matchMedia("(pointer: fine)").matches) {
            const cursor = document.createElement('div');
            const follower = document.createElement('div');
            
            cursor.className = 'custom-cursor';
            follower.className = 'custom-cursor-follower';
            
            document.body.appendChild(cursor);
            document.body.appendChild(follower);
            
            document.addEventListener('mousemove', (e) => {
                cursor.style.transform = `translate3d(${e.clientX - 20}px, ${e.clientY - 20}px, 0)`;
                follower.style.transform = `translate3d(${e.clientX - 6}px, ${e.clientY - 6}px, 0)`;
            });
        }
    } catch (error) {
        console.error('Error initializing page:', error);
    }
}); 