import { checkSession } from '../js/supabase-client.js';

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
                    <span class="user-name"></span>
                </div>
                <div class="user-dropdown">
                    <div class="dropdown-header">
                        <i class="fas fa-user-circle"></i>
                        <span class="user-name"></span>
                    </div>
                    <a href="profile.html">
                        <i class="fas fa-user-circle"></i> Profile
                    </a>
                    <a href="#" onclick="handleSignOut(event)" class="sign-out-btn">
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

// Function to initialize header
export async function initHeader() {
    // Insert header HTML
    document.body.insertAdjacentHTML('afterbegin', headerTemplate);

    // Set active page in navigation
    const currentPage = window.location.pathname.split('/').pop().replace('.html', '');
    document.querySelector(`[data-page="${currentPage}"]`)?.classList.add('active');

    // Update auth state
    const user = await checkSession();
    console.log('Current user:', user);

    // Update UI based on auth state
    const authDependent = document.querySelectorAll('.auth-dependent');
    const loginButtons = document.querySelectorAll('.login-button');
    const signupButtons = document.querySelectorAll('.signup-button');

    if (user) {
        // Show auth-dependent elements
        authDependent.forEach(el => {
            el.style.display = 'flex';
            // Update user info in dropdown
            const userNameElements = el.querySelectorAll('.user-name');
            userNameElements.forEach(element => {
                element.textContent = user.user_metadata?.full_name || user.email;
            });
        });

        // Hide login/signup buttons
        loginButtons.forEach(el => el.style.display = 'none');
        signupButtons.forEach(el => el.style.display = 'none');
    } else {
        // Hide auth-dependent elements
        authDependent.forEach(el => el.style.display = 'none');
        loginButtons.forEach(el => el.style.display = 'block');
        signupButtons.forEach(el => el.style.display = 'block');

        // Redirect if on protected page
        const protectedPages = ['profile', 'ai-agents'];
        if (protectedPages.includes(currentPage)) {
            window.location.href = './login.html';
        }
    }
} 