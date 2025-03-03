import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../services/supabase';
import PasswordStrengthIndicator from '../components/PasswordStrengthIndicator';

const ResetPassword: React.FC = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if we have the password reset hash in the URL
    const hash = window.location.hash.substring(1);
    const params = new URLSearchParams(hash);
    if (!params.get('type') || params.get('type') !== 'recovery') {
      setError('Invalid or expired password reset link. Please request a new one.');
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setMessage(null);
    
    // Validate passwords
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    if (password.length < 8) {
      setError('Password must be at least 8 characters long');
      return;
    }

    setLoading(true);

    try {
      const { error } = await supabase.auth.updateUser({
        password: password
      });

      if (error) throw error;
      
      setMessage('Your password has been updated successfully!');
      
      // Redirect to login after a short delay
      setTimeout(() => {
        navigate('/login');
      }, 3000);
    } catch (err: any) {
      setError(err.message || 'Failed to reset password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-[#121314] text-white">
      {/* Left side - Form */}
      <div className="w-full lg:w-1/2 flex flex-col items-center justify-center p-8">
        <div className="w-full max-w-md">
          <div className="text-center mb-10">
            <h1 className="text-3xl font-bold">Create New Password</h1>
            <p className="text-[#A5A5A6] mt-2">Enter your new password below</p>
          </div>

          {error && (
            <div className="bg-red-900/30 border border-red-500 text-red-200 px-4 py-3 rounded mb-6">
              {error}
            </div>
          )}

          {message && (
            <div className="bg-green-900/30 border border-green-500 text-green-200 px-4 py-3 rounded mb-6">
              {message}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="password" className="sr-only">New Password</label>
              <input
                type="password"
                id="password"
                placeholder="New Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-white/10 border border-gray-600 rounded-md px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white"
                required
              />
              <PasswordStrengthIndicator password={password} />
            </div>

            <div>
              <label htmlFor="confirmPassword" className="sr-only">Confirm New Password</label>
              <input
                type="password"
                id="confirmPassword"
                placeholder="Confirm New Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full bg-white/10 border border-gray-600 rounded-md px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700 transition-colors mt-6 border border-blue-700 shadow-sm"
            >
              {loading ? 'Resetting...' : 'Reset Password'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <span className="text-[#A5A5A6]">Remember your password? </span>
            <Link to="/login" className="text-white font-bold hover:underline">Back to Login</Link>
          </div>
        </div>
      </div>

      {/* Right side - Image/Brand */}
      <div className="hidden lg:block lg:w-1/2 bg-[#121314] p-12">
        <div className="h-full flex flex-col items-center justify-center">
          <div className="relative w-full max-w-lg">
            <div className="absolute top-0 right-0 -mt-8 -mr-8 w-64 h-64 bg-blue-500 rounded-full opacity-10"></div>
            <div className="absolute bottom-0 left-0 -mb-8 -ml-8 w-64 h-64 bg-purple-500 rounded-full opacity-10"></div>
            
            <div className="relative">
              <div className="p-8 bg-gray-900 rounded-lg shadow-xl">
                <div className="flex items-center justify-center mb-6">
                  <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center">
                    <span className="material-icons text-white text-3xl">security</span>
                  </div>
                </div>
                <h3 className="text-xl font-medium text-white text-center mb-2">Set a Strong Password</h3>
                <p className="text-gray-400 text-center">
                  Create a password that's at least 8 characters long, and consider using a mix of letters, numbers, and special characters.
                </p>
                <div className="mt-6 p-4 bg-gray-800 rounded-lg">
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <span className="material-icons text-green-500 mr-2">check_circle</span>
                      <span className="text-sm text-gray-300">Use at least 8 characters</span>
                    </div>
                    <div className="flex items-center">
                      <span className="material-icons text-green-500 mr-2">check_circle</span>
                      <span className="text-sm text-gray-300">Mix uppercase & lowercase letters</span>
                    </div>
                    <div className="flex items-center">
                      <span className="material-icons text-green-500 mr-2">check_circle</span>
                      <span className="text-sm text-gray-300">Add numbers & special characters</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword; 