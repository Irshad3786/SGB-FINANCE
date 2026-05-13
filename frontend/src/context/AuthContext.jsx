import React, { createContext, useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { setAuthToken } from '../api/axios';
import { useLocation } from 'react-router-dom';

// 🔐 Authentication Context for managing user authentication state
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const location = useLocation();
  const [authState, setAuthState] = useState({
    accessToken: null,
    userType: null,
    isLoading: true,
  });

  const syncAuthState = () => {
    try {
      // Prefer sessionStorage (tab-scoped), fallback to localStorage (persistent).
      const storedAuthState =
        sessionStorage.getItem('authState') || localStorage.getItem('authState');
      if (storedAuthState) {
        const parsed = JSON.parse(storedAuthState);

        // Privacy: ignore any persisted user sessions.
        if (parsed?.userType === 'user') {
          setAuthState({ accessToken: null, userType: null, isLoading: false });
          return;
        }

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

  const bootstrapUserSessionFromCookie = async () => {
    // Only attempt this when on user routes.
    if (typeof window === 'undefined') return;
    const path = location?.pathname || window.location.pathname || '/';
    if (!path.startsWith('/user')) return;

    // If we already have an access token in memory, don't refresh.
    if (authState.accessToken && authState.userType === 'user') return;

    try {
      setAuthState((prev) => ({ ...prev, isLoading: true }));
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_APP_API_URL}/api/user/refresh-User-Token`,
        {},
        { withCredentials: true }
      );

      const newAccessToken = response?.data?.accessToken;
      if (newAccessToken) {
        // Will update axios default header + dispatch authStateChanged.
        // This is kept in-memory only for 'user' (no storage persistence).
        setAuthToken(newAccessToken, 'user');
      }
    } catch {
      // Ignore: user might not have a refresh cookie.
      setAuthState((prev) => ({ ...prev, isLoading: false }));
    }
  };

  // Initialize auth state from sessionStorage
  useEffect(() => {
    syncAuthState();
    // initial attempt (may be on /user)
    bootstrapUserSessionFromCookie().finally(() => {
      setAuthState((prev) => ({ ...prev, isLoading: false }));
    });

    const handleAuthStateChanged = (event) => {
      const detail = event?.detail;
      const nextAccessToken = detail?.accessToken ?? null;
      const nextUserType = detail?.userType ?? null;

      // If we got an explicit payload, trust it (supports in-memory user auth).
      if (detail && (nextAccessToken || nextUserType)) {
        setAuthState({
          accessToken: nextAccessToken,
          userType: nextUserType,
          isLoading: false,
        });
        return;
      }

      // Otherwise, fall back to persisted state (admin/subadmin).
      syncAuthState();
    };

    window.addEventListener('authStateChanged', handleAuthStateChanged);

    return () => {
      window.removeEventListener('authStateChanged', handleAuthStateChanged);
    };
  }, []);

  // On navigation to /user routes, bootstrap user session via refresh cookie.
  useEffect(() => {
    bootstrapUserSessionFromCookie();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname]);

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
