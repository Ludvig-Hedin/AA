/**
 * Utility functions for Personal Assistant
 */

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
 * Format date and time to locale string
 * @param {string|Date} date - Date to format
 * @param {object} options - Intl.DateTimeFormat options
 * @returns {string} Formatted date and time string
 */
function formatDateTime(date, options = {}) {
  const defaultOptions = { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric',
    hour: '2-digit', 
    minute: '2-digit'
  };
  
  const dateObj = date instanceof Date ? date : new Date(date);
  return dateObj.toLocaleString(undefined, { ...defaultOptions, ...options });
}

/**
 * Format relative time (e.g. "2 days ago")
 * @param {string|Date} date - Date to format
 * @returns {string} Formatted relative time
 */
function formatRelativeTime(date) {
  const dateObj = date instanceof Date ? date : new Date(date);
  const now = new Date();
  const diffMs = now - dateObj;
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHour = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHour / 24);
  const diffMonth = Math.floor(diffDay / 30);
  const diffYear = Math.floor(diffMonth / 12);
  
  if (diffSec < 60) {
    return 'just now';
  } else if (diffMin < 60) {
    return `${diffMin} minute${diffMin === 1 ? '' : 's'} ago`;
  } else if (diffHour < 24) {
    return `${diffHour} hour${diffHour === 1 ? '' : 's'} ago`;
  } else if (diffDay < 30) {
    return `${diffDay} day${diffDay === 1 ? '' : 's'} ago`;
  } else if (diffMonth < 12) {
    return `${diffMonth} month${diffMonth === 1 ? '' : 's'} ago`;
  } else {
    return `${diffYear} year${diffYear === 1 ? '' : 's'} ago`;
  }
}

/**
 * Truncate text to a specified length
 * @param {string} text - Text to truncate
 * @param {number} length - Maximum length
 * @param {string} suffix - Suffix to add if truncated
 * @returns {string} Truncated text
 */
function truncateText(text, length = 100, suffix = '...') {
  if (!text) return '';
  if (text.length <= length) return text;
  return text.substring(0, length - suffix.length) + suffix;
}

/**
 * Generate a random ID
 * @param {number} length - ID length
 * @returns {string} Random ID
 */
function generateId(length = 10) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
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

/**
 * Throttle function to limit how often a function can be called
 * @param {Function} func - Function to throttle
 * @param {number} limit - Limit in milliseconds
 * @returns {Function} Throttled function
 */
function throttle(func, limit = 300) {
  let inThrottle;
  
  return function executedFunction(...args) {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => {
        inThrottle = false;
      }, limit);
    }
  };
}

/**
 * Get URL parameters as an object
 * @returns {Object} URL parameters
 */
function getUrlParams() {
  const params = {};
  const queryString = window.location.search.substring(1);
  const pairs = queryString.split('&');
  
  for (let i = 0; i < pairs.length; i++) {
    if (!pairs[i]) continue;
    
    const pair = pairs[i].split('=');
    params[decodeURIComponent(pair[0])] = decodeURIComponent(pair[1] || '');
  }
  
  return params;
}

/**
 * Set URL parameters
 * @param {Object} params - Parameters to set
 * @param {boolean} replace - Whether to replace current history state
 */
function setUrlParams(params, replace = false) {
  const url = new URL(window.location.href);
  
  // Clear existing parameters
  url.search = '';
  
  // Add new parameters
  Object.entries(params).forEach(([key, value]) => {
    if (value !== null && value !== undefined && value !== '') {
      url.searchParams.set(key, value);
    }
  });
  
  // Update URL
  if (replace) {
    window.history.replaceState({}, '', url);
  } else {
    window.history.pushState({}, '', url);
  }
}

/**
 * Copy text to clipboard
 * @param {string} text - Text to copy
 * @returns {Promise<boolean>} Success status
 */
async function copyToClipboard(text) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (error) {
    console.error('Error copying to clipboard:', error);
    
    // Fallback method
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.position = 'fixed';
    document.body.appendChild(textarea);
    textarea.focus();
    textarea.select();
    
    try {
      const successful = document.execCommand('copy');
      document.body.removeChild(textarea);
      return successful;
    } catch (err) {
      console.error('Fallback clipboard copy failed:', err);
      document.body.removeChild(textarea);
      return false;
    }
  }
}

/**
 * Download data as a file
 * @param {string} filename - File name
 * @param {string} content - File content
 * @param {string} contentType - Content type
 */
function downloadFile(filename, content, contentType = 'text/plain') {
  const blob = new Blob([content], { type: contentType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  
  a.href = url;
  a.download = filename;
  a.style.display = 'none';
  
  document.body.appendChild(a);
  a.click();
  
  setTimeout(() => {
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, 100);
}

/**
 * Validate email address
 * @param {string} email - Email to validate
 * @returns {boolean} Validation result
 */
function isValidEmail(email) {
  const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
}

/**
 * Validate password strength
 * @param {string} password - Password to validate
 * @returns {Object} Validation result with score and feedback
 */
function validatePassword(password) {
  const result = {
    score: 0,
    feedback: []
  };
  
  if (!password) {
    result.feedback.push('Password is required');
    return result;
  }
  
  // Length check
  if (password.length < 8) {
    result.feedback.push('Password should be at least 8 characters');
  } else {
    result.score += 1;
  }
  
  // Uppercase check
  if (!/[A-Z]/.test(password)) {
    result.feedback.push('Password should contain at least one uppercase letter');
  } else {
    result.score += 1;
  }
  
  // Lowercase check
  if (!/[a-z]/.test(password)) {
    result.feedback.push('Password should contain at least one lowercase letter');
  } else {
    result.score += 1;
  }
  
  // Number check
  if (!/[0-9]/.test(password)) {
    result.feedback.push('Password should contain at least one number');
  } else {
    result.score += 1;
  }
  
  // Special character check
  if (!/[^A-Za-z0-9]/.test(password)) {
    result.feedback.push('Password should contain at least one special character');
  } else {
    result.score += 1;
  }
  
  return result;
}

// Export utility functions
window.utils = {
  formatDate,
  formatTime,
  formatDateTime,
  formatRelativeTime,
  truncateText,
  generateId,
  debounce,
  throttle,
  getUrlParams,
  setUrlParams,
  copyToClipboard,
  downloadFile,
  isValidEmail,
  validatePassword
}; 