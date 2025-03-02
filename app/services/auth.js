/**
 * Authentication Service
 * 
 * This module provides functions for user authentication,
 * including registration, login, and token management.
 */

const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { supabase } = require('./supabase');
const { JWT_CONFIG, SUPABASE_CONFIG } = require('../config');

/**
 * Register a new user
 * @param {Object} userData - User registration data
 * @returns {Promise<Object>} - Registration result
 */
const register = async (userData) => {
  try {
    const { email, password, firstName, lastName } = userData;

    // Check if user already exists
    const { data: existingUser } = await supabase
      .from(SUPABASE_CONFIG.tables.users)
      .select('email')
      .eq('email', email)
      .single();

    if (existingUser) {
      throw new Error('User with this email already exists');
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user in Supabase Auth
    const { data: authUser, error: authError } = await supabase.auth.signUp({
      email,
      password
    });

    if (authError) {
      throw new Error(`Auth registration failed: ${authError.message}`);
    }

    // Create user in users table
    const { data: newUser, error: dbError } = await supabase
      .from(SUPABASE_CONFIG.tables.users)
      .insert({
        id: authUser.user.id,
        email,
        first_name: firstName,
        last_name: lastName,
        password_hash: hashedPassword,
        created_at: new Date().toISOString()
      })
      .select()
      .single();

    if (dbError) {
      throw new Error(`Database registration failed: ${dbError.message}`);
    }

    // Generate JWT token
    const token = generateToken(newUser);

    return {
      user: sanitizeUser(newUser),
      token
    };
  } catch (error) {
    console.error('Registration error:', error);
    throw error;
  }
};

/**
 * Login a user
 * @param {String} email - User email
 * @param {String} password - User password
 * @returns {Promise<Object>} - Login result
 */
const login = async (email, password) => {
  try {
    // Sign in with Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (authError) {
      throw new Error('Invalid credentials');
    }

    // Get user from database
    const { data: user, error: dbError } = await supabase
      .from(SUPABASE_CONFIG.tables.users)
      .select('*')
      .eq('id', authData.user.id)
      .single();

    if (dbError || !user) {
      throw new Error('User not found');
    }

    // Generate JWT token
    const token = generateToken(user);

    return {
      user: sanitizeUser(user),
      token
    };
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
};

/**
 * Verify a JWT token
 * @param {String} token - JWT token
 * @returns {Promise<Object>} - Verification result
 */
const verifyToken = async (token) => {
  try {
    // Verify the token
    const decoded = jwt.verify(token, JWT_CONFIG.secret);

    // Get user from database
    const { data: user, error } = await supabase
      .from(SUPABASE_CONFIG.tables.users)
      .select('*')
      .eq('id', decoded.id)
      .single();

    if (error || !user) {
      throw new Error('User not found');
    }

    return {
      user: sanitizeUser(user),
      decoded
    };
  } catch (error) {
    console.error('Token verification error:', error);
    throw error;
  }
};

/**
 * Generate a JWT token for a user
 * @param {Object} user - User object
 * @returns {String} - JWT token
 */
const generateToken = (user) => {
  const payload = {
    id: user.id,
    email: user.email,
    role: user.role || 'user'
  };

  return jwt.sign(payload, JWT_CONFIG.secret, {
    expiresIn: JWT_CONFIG.expiresIn,
    algorithm: JWT_CONFIG.algorithm
  });
};

/**
 * Remove sensitive data from user object
 * @param {Object} user - User object
 * @returns {Object} - Sanitized user object
 */
const sanitizeUser = (user) => {
  const sanitized = { ...user };
  delete sanitized.password_hash;
  return sanitized;
};

/**
 * Change user password
 * @param {String} userId - User ID
 * @param {String} currentPassword - Current password
 * @param {String} newPassword - New password
 * @returns {Promise<Object>} - Password change result
 */
const changePassword = async (userId, currentPassword, newPassword) => {
  try {
    // Get user from database
    const { data: user, error: userError } = await supabase
      .from(SUPABASE_CONFIG.tables.users)
      .select('*')
      .eq('id', userId)
      .single();

    if (userError || !user) {
      throw new Error('User not found');
    }

    // Verify current password
    const isMatch = await bcrypt.compare(currentPassword, user.password_hash);
    if (!isMatch) {
      throw new Error('Current password is incorrect');
    }

    // Hash the new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // Update password in Supabase Auth
    const { error: authError } = await supabase.auth.updateUser({
      password: newPassword
    });

    if (authError) {
      throw new Error(`Auth password update failed: ${authError.message}`);
    }

    // Update password in users table
    const { error: dbError } = await supabase
      .from(SUPABASE_CONFIG.tables.users)
      .update({
        password_hash: hashedPassword,
        updated_at: new Date().toISOString()
      })
      .eq('id', userId);

    if (dbError) {
      throw new Error(`Database password update failed: ${dbError.message}`);
    }

    return {
      success: true,
      message: 'Password updated successfully'
    };
  } catch (error) {
    console.error('Password change error:', error);
    throw error;
  }
};

/**
 * Request password reset
 * @param {String} email - User email
 * @returns {Promise<Object>} - Password reset request result
 */
const requestPasswordReset = async (email) => {
  try {
    // Send password reset email
    const { error } = await supabase.auth.resetPasswordForEmail(email);

    if (error) {
      throw new Error(`Password reset request failed: ${error.message}`);
    }

    return {
      success: true,
      message: 'Password reset email sent'
    };
  } catch (error) {
    console.error('Password reset request error:', error);
    throw error;
  }
};

/**
 * Reset password with token
 * @param {String} token - Reset token
 * @param {String} newPassword - New password
 * @returns {Promise<Object>} - Password reset result
 */
const resetPassword = async (token, newPassword) => {
  try {
    // Update user password
    const { error } = await supabase.auth.updateUser({
      password: newPassword
    });

    if (error) {
      throw new Error(`Password reset failed: ${error.message}`);
    }

    return {
      success: true,
      message: 'Password reset successfully'
    };
  } catch (error) {
    console.error('Password reset error:', error);
    throw error;
  }
};

module.exports = {
  register,
  login,
  verifyToken,
  generateToken,
  changePassword,
  requestPasswordReset,
  resetPassword
};
