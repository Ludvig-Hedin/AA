import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { verifyEmail } from '../services/supabase';

const VerifyEmail: React.FC = () => {
  const navigate = useNavigate();
  const [message, setMessage] = useState<string>('');
  const [isVerifying, setIsVerifying] = useState<boolean>(true);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);

  useEffect(() => {
    const verify = async () => {
      // Get token from URL query params
      const urlParams = new URLSearchParams(window.location.search);
      const token = urlParams.get('token');

      if (!token) {
        setMessage('Invalid verification link. Please request a new one.');
        setIsVerifying(false);
        return;
      }

      try {
        await verifyEmail(token);
        setIsSuccess(true);
        setMessage('Your email has been verified successfully!');
        // Redirect to login after 3 seconds
        setTimeout(() => {
          navigate('/login');
        }, 3000);
      } catch (error) {
        console.error('Error verifying email:', error);
        setMessage('Email verification failed. Please try again or contact support.');
      } finally {
        setIsVerifying(false);
      }
    };

    verify();
  }, [navigate]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 bg-gray-900 text-white">
      <div className="w-full max-w-md p-6 bg-gray-800 rounded-lg shadow-lg">
        <div className="flex justify-center mb-6">
          <img src="/logo.svg" alt="Logo" className="h-16 w-16" />
        </div>
        <h2 className="text-2xl font-bold text-center mb-6">Email Verification</h2>
        
        {isVerifying ? (
          <div className="flex flex-col items-center space-y-4">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
            <p className="text-center">Verifying your email...</p>
          </div>
        ) : (
          <div className="text-center space-y-6">
            <div className={`text-lg ${isSuccess ? 'text-green-400' : 'text-red-400'}`}>
              {message}
            </div>
            
            {!isSuccess && (
              <div className="mt-4">
                <Link 
                  to="/login" 
                  className="inline-block w-full px-4 py-2 text-center text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-800"
                >
                  Back to Login
                </Link>
              </div>
            )}
            
            {isSuccess && (
              <div className="mt-4">
                <p className="text-sm text-gray-400">Redirecting to login page...</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default VerifyEmail; 