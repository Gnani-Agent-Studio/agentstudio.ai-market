// Regular expressions for valid social media URLs
const SOCIAL_PATTERNS = {
    github: /^https?:\/\/(www\.)?github\.com\/[a-zA-Z0-9-]+\/?$/,
    linkedin: /^https?:\/\/(www\.)?linkedin\.com\/in\/[a-zA-Z0-9-]+\/?$/,
    twitter: /^https?:\/\/(www\.)?twitter\.com\/[a-zA-Z0-9_]+\/?$/
};

// Sanitize URL to prevent XSS
function sanitizeUrl(url) {
    if (!url) return '';
    
    // Remove any potential JavaScript protocol
    if (url.toLowerCase().startsWith('javascript:')) {
        return '';
    }
    
    // Ensure URL uses HTTPS
    url = url.replace(/^http:/, 'https:');
    
    // Remove any HTML tags
    url = url.replace(/<[^>]*>?/gm, '');
    
    // Remove potentially dangerous characters
    url = url.replace(/[^\w\s-.:/?=&%@]/gi, '');
    
    return url.trim();
}

// Validate social media links
export function validateSocialLink(type, url) {
    if (!url) return { isValid: true, sanitizedUrl: '' };
    
    const sanitizedUrl = sanitizeUrl(url);
    
    if (!sanitizedUrl) {
        return {
            isValid: false,
            error: 'Invalid URL format',
            sanitizedUrl: ''
        };
    }
    
    if (!SOCIAL_PATTERNS[type]) {
        return {
            isValid: false,
            error: 'Unsupported social media platform',
            sanitizedUrl: ''
        };
    }
    
    if (!SOCIAL_PATTERNS[type].test(sanitizedUrl)) {
        return {
            isValid: false,
            error: `Invalid ${type} profile URL format`,
            sanitizedUrl: ''
        };
    }
    
    return {
        isValid: true,
        sanitizedUrl
    };
}

// Validate all social links at once
export function validateSocialLinks(links) {
    const errors = {};
    const sanitizedLinks = {};
    let isValid = true;
    
    for (const [platform, url] of Object.entries(links)) {
        const result = validateSocialLink(platform, url);
        
        if (!result.isValid) {
            errors[platform] = result.error;
            isValid = false;
        }
        
        sanitizedLinks[platform] = result.sanitizedUrl;
    }
    
    return {
        isValid,
        errors,
        sanitizedLinks
    };
} 