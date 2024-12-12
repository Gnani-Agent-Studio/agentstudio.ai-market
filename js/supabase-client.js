// Using the global supabase object from CDN
const supabaseUrl = 'https://bcliromprfouclmbmvbi.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJjbGlyb21wcmZvdWNsbWJtdmJpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzM5MzkwOTEsImV4cCI6MjA0OTUxNTA5MX0.O4Na6OU6cg3n3lOnAgN536u2K6pEkvJCAg04MFoPyZ0';

let supabaseInstance = null;

export async function initSupabase() {
    if (!supabaseInstance) {
        await window.supabaseLoaded;
        supabaseInstance = window.supabase.createClient(supabaseUrl, supabaseAnonKey);
    }
    return supabaseInstance;
}

export const supabase = await initSupabase();

export function getSupabase() {
    return supabase;
} 