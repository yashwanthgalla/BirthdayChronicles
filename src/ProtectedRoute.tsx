import React, { useState, useEffect } from 'react';
import { checkIsAuthenticated } from './authConfig';
import LoginPage from './LoginPage';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => checkIsAuthenticated());

  useEffect(() => {
    // Sync state if localStorage changes across tabs or windows
    const handleStorageChange = () => {
      setIsAuthenticated(checkIsAuthenticated());
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
  };

  if (!isAuthenticated) {
    return <LoginPage onLoginSuccess={handleLoginSuccess} />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
