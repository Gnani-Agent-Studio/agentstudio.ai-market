import { supabase } from './supabase-client.js';

export async function checkAuthState() {
    try {
        await window.supabaseLoaded;
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) throw error;
        return !!session;
    } catch (error) {
        console.error('Error checking auth state:', error);
        // Fallback to checking localStorage
        try {
            const user = JSON.parse(localStorage.getItem('user'));
            return !!user;
        } catch {
            return false;
        }
    }
}

export function getCurrentUser() {
    try {
        const user = JSON.parse(localStorage.getItem('user'));
        return user;
    } catch {
        return null;
    }
}

// Function to update UI based on auth state
export async function updateAuthUI() {
    const authDependent = document.querySelectorAll('.auth-dependent');
    const loginButtons = document.querySelectorAll('.login-button');
    const signupButtons = document.querySelectorAll('.signup-button');

    if (currentUser) {
        // Show auth-dependent elements
        authDependent.forEach(el => {
            el.style.display = 'flex';
            const userNames = el.querySelectorAll('.user-name');
            userNames.forEach(name => {
                name.textContent = currentUser.user_metadata?.full_name || currentUser.email;
            });
        });

        // Hide login/signup buttons when logged in
        loginButtons.forEach(btn => btn.style.display = 'none');
        signupButtons.forEach(btn => btn.style.display = 'none');

        // Redirect from auth pages
        const currentPath = window.location.pathname;
        if (currentPath.includes('login.html') || currentPath.includes('signup.html')) {
            window.location.href = './ai-agents.html';
        }
    } else {
        // Hide auth-dependent elements
        authDependent.forEach(el => el.style.display = 'none');

        // Show login/signup buttons when logged out
        loginButtons.forEach(btn => btn.style.display = 'block');
        signupButtons.forEach(btn => btn.style.display = 'block');
    }
} 