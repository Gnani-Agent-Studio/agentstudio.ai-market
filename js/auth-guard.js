import { getCurrentUser } from './auth-state.js';

export async function guardAuthPages() {
    try {
        const user = getCurrentUser();
        if (user) {
            console.log('User is authenticated, redirecting from auth page');
            window.location.href = './index.html';
            return true;
        }
        return false;
    } catch (error) {
        console.error('Error checking auth state:', error);
        return false;
    }
} 