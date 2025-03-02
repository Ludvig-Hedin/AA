/**
 * API Service
 * 
 * This module provides functions for making API requests to external services
 * and handling responses.
 */

const axios = require('axios');

// Create an axios instance with default config
const api = axios.create({
  timeout: 10000, // 10 seconds
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

/**
 * Make a GET request
 * @param {String} url - The URL to request
 * @param {Object} params - Query parameters
 * @param {Object} headers - Request headers
 * @returns {Promise} - API response
 */
const get = async (url, params = {}, headers = {}) => {
  try {
    const response = await api.get(url, {
      params,
      headers: { ...api.defaults.headers, ...headers }
    });
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

/**
 * Make a POST request
 * @param {String} url - The URL to request
 * @param {Object} data - Request body
 * @param {Object} headers - Request headers
 * @returns {Promise} - API response
 */
const post = async (url, data = {}, headers = {}) => {
  try {
    const response = await api.post(url, data, {
      headers: { ...api.defaults.headers, ...headers }
    });
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

/**
 * Make a PUT request
 * @param {String} url - The URL to request
 * @param {Object} data - Request body
 * @param {Object} headers - Request headers
 * @returns {Promise} - API response
 */
const put = async (url, data = {}, headers = {}) => {
  try {
    const response = await api.put(url, data, {
      headers: { ...api.defaults.headers, ...headers }
    });
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

/**
 * Make a DELETE request
 * @param {String} url - The URL to request
 * @param {Object} params - Query parameters
 * @param {Object} headers - Request headers
 * @returns {Promise} - API response
 */
const del = async (url, params = {}, headers = {}) => {
  try {
    const response = await api.delete(url, {
      params,
      headers: { ...api.defaults.headers, ...headers }
    });
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

/**
 * Handle API errors
 * @param {Error} error - The error object
 * @throws {Error} - Enhanced error
 */
const handleApiError = (error) => {
  if (error.response) {
    // The request was made and the server responded with a status code
    // that falls out of the range of 2xx
    const { status, data } = error.response;
    const message = data.message || data.error || 'API request failed';
    
    const enhancedError = new Error(message);
    enhancedError.status = status;
    enhancedError.data = data;
    
    console.error(`API Error (${status}):`, message);
    throw enhancedError;
  } else if (error.request) {
    // The request was made but no response was received
    console.error('API Error (No Response):', error.message);
    throw new Error('No response received from server');
  } else {
    // Something happened in setting up the request that triggered an Error
    console.error('API Error (Request Setup):', error.message);
    throw error;
  }
};

/**
 * Set a default header for all requests
 * @param {String} name - Header name
 * @param {String} value - Header value
 */
const setDefaultHeader = (name, value) => {
  api.defaults.headers[name] = value;
};

/**
 * Set the authorization header with a token
 * @param {String} token - Auth token
 * @param {String} scheme - Auth scheme (e.g., 'Bearer')
 */
const setAuthToken = (token, scheme = 'Bearer') => {
  if (token) {
    api.defaults.headers['Authorization'] = `${scheme} ${token}`;
  } else {
    delete api.defaults.headers['Authorization'];
  }
};

/**
 * Create a new API instance with custom config
 * @param {Object} config - Axios config
 * @returns {Object} - API instance
 */
const createInstance = (config = {}) => {
  return axios.create({
    ...api.defaults,
    ...config
  });
};

module.exports = {
  api,
  get,
  post,
  put,
  del,
  setDefaultHeader,
  setAuthToken,
  createInstance
};
