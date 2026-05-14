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
    // No-op: we bootstrap from server-side refresh cookie instead.
    setAuthState((prev) => ({ ...prev, isLoading: true }));
  };
  const bootstrapUserSessionFromCookie = async () => {
    // Attempt to bootstrap session for admin/subadmin/user based on path.
    if (typeof window === 'undefined') return;
    const path = location?.pathname || window.location.pathname || '/';

    // If we already have a token in-memory, don't re-bootstrap.
    if (authState.accessToken) return;

    setAuthState((prev) => ({ ...prev, isLoading: true }));

    // Try refresh helper
    const tryRefresh = async (endpoint, type) => {
      try {
        const response = await axios.post(
          `${import.meta.env.VITE_BACKEND_APP_API_URL}${endpoint}`,
          {},
          { withCredentials: true }
        );
        const newAccessToken = response?.data?.accessToken;
        if (newAccessToken) {
          setAuthToken(newAccessToken, type);
          setAuthState({ accessToken: newAccessToken, userType: type, isLoading: false });
          return true;
        }
      } catch (e) {
        // ignore and allow other attempts
      }
      return false;
    };

    // Try a targeted refresh first
    if (path.startsWith('/admin')) {
      const ok = await tryRefresh('/api/admin/refresh-Admin-Token', 'admin');
      if (ok) return;
    } else if (path.startsWith('/subadmin')) {
      const ok = await tryRefresh('/api/subadmin/refresh-SubAdmin-Token', 'subadmin');
      if (ok) return;
    } else if (path.startsWith('/user')) {
      const ok = await tryRefresh('/api/user/refresh-User-Token', 'user');
      if (ok) return;
    }

    // Fallback: try admin -> subadmin -> user to cover cross-routing cases
    await tryRefresh('/api/admin/refresh-Admin-Token', 'admin');
    await tryRefresh('/api/subadmin/refresh-SubAdmin-Token', 'subadmin');
    await tryRefresh('/api/user/refresh-User-Token', 'user');

    // Nothing succeeded
    setAuthState({ accessToken: null, userType: null, isLoading: false });
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
      // Otherwise, re-bootstrap from server cookie
      bootstrapUserSessionFromCookie();
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
