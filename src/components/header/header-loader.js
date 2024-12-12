import { getCurrentUser } from '../../js/auth/supabase-client.js';

// Function to get current page name
function getCurrentPage() {
    const path = window.location.pathname;
    return path.split('/').pop().replace('.html', '') || 'index';
}

// Header HTML template
const headerTemplate = `
<header class="main-header">
    <nav class="nav-container">
        <div class="logo">
            <a href="/" class="gradient-text">Agent-Studio.AI</a>
        </div>
        <ul class="nav-menu">
            <li><a href="index.html" data-page="index">Home</a></li>
            <li><a href="ai-agents.html" data-page="ai-agents">AI Agents</a></li>
            <li><a href="for-users.html" data-page="for-users">For Users</a></li>
            <li><a href="for-developers.html" data-page="for-developers">For Developers</a></li>
            <li><a href="about.html" data-page="about">About Us</a></li>
            <li><a href="pricing.html" data-page="pricing">Pricing</a></li>
            <li><a href="contact.html" data-page="contact">Contact</a></li>
            <li class="user-menu auth-dependent" style="display: none;">
                <div class="user-avatar">
                    <i class="fas fa-user"></i>
                </div>
                <div class="user-dropdown">
                    <div class="dropdown-header">
                        <span class="user-name"></span>
                    </div>
                    <a href="profile.html">
                        <i class="fas fa-user-circle"></i> Profile
                    </a>
                    <a href="#" onclick="handleSignOut(event)">
                        <i class="fas fa-sign-out-alt"></i> Sign Out
                    </a>
                </div>
            </li>
            <li class="login-button">
                <a href="login.html" class="nav-button">Login</a>
            </li>
            <li class="signup-button">
                <a href="signup.html" class="nav-button highlight">Sign Up</a>
            </li>
        </ul>
    </nav>
</header>
`;

// Function to update header UI based on auth state
export async function updateHeaderUI() {
    try {
        const user = getCurrentUser();
        const authDependent = document.querySelectorAll('.auth-dependent');
        const loginButtons = document.querySelectorAll('.login-button');
        const signupButtons = document.querySelectorAll('.signup-button');

        if (user) {
            authDependent.forEach(el => {
                el.style.display = 'flex';
                const userNames = el.querySelectorAll('.user-name');
                userNames.forEach(name => {
                    name.textContent = user.user_metadata?.full_name || user.email;
                });
            });
            loginButtons.forEach(btn => btn.style.display = 'none');
            signupButtons.forEach(btn => btn.style.display = 'none');
        } else {
            authDependent.forEach(el => el.style.display = 'none');
            loginButtons.forEach(btn => btn.style.display = 'block');
            signupButtons.forEach(btn => btn.style.display = 'block');
        }
    } catch (error) {
        console.error('Error updating header UI:', error);
    }
}

// Function to load header
export async function loadHeader() {
    document.body.insertAdjacentHTML('afterbegin', headerTemplate);
    await updateHeaderUI();
} 