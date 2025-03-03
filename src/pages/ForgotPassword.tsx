import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { resetPassword } from '../services/supabase';

const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');
    
    try {
      await resetPassword(email);
      setIsSuccess(true);
    } catch (error: any) {
      setError(error.message || 'Failed to send reset password email');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 bg-gray-900 text-white">
      <div className="w-full max-w-md p-6 bg-gray-800 rounded-lg shadow-lg">
        <div className="flex justify-center mb-6">
          <img src="/logo.svg" alt="Logo" className="h-16 w-16" />
        </div>
        <h2 className="text-2xl font-bold text-center mb-6">Reset Your Password</h2>
        
        {!isSuccess ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="you@example.com"
              />
            </div>
            
            {error && (
              <div className="text-red-400 text-sm py-2">
                {error}
              </div>
            )}
            
            <div className="pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-md text-white font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Sending Link...' : 'Send Reset Link'}
              </button>
            </div>
            
            <div className="flex justify-center mt-4">
              <Link to="/login" className="text-blue-400 hover:text-blue-300 text-sm">
                Back to Login
              </Link>
            </div>
          </form>
        ) : (
          <div className="text-center py-4 space-y-4">
            <div className="text-green-400 mb-4">
              Password reset instructions have been sent to your email.
            </div>
            <p className="text-gray-400 text-sm">
              Please check your inbox and follow the instructions to reset your password.
            </p>
            <div className="mt-6">
              <Link
                to="/login"
                className="inline-block px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-md text-white font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Back to Login
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword; 