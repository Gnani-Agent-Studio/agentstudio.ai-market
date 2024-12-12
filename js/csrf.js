// Generate CSRF token
function generateCSRFToken() {
    return Array.from(crypto.getRandomValues(new Uint8Array(32)))
        .map(b => b.toString(16).padStart(2, '0'))
        .join('');
}

// Set CSRF token in meta tag and localStorage
export function initializeCSRF() {
    const token = generateCSRFToken();
    const meta = document.createElement('meta');
    meta.name = 'csrf-token';
    meta.content = token;
    document.head.appendChild(meta);
    localStorage.setItem('csrf-token', token);
}

// Verify CSRF token
export function verifyCSRFToken(token) {
    return token === localStorage.getItem('csrf-token');
} 