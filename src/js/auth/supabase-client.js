import { config } from '../../config/config.js';

let supabase = null;
let currentUser = null;

// Initialize Supabase client
export async function initSupabase() {
    if (supabase) return supabase;

    try {
        const supabaseUrl = config.SUPABASE_URL;
        const supabaseKey = config.SUPABASE_ANON_KEY;

        console.log('Initializing Supabase client with:', { supabaseUrl });
        
        supabase = window.supabase.createClient(supabaseUrl, supabaseKey, {
            auth: {
                autoRefreshToken: true,
                persistSession: true,
                storage: localStorage
            }
        });

        return supabase;
    } catch (error) {
        console.error('Failed to initialize Supabase:', error);
        throw error;
    }
}

// Function to get Supabase instance
export async function getSupabase() {
    if (!supabase) {
        await initSupabase();
    }
    return supabase;
}

export function setCurrentUser(user) {
    currentUser = user;
}

export function getCurrentUser() {
    return currentUser;
}

// Function to check if user is logged in
export async function checkSession() {
    const client = await getSupabase();
    console.log('Checking session...');
    try {
        const { data: { session }, error } = await client.auth.getSession();
        console.log('Session check result:', { session, error });
        
        if (error) throw error;
        
        if (session) {
            console.log('User found:', session.user);
            setCurrentUser(session.user);
            return session.user;
        }
        console.log('No session found');
        setCurrentUser(null);
        return null;
    } catch (error) {
        console.error('Error checking session:', error);
        return null;
    }
}

// Function to handle logout
export async function signOut() {
    const client = await getSupabase();
    console.log('Signing out...');
    try {
        const { error } = await client.auth.signOut();
        if (error) throw error;
        
        localStorage.clear(); // Clear all storage
        setCurrentUser(null);
        console.log('Sign out successful');
        window.location.href = './login.html';
        return true;
    } catch (error) {
        console.error('Error signing out:', error);
        return false;
    }
}

// Initialize Supabase and set up auth state change listener
initSupabase().then(client => {
    client.auth.onAuthStateChange(async (event, session) => {
        console.log('Auth state changed:', event, session);
        
        if (event === 'SIGNED_IN') {
            setCurrentUser(session?.user || null);
        } else if (event === 'SIGNED_OUT') {
            setCurrentUser(null);
        }
    });
}).catch(error => {
    console.error('Failed to initialize Supabase:', error);
}); 