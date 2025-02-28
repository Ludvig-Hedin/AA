/**
 * Authentication functionality for Personal Assistant
 */

// Supabase configuration
const SUPABASE_URL = 'https://your-project.supabase.co';
const SUPABASE_KEY = 'your-public-key';

// Initialize the Supabase client
const initSupabase = () => {
  return supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
};

/**
 * Sign up a new user
 * @param {string} email - User email
 * @param {string} password - User password
 * @param {string} name - User name
 * @returns {Promise} Promise with user data or error
 */
async function signUp(email, password, name) {
  try {
    const client = initSupabase();
    const { data, error } = await client.auth.signUp({
      email,
      password,
      options: {
        data: {
          name,
        },
      },
    });
    
    if (error) {
      throw new Error(error.message);
    }
    
    // Store user in localStorage
    if (data.user) {
      localStorage.setItem('user', JSON.stringify(data.user));
    }
    
    return { user: data.user };
  } catch (error) {
    console.error('Sign up error:', error);
    return { error: error.message };
  }
}

/**
 * Sign in an existing user
 * @param {string} email - User email
 * @param {string} password - User password
 * @returns {Promise} Promise with user data or error
 */
async function signIn(email, password) {
  try {
    const client = initSupabase();
    const { data, error } = await client.auth.signInWithPassword({
      email,
      password,
    });
    
    if (error) {
      throw new Error(error.message);
    }
    
    // Store user in localStorage
    if (data.user) {
      localStorage.setItem('user', JSON.stringify(data.user));
    }
    
    return { user: data.user };
  } catch (error) {
    console.error('Sign in error:', error);
    return { error: error.message };
  }
}

/**
 * Sign out the current user
 * @returns {Promise} Promise with success or error
 */
async function signOut() {
  try {
    const client = initSupabase();
    const { error } = await client.auth.signOut();
    
    if (error) {
      throw new Error(error.message);
    }
    
    // Remove user from localStorage
    localStorage.removeItem('user');
    
    return { success: true };
  } catch (error) {
    console.error('Sign out error:', error);
    return { error: error.message };
  }
}

/**
 * Get the current user
 * @returns {Promise} Promise with user data or null
 */
async function getCurrentUser() {
  try {
    const client = initSupabase();
    const { data, error } = await client.auth.getSession();
    
    if (error) {
      throw new Error(error.message);
    }
    
    // Update user in localStorage
    if (data.session?.user) {
      localStorage.setItem('user', JSON.stringify(data.session.user));
      return { user: data.session.user };
    } else {
      localStorage.removeItem('user');
      return { user: null };
    }
  } catch (error) {
    console.error('Get current user error:', error);
    return { error: error.message };
  }
}

/**
 * Reset password for a user
 * @param {string} email - User email
 * @returns {Promise} Promise with success or error
 */
async function resetPassword(email) {
  try {
    const client = initSupabase();
    const { data, error } = await client.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password.html`,
    });
    
    if (error) {
      throw new Error(error.message);
    }
    
    return { success: true };
  } catch (error) {
    console.error('Reset password error:', error);
    return { error: error.message };
  }
}

/**
 * Update user password
 * @param {string} password - New password
 * @returns {Promise} Promise with success or error
 */
async function updatePassword(password) {
  try {
    const client = initSupabase();
    const { data, error } = await client.auth.updateUser({
      password,
    });
    
    if (error) {
      throw new Error(error.message);
    }
    
    return { success: true };
  } catch (error) {
    console.error('Update password error:', error);
    return { error: error.message };
  }
}

/**
 * Update user profile
 * @param {object} profile - User profile data
 * @returns {Promise} Promise with updated user or error
 */
async function updateProfile(profile) {
  try {
    const client = initSupabase();
    const { data, error } = await client.auth.updateUser({
      data: profile,
    });
    
    if (error) {
      throw new Error(error.message);
    }
    
    // Update user in localStorage
    if (data.user) {
      localStorage.setItem('user', JSON.stringify(data.user));
    }
    
    return { user: data.user };
  } catch (error) {
    console.error('Update profile error:', error);
    return { error: error.message };
  }
}

// Initialize auth forms
document.addEventListener('DOMContentLoaded', () => {
  // Login form
  const loginForm = document.getElementById('login-form');
  if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const email = loginForm.querySelector('[name="email"]').value;
      const password = loginForm.querySelector('[name="password"]').value;
      const submitButton = loginForm.querySelector('[type="submit"]');
      const errorElement = loginForm.querySelector('.form-error');
      
      // Disable button and show loading state
      submitButton.disabled = true;
      submitButton.textContent = 'Loggar in...';
      
      // Clear previous errors
      if (errorElement) {
        errorElement.textContent = '';
        errorElement.classList.add('hidden');
      }
      
      // Attempt login
      const { user, error } = await signIn(email, password);
      
      // Reset button
      submitButton.disabled = false;
      submitButton.textContent = 'Logga in';
      
      if (error) {
        // Show error
        if (errorElement) {
          errorElement.textContent = error;
          errorElement.classList.remove('hidden');
        }
      } else {
        // Redirect to dashboard
        window.location.href = '/dashboard.html';
      }
    });
  }
  
  // Register form
  const registerForm = document.getElementById('register-form');
  if (registerForm) {
    registerForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const name = registerForm.querySelector('[name="name"]').value;
      const email = registerForm.querySelector('[name="email"]').value;
      const password = registerForm.querySelector('[name="password"]').value;
      const submitButton = registerForm.querySelector('[type="submit"]');
      const errorElement = registerForm.querySelector('.form-error');
      
      // Disable button and show loading state
      submitButton.disabled = true;
      submitButton.textContent = 'Skapar konto...';
      
      // Clear previous errors
      if (errorElement) {
        errorElement.textContent = '';
        errorElement.classList.add('hidden');
      }
      
      // Attempt registration
      const { user, error } = await signUp(email, password, name);
      
      // Reset button
      submitButton.disabled = false;
      submitButton.textContent = 'Skapa konto';
      
      if (error) {
        // Show error
        if (errorElement) {
          errorElement.textContent = error;
          errorElement.classList.remove('hidden');
        }
      } else {
        // Redirect to dashboard
        window.location.href = '/dashboard.html';
      }
    });
  }
  
  // Logout buttons
  const logoutButtons = document.querySelectorAll('[data-logout]');
  logoutButtons.forEach(button => {
    button.addEventListener('click', async (e) => {
      e.preventDefault();
      
      const { error } = await signOut();
      
      if (!error) {
        // Redirect to home page
        window.location.href = '/';
      }
    });
  });
});

// Export auth functions
window.auth = {
  signUp,
  signIn,
  signOut,
  getCurrentUser,
  resetPassword,
  updatePassword,
  updateProfile
}; 