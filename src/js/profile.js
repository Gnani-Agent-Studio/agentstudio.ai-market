import { validateSocialLinks } from './utils/link-validator.js';
import { getSupabase } from './auth/supabase-client.js';

let originalValues = {};

async function loadProfile() {
    try {
        const supabase = await getSupabase();
        const user = supabase.auth.user();
        
        if (!user) {
            window.location.href = '/login.html';
            return;
        }

        const { data, error } = await supabase
            .from('profiles')
            .select('github_url, linkedin_url, twitter_url')
            .eq('id', user.id)
            .single();

        if (error) throw error;

        if (data) {
            // Store original values
            originalValues = {
                github: data.github_url || '',
                linkedin: data.linkedin_url || '',
                twitter: data.twitter_url || ''
            };

            // Set form values
            document.getElementById('github').value = data.github_url || '';
            document.getElementById('linkedin').value = data.linkedin_url || '';
            document.getElementById('twitter').value = data.twitter_url || '';

            updateValidationStatus();
        }
    } catch (error) {
        console.error('Error loading profile:', error);
        showError('Failed to load profile data');
    }
}

function updateValidationStatus() {
    const inputs = ['github', 'linkedin', 'twitter'];
    inputs.forEach(platform => {
        const input = document.getElementById(platform);
        const status = input.nextElementSibling;
        if (input.value) {
            status.innerHTML = '<i class="fas fa-check-circle"></i>';
            status.className = 'validation-status valid';
        } else {
            status.innerHTML = '';
            status.className = 'validation-status';
        }
    });
}

function toggleEditMode(enabled) {
    const form = document.getElementById('profileForm');
    const inputs = form.querySelectorAll('input');
    const actions = form.querySelector('.form-actions');
    const editBtn = document.getElementById('editProfileBtn');

    inputs.forEach(input => {
        input.disabled = !enabled;
    });

    actions.style.display = enabled ? 'flex' : 'none';
    editBtn.style.display = enabled ? 'none' : 'block';

    if (!enabled) {
        // Reset to original values if canceling
        document.getElementById('github').value = originalValues.github;
        document.getElementById('linkedin').value = originalValues.linkedin;
        document.getElementById('twitter').value = originalValues.twitter;
        updateValidationStatus();
    }
}

async function handleProfileUpdate(event) {
    event.preventDefault();
    
    const form = event.target;
    const submitButton = form.querySelector('button[type="submit"]');
    const errorContainer = document.getElementById('errorMessages');
    
    try {
        submitButton.disabled = true;
        errorContainer.innerHTML = '';
        
        const socialLinks = {
            github: form.github.value.trim(),
            linkedin: form.linkedin.value.trim(),
            twitter: form.twitter.value.trim()
        };
        
        const validation = validateSocialLinks(socialLinks);
        
        if (!validation.isValid) {
            const errorList = document.createElement('ul');
            Object.entries(validation.errors).forEach(([platform, error]) => {
                const li = document.createElement('li');
                li.textContent = `${platform}: ${error}`;
                errorList.appendChild(li);
            });
            errorContainer.appendChild(errorList);
            return;
        }
        
        const supabase = await getSupabase();
        
        const { error } = await supabase
            .from('profiles')
            .update({
                github_url: validation.sanitizedLinks.github,
                linkedin_url: validation.sanitizedLinks.linkedin,
                twitter_url: validation.sanitizedLinks.twitter,
                updated_at: new Date().toISOString()
            })
            .eq('id', supabase.auth.user().id);
            
        if (error) throw error;

        // Update original values
        originalValues = { ...socialLinks };
        
        const successMessage = document.createElement('div');
        successMessage.className = 'success-message';
        successMessage.textContent = 'Profile updated successfully!';
        errorContainer.appendChild(successMessage);

        toggleEditMode(false);
        updateValidationStatus();
        
    } catch (error) {
        console.error('Error updating profile:', error);
        const errorMessage = document.createElement('div');
        errorMessage.className = 'error-message';
        errorMessage.textContent = 'Failed to update profile. Please try again.';
        errorContainer.appendChild(errorMessage);
    } finally {
        submitButton.disabled = false;
    }
}

// Initialize event listeners
document.addEventListener('DOMContentLoaded', () => {
    loadProfile();

    const profileForm = document.getElementById('profileForm');
    const editBtn = document.getElementById('editProfileBtn');
    const cancelBtn = document.getElementById('cancelEditBtn');

    if (profileForm) {
        profileForm.addEventListener('submit', handleProfileUpdate);
    }

    if (editBtn) {
        editBtn.addEventListener('click', () => toggleEditMode(true));
    }

    if (cancelBtn) {
        cancelBtn.addEventListener('click', () => toggleEditMode(false));
    }
}); 