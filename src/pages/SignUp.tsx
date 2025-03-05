import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { useSession } from '../contexts/SessionContext';
import { signInWithOAuth } from '../services/supabase';
import { checkPasswordStrength } from '../lib/utils';

const SignUp: React.FC = () => {
  const navigate = useNavigate();
  const { signUp } = useSession();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState<'weak' | 'medium' | 'strong'>('weak');

  useEffect(() => {
    if (password) {
      setPasswordStrength(checkPasswordStrength(password));
    } else {
      setPasswordStrength('weak');
    }
  }, [password]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    if (passwordStrength === 'weak') {
      setError('Please use a stronger password');
      return;
    }
    
    setLoading(true);

    try {
      await signUp(email, password);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Failed to create account');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignUp = async () => {
    try {
      setLoading(true);
      await signInWithOAuth('google');
      // Redirect will be handled by Supabase
    } catch (err: any) {
      setError(err.message || 'Failed to sign up with Google');
      setLoading(false);
    }
  };

  const getPasswordStrengthClass = () => {
    switch (passwordStrength) {
      case 'weak':
        return 'bg-red-500';
      case 'medium':
        return 'bg-yellow-500';
      case 'strong':
        return 'bg-green-500';
      default:
        return 'bg-red-500';
    }
  };

  return (
    <div className="flex min-h-screen bg-black text-white">
      {/* Left side - Form */}
      <div className="flex flex-col justify-center w-full lg:w-1/2 max-w-md mx-auto px-6 py-12 lg:p-8">
        <div className="mb-10">
          <h1 className="text-4xl font-bold mb-2">Think it. Make it.</h1>
          <p className="text-gray-400">Create your AI Assistant account</p>
        </div>

        {/* Google Login Button */}
        <button 
          className="flex items-center justify-center w-full bg-white text-black rounded-md py-3 mb-6 font-medium hover:bg-gray-100 transition-colors"
          onClick={handleGoogleSignUp}
          disabled={loading}
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" className="mr-2">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
          </svg>
          Continue with Google
        </button>

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-700"></div>
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-black px-2 text-gray-400">or</span>
          </div>
        </div>

        {/* Email/Password Form */}
        <form onSubmit={handleSubmit} className="space-y-4" autoComplete="on">
          {error && (
            <div className="bg-red-900/50 text-red-200 p-3 rounded-md text-sm">
              {error}
            </div>
          )}
          <div className="space-y-2">
            <Input 
              id="email" 
              name="email"
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              required
              autoComplete="email"
              className="bg-gray-900 border-gray-700 text-white rounded-lg h-12 px-4 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div className="space-y-2">
            <Input 
              id="password" 
              name="new-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              required
              autoComplete="new-password"
              className="bg-gray-900 border-gray-700 text-white rounded-lg h-12 px-4 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            {password && (
              <div className="mt-1">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-gray-400">Password strength:</span>
                  <span className="text-xs capitalize">{passwordStrength}</span>
                </div>
                <div className="w-full h-1.5 bg-gray-700 rounded-full overflow-hidden">
                  <div 
                    className={`h-full ${getPasswordStrengthClass()}`} 
                    style={{ 
                      width: passwordStrength === 'weak' ? '33%' : 
                             passwordStrength === 'medium' ? '66%' : '100%' 
                    }}
                  ></div>
                </div>
                <div className="mt-1 text-xs text-gray-400">
                  {passwordStrength === 'weak' && 'Use at least 8 characters with uppercase letters, numbers and symbols.'}
                  {passwordStrength === 'medium' && 'Good password. Adding more complexity will make it stronger.'}
                  {passwordStrength === 'strong' && 'Excellent password!'}
                </div>
              </div>
            )}
          </div>
          <div className="space-y-2">
            <Input 
              id="confirmPassword" 
              name="confirm-password"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm Password"
              required
              autoComplete="new-password"
              className="bg-gray-900 border-gray-700 text-white rounded-lg h-12 px-4 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <Button 
            type="submit" 
            className="w-full bg-blue-600 hover:bg-blue-700 h-12 rounded-lg font-medium" 
            disabled={loading}
          >
            {loading ? 'Creating Account...' : 'Sign Up'}
          </Button>
        </form>

        <div className="mt-6 text-center text-sm text-gray-400">
          Already have an account?{' '}
          <Link to="/login" className="text-blue-400 hover:underline">
            Log in
          </Link>
        </div>
      </div>

      {/* Right side - Illustration */}
      <div className="hidden lg:flex flex-1 items-center justify-center lg:w-1/2 bg-gradient-to-b from-gray-900 to-black relative overflow-hidden">
        <div className="absolute top-20 w-full text-center z-20">
          <h2 className="text-2xl font-bold mb-2">AI Assistant</h2>
          <p className="text-gray-400 text-sm max-w-md mx-auto">
            Your personal AI assistant with secure authentication and seamless experience
            on both web and mobile.
          </p>
        </div>

        <div className="relative w-1/2 max-w-md z-10 mt-24">
          {/* AI Assistant UI mockup */}
          <div className="bg-gray-900 rounded-lg shadow-xl overflow-hidden border border-gray-800">
            {/* Header with avatar */}
            <div className="bg-gray-800 px-4 py-3 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-semibold">A</div>
                <div className="h-2 w-24 bg-gray-700 rounded"></div>
              </div>
              <div className="flex space-x-2">
                <div className="w-3 h-3 rounded-full bg-gray-700"></div>
                <div className="w-3 h-3 rounded-full bg-gray-700"></div>
              </div>
            </div>
            
            {/* Chat interface */}
            <div className="p-4 space-y-4">
              <div className="h-4 w-48 bg-gray-800 rounded"></div>
              <div className="bg-blue-600 text-white p-3 rounded-lg w-full h-8"></div>
              <div className="space-y-1">
                <div className="h-3 w-full bg-gray-800 rounded"></div>
                <div className="h-3 w-full bg-gray-800 rounded"></div>
                <div className="h-3 w-3/4 bg-gray-800 rounded"></div>
              </div>
              
              <div className="pt-4 mt-6">
                <div className="flex items-center space-x-2">
                  <div className="h-4 w-20 bg-gray-800 rounded"></div>
                  <div className="h-3 w-3 rounded-full bg-gray-700"></div>
                </div>
              </div>
              
              <div className="mt-4">
                <div className="h-16 bg-gray-800 rounded-lg p-2 flex items-end justify-end">
                  <div className="h-6 w-24 bg-blue-500 rounded-md"></div>
                </div>
              </div>
              
              <div className="mt-2">
                <div className="h-10 bg-gray-800 rounded-lg flex items-center p-2 justify-between">
                  <div className="h-3 w-40 bg-gray-700 rounded"></div>
                  <div className="h-6 w-6 bg-blue-600 rounded flex items-center justify-center">
                    <span className="text-xs text-white">→</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Background gradient elements */}
        <div className="absolute right-0 top-0 w-96 h-96 bg-blue-900/20 rounded-full filter blur-3xl"></div>
        <div className="absolute left-0 bottom-0 w-96 h-96 bg-indigo-900/20 rounded-full filter blur-3xl"></div>
      </div>
    </div>
  );
};

export default SignUp; 