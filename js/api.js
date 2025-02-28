/**
 * API functionality for Personal Assistant
 * Handles all Supabase interactions
 */

// Supabase configuration
const SUPABASE_URL = 'https://your-project.supabase.co';
const SUPABASE_KEY = 'your-public-key';

/**
 * Initialize the Supabase client
 * @returns {Object} Supabase client
 */
const initSupabase = () => {
  return supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
};

/**
 * Get the current authenticated user
 * @returns {Object|null} User object or null if not authenticated
 */
function getUser() {
  const userStr = localStorage.getItem('user');
  if (!userStr) return null;
  
  try {
    return JSON.parse(userStr);
  } catch (error) {
    console.error('Error parsing user from localStorage:', error);
    return null;
  }
}

/**
 * Check if user is authenticated
 * @returns {boolean} True if user is authenticated
 */
function isAuthenticated() {
  const user = getUser();
  if (!user) return false;
  
  // Check if token is expired
  if (user.exp) {
    const now = Math.floor(Date.now() / 1000);
    return now < user.exp;
  }
  
  return true;
}

/**
 * Fetch data from a Supabase table
 * @param {string} table - Table name
 * @param {Object} options - Query options
 * @returns {Promise<Array>} Data array
 */
async function fetchData(table, options = {}) {
  try {
    const client = initSupabase();
    const user = getUser();
    
    if (!user) {
      throw new Error('User not authenticated');
    }
    
    let query = client.from(table).select(options.select || '*');
    
    // Apply filters
    if (options.filters) {
      options.filters.forEach(filter => {
        query = query.filter(filter.column, filter.operator, filter.value);
      });
    }
    
    // Apply equals conditions
    if (options.equals) {
      Object.entries(options.equals).forEach(([column, value]) => {
        query = query.eq(column, value);
      });
    }
    
    // Apply order
    if (options.order) {
      query = query.order(options.order.column, { 
        ascending: options.order.ascending 
      });
    }
    
    // Apply pagination
    if (options.limit) {
      query = query.limit(options.limit);
    }
    
    if (options.offset) {
      query = query.range(options.offset, options.offset + (options.limit || 10) - 1);
    }
    
    const { data, error } = await query;
    
    if (error) {
      throw new Error(error.message);
    }
    
    return data || [];
  } catch (error) {
    console.error(`Error fetching data from ${table}:`, error);
    throw error;
  }
}

/**
 * Create a new record in a Supabase table
 * @param {string} table - Table name
 * @param {Object} data - Record data
 * @returns {Promise<Object>} Created record
 */
async function createRecord(table, data) {
  try {
    const client = initSupabase();
    const user = getUser();
    
    if (!user) {
      throw new Error('User not authenticated');
    }
    
    // Add user_id to data if not present
    const recordData = { ...data };
    if (!recordData.user_id) {
      recordData.user_id = user.id;
    }
    
    const { data: result, error } = await client
      .from(table)
      .insert([recordData])
      .select();
    
    if (error) {
      throw new Error(error.message);
    }
    
    return result[0];
  } catch (error) {
    console.error(`Error creating record in ${table}:`, error);
    throw error;
  }
}

/**
 * Update a record in a Supabase table
 * @param {string} table - Table name
 * @param {string} id - Record ID
 * @param {Object} data - Updated data
 * @returns {Promise<Object>} Updated record
 */
async function updateRecord(table, id, data) {
  try {
    const client = initSupabase();
    const user = getUser();
    
    if (!user) {
      throw new Error('User not authenticated');
    }
    
    const { data: result, error } = await client
      .from(table)
      .update(data)
      .eq('id', id)
      .eq('user_id', user.id) // Ensure user owns the record
      .select();
    
    if (error) {
      throw new Error(error.message);
    }
    
    return result[0];
  } catch (error) {
    console.error(`Error updating record in ${table}:`, error);
    throw error;
  }
}

/**
 * Delete a record from a Supabase table
 * @param {string} table - Table name
 * @param {string} id - Record ID
 * @returns {Promise<boolean>} Success status
 */
async function deleteRecord(table, id) {
  try {
    const client = initSupabase();
    const user = getUser();
    
    if (!user) {
      throw new Error('User not authenticated');
    }
    
    const { error } = await client
      .from(table)
      .delete()
      .eq('id', id)
      .eq('user_id', user.id); // Ensure user owns the record
    
    if (error) {
      throw new Error(error.message);
    }
    
    return true;
  } catch (error) {
    console.error(`Error deleting record from ${table}:`, error);
    throw error;
  }
}

/**
 * Upload a file to Supabase Storage
 * @param {string} bucket - Storage bucket
 * @param {string} path - File path
 * @param {File} file - File object
 * @returns {Promise<Object>} Upload result
 */
async function uploadFile(bucket, path, file) {
  try {
    const client = initSupabase();
    const user = getUser();
    
    if (!user) {
      throw new Error('User not authenticated');
    }
    
    const { data, error } = await client
      .storage
      .from(bucket)
      .upload(`${user.id}/${path}`, file, {
        cacheControl: '3600',
        upsert: true
      });
    
    if (error) {
      throw new Error(error.message);
    }
    
    return data;
  } catch (error) {
    console.error(`Error uploading file to ${bucket}:`, error);
    throw error;
  }
}

/**
 * Get a public URL for a file in Supabase Storage
 * @param {string} bucket - Storage bucket
 * @param {string} path - File path
 * @returns {string} Public URL
 */
function getFileUrl(bucket, path) {
  const client = initSupabase();
  const user = getUser();
  
  if (!user) {
    throw new Error('User not authenticated');
  }
  
  return client
    .storage
    .from(bucket)
    .getPublicUrl(`${user.id}/${path}`).data.publicUrl;
}

/**
 * Delete a file from Supabase Storage
 * @param {string} bucket - Storage bucket
 * @param {string} path - File path
 * @returns {Promise<boolean>} Success status
 */
async function deleteFile(bucket, path) {
  try {
    const client = initSupabase();
    const user = getUser();
    
    if (!user) {
      throw new Error('User not authenticated');
    }
    
    const { error } = await client
      .storage
      .from(bucket)
      .remove([`${user.id}/${path}`]);
    
    if (error) {
      throw new Error(error.message);
    }
    
    return true;
  } catch (error) {
    console.error(`Error deleting file from ${bucket}:`, error);
    throw error;
  }
}

// Export API functions
window.api = {
  getUser,
  isAuthenticated,
  fetchData,
  createRecord,
  updateRecord,
  deleteRecord,
  uploadFile,
  getFileUrl,
  deleteFile
}; 