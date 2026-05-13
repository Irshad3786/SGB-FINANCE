import React, { createContext, useContext, useEffect, useState } from 'react';

// 🔐 Authentication Context for managing user authentication state
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [authState, setAuthState] = useState({
    accessToken: null,
    userType: null,
    isLoading: true,
  });

  const syncAuthState = () => {
    try {
      const storedAuthState = sessionStorage.getItem('authState');
      if (storedAuthState) {
        const parsed = JSON.parse(storedAuthState);
        setAuthState({
          accessToken: parsed?.accessToken || null,
          userType: parsed?.userType || null,
          isLoading: false,
        });
      } else {
        setAuthState({
          accessToken: null,
          userType: null,
          isLoading: false,
        });
      }
    } catch (error) {
      console.error('Error parsing auth state:', error);
      setAuthState({
        accessToken: null,
        userType: null,
        isLoading: false,
      });
    }
  };

  // Initialize auth state from sessionStorage
  useEffect(() => {
    syncAuthState();

    const handleAuthStateChanged = () => syncAuthState();
    window.addEventListener('authStateChanged', handleAuthStateChanged);

    return () => {
      window.removeEventListener('authStateChanged', handleAuthStateChanged);
    };
  }, []);

  const isAuthenticated = !!authState.accessToken && !!authState.userType;

  const value = {
    ...authState,
    isAuthenticated,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// 🔐 Custom hook to use authentication context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
