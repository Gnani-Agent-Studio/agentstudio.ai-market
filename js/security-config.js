export const securityConfig = {
    // CORS settings
    corsOptions: {
        origin: ['https://agent-studio.ai', 'https://www.agent-studio.ai'],
        methods: ['GET', 'POST'],
        allowedHeaders: ['Content-Type', 'Authorization'],
        credentials: true
    },
    
    // Rate limiting
    rateLimit: {
        windowMs: 15 * 60 * 1000, // 15 minutes
        max: 100 // limit each IP to 100 requests per windowMs
    },
    
    // Content Security Policy
    csp: {
        directives: {
            defaultSrc: ["'self'"],
            scriptSrc: ["'self'", 'cdnjs.cloudflare.com', '*.supabase.co'],
            styleSrc: ["'self'", "'unsafe-inline'", 'cdnjs.cloudflare.com'],
            imgSrc: ["'self'", 'data:', 'https:'],
            connectSrc: ["'self'", 'wss://*.supabase.co', '*.supabase.co'],
            fontSrc: ["'self'", 'cdnjs.cloudflare.com'],
            objectSrc: ["'none'"],
            mediaSrc: ["'none'"],
            frameSrc: ["'none'"]
        }
    }
}; 