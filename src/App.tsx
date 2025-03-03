import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Signup from './pages/SignUp';
import Dashboard from './pages/Dashboard';
import StyleGuide from './pages/StyleGuide';
import Calendar from './pages/Calendar';
import Settings from './pages/Settings';
import Profile from './pages/Profile';
import ComputerUsePage from './pages/ComputerUsePage';
import { SessionProvider, useSession } from './contexts/SessionContext';
import { ThemeProvider } from './contexts/ThemeContext';
import ProtectedRoute from './components/routing/ProtectedRoute';

const App: React.FC = () => {
  return (
    <ThemeProvider>
      <SessionProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/style-guide" element={<StyleGuide />} />
            
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } />
            <Route path="/search" element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } />
            <Route path="/tasks" element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } />
            <Route path="/calendar" element={
              <ProtectedRoute>
                <Calendar />
              </ProtectedRoute>
            } />
            <Route path="/settings" element={
              <ProtectedRoute>
                <Settings />
              </ProtectedRoute>
            } />
            <Route path="/collections" element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } />
            <Route path="/files" element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } />
            <Route path="/profile" element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            } />
            <Route path="/computer-use" element={
              <ProtectedRoute>
                <ComputerUsePage />
              </ProtectedRoute>
            } />
            
            <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </SessionProvider>
    </ThemeProvider>
  );
};

export default App; 