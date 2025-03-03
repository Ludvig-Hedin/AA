import React from 'react';
import { Navigate } from 'react-router-dom';
import { useSession } from '../../contexts/SessionContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { session, loading } = useSession();

  if (loading) {
    return <div className="flex h-screen w-screen items-center justify-center bg-gray-900 text-white">Loading...</div>;
  }

  if (!session) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute; 