/**
 * Main application JavaScript for Personal Assistant
 */

// DOM Elements
const mobileNavToggle = document.querySelector('.mobile-nav-toggle');
const mobileNav = document.querySelector('.mobile-nav');
const themeToggle = document.querySelector('.theme-toggle');

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
  initializeTheme();
  initializeMobileNav();
  checkAuthentication();
});

/**
 * Initialize theme based on user preference or system preference
 */
function initializeTheme() {
  // Check if user has a saved theme preference
  const savedTheme = localStorage.getItem('theme');
  
  if (savedTheme) {
    document.documentElement.classList.toggle('dark', savedTheme === 'dark');
  } else {
    // Use system preference
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    document.documentElement.classList.toggle('dark', prefersDark);
  }
  
  // Add event listener to theme toggle if it exists
  if (themeToggle) {
    themeToggle.addEventListener('click', toggleTheme);
  }
}

/**
 * Toggle between light and dark theme
 */
function toggleTheme() {
  const isDark = document.documentElement.classList.toggle('dark');
  localStorage.setItem('theme', isDark ? 'dark' : 'light');
}

/**
 * Initialize mobile navigation
 */
function initializeMobileNav() {
  if (mobileNavToggle && mobileNav) {
    mobileNavToggle.addEventListener('click', () => {
      const isOpen = mobileNav.classList.toggle('open');
      
      // Update aria attributes for accessibility
      mobileNavToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
      mobileNav.setAttribute('aria-hidden', isOpen ? 'false' : 'true');
      
      // Update icon
      const icon = mobileNavToggle.querySelector('i');
      if (icon) {
        if (isOpen) {
          icon.classList.remove('fa-bars');
          icon.classList.add('fa-times');
        } else {
          icon.classList.remove('fa-times');
          icon.classList.add('fa-bars');
        }
      }
    });
  }
}

/**
 * Check if user is authenticated and update UI accordingly
 */
function checkAuthentication() {
  const user = JSON.parse(localStorage.getItem('user'));
  const authElements = document.querySelectorAll('[data-auth]');
  const nonAuthElements = document.querySelectorAll('[data-non-auth]');
  
  if (user) {
    // User is logged in
    authElements.forEach(el => el.classList.remove('hidden'));
    nonAuthElements.forEach(el => el.classList.add('hidden'));
    
    // Update user name if element exists
    const userNameElement = document.querySelector('[data-user-name]');
    if (userNameElement && user.name) {
      userNameElement.textContent = user.name;
    }
    
    // Check if token is expired
    const tokenExpiry = user.exp * 1000; // Convert to milliseconds
    if (Date.now() > tokenExpiry) {
      // Token expired, log out user
      logoutUser();
    }
  } else {
    // User is not logged in
    authElements.forEach(el => el.classList.add('hidden'));
    nonAuthElements.forEach(el => el.classList.remove('hidden'));
    
    // Redirect to login if on protected page
    const isProtectedPage = document.body.hasAttribute('data-protected');
    if (isProtectedPage) {
      window.location.href = '/login.html';
    }
  }
}

/**
 * Format date to locale string
 * @param {string|Date} date - Date to format
 * @param {object} options - Intl.DateTimeFormat options
 * @returns {string} Formatted date string
 */
function formatDate(date, options = {}) {
  const defaultOptions = { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric' 
  };
  
  const dateObj = date instanceof Date ? date : new Date(date);
  return dateObj.toLocaleDateString(undefined, { ...defaultOptions, ...options });
}

/**
 * Format time to locale string
 * @param {string|Date} date - Date to format
 * @param {object} options - Intl.DateTimeFormat options
 * @returns {string} Formatted time string
 */
function formatTime(date, options = {}) {
  const defaultOptions = { 
    hour: '2-digit', 
    minute: '2-digit'
  };
  
  const dateObj = date instanceof Date ? date : new Date(date);
  return dateObj.toLocaleTimeString(undefined, { ...defaultOptions, ...options });
}

/**
 * Show a notification to the user
 * @param {string} message - Message to display
 * @param {string} type - Type of notification (success, error, warning, info)
 * @param {number} duration - Duration in milliseconds
 */
function showNotification(message, type = 'info', duration = 3000) {
  // Create notification element
  const notification = document.createElement('div');
  notification.className = `notification notification-${type}`;
  notification.textContent = message;
  
  // Add to DOM
  const container = document.querySelector('.notification-container') || document.body;
  container.appendChild(notification);
  
  // Show notification
  setTimeout(() => {
    notification.classList.add('show');
  }, 10);
  
  // Remove after duration
  setTimeout(() => {
    notification.classList.remove('show');
    setTimeout(() => {
      notification.remove();
    }, 300); // Wait for transition to complete
  }, duration);
}

/**
 * Debounce function to limit how often a function can be called
 * @param {Function} func - Function to debounce
 * @param {number} wait - Wait time in milliseconds
 * @returns {Function} Debounced function
 */
function debounce(func, wait = 300) {
  let timeout;
  
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// Export functions for use in other modules
window.app = {
  formatDate,
  formatTime,
  showNotification,
  debounce,
  checkAuthentication
}; 