import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { signIn, signInWithOAuth } from '../services/supabase';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await signIn(email, password);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Failed to sign in');
    } finally {
      setLoading(false);
    }
  };

  const handleOAuthLogin = async (provider: 'google' | 'apple' | 'microsoft') => {
    setError(null);
    try {
      await signInWithOAuth(provider);
      // The redirect will happen automatically from Supabase
    } catch (err: any) {
      setError(err.message || `Failed to sign in with ${provider}`);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-light-bg dark:bg-dark-bg p-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-light-text dark:text-dark-text">Sign In</h1>
          <p className="text-light-secondary dark:text-dark-secondary mt-2">
            Welcome back to AI Assistant
          </p>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-light-text dark:text-dark-text mb-1">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input-field"
              required
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-light-text dark:text-dark-text mb-1">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input-field"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-light-border dark:border-dark-border"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-light-bg dark:bg-dark-bg text-light-secondary dark:text-dark-secondary">
                Or continue with
              </span>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-3 gap-3">
            <button
              onClick={() => handleOAuthLogin('google')}
              className="btn-secondary flex items-center justify-center"
            >
              Google
            </button>
            <button
              onClick={() => handleOAuthLogin('apple')}
              className="btn-secondary flex items-center justify-center"
            >
              Apple
            </button>
            <button
              onClick={() => handleOAuthLogin('microsoft')}
              className="btn-secondary flex items-center justify-center"
            >
              Microsoft
            </button>
          </div>
        </div>

        <div className="mt-6 text-center">
          <p className="text-light-secondary dark:text-dark-secondary">
            Don't have an account?{' '}
            <Link to="/signup" className="text-accent hover:underline">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login; 