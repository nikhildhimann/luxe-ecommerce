import React, { createContext, useState, useContext, useEffect } from 'react';
import { luxe } from '@/api/luxeClient';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);
  const [isLoadingPublicSettings, setIsLoadingPublicSettings] = useState(false); // Kept for compatibility but unused
  const [authError, setAuthError] = useState(null);
  const [appPublicSettings, setAppPublicSettings] = useState({}); // Empty object for compatibility

  useEffect(() => {
    checkAppState();
  }, []);

  const checkAppState = async () => {
    try {
      setIsLoadingPublicSettings(true);
      setAuthError(null);
      
      // Check if user is authenticated
      await checkUserAuth();
      
      setIsLoadingPublicSettings(false);
    } catch (error) {
      console.error('Unexpected error:', error);
      setIsLoadingPublicSettings(false);
      setIsLoadingAuth(false);
    }
  };

  const checkUserAuth = async () => {
    try {
      setIsLoadingAuth(true);
      const isAuth = await luxe.auth.isAuthenticated();
      if (isAuth) {
          const currentUser = await luxe.auth.me();
          setUser(currentUser);
          setIsAuthenticated(true);
      } else {
          setUser(null);
          setIsAuthenticated(false);
      }
      setIsLoadingAuth(false);
    } catch (error) {
      console.warn('User auth check failed (might not be logged in):', error);
      setIsLoadingAuth(false);
      setIsAuthenticated(false);
    }
  };

  const logout = (shouldRedirect = true) => {
    setUser(null);
    setIsAuthenticated(false);
    luxe.auth.logout(shouldRedirect ? window.location.href : null);
  };

  const navigateToLogin = () => {
    luxe.auth.redirectToLogin(window.location.href);
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      isAuthenticated, 
      isLoadingAuth,
      isLoadingPublicSettings, 
      authError,
      appPublicSettings,
      logout,
      navigateToLogin,
      checkAppState
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
