import React, { createContext, useContext, useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { setAuthToken, getAuthToken, getUserType } from '../api/axios';
import { useLocation } from 'react-router-dom';

// 🔐 Authentication Context for managing user authentication state
const AuthContext = createContext();

let globalRefreshPromise = null;

export const AuthProvider = ({ children }) => {
  const location = useLocation();
  const [authState, setAuthState] = useState(() => {
    const token = getAuthToken();
    return {
      accessToken: token,
      userType: token ? getUserType() : null,
      isLoading: !token,
    };
  });

  const isBootstrappingRef = useRef(false);

  const syncAuthState = () => {
    // No-op: we bootstrap from server-side refresh cookie instead.
    setAuthState((prev) => ({ ...prev, isLoading: true }));
  };
  const bootstrapUserSessionFromCookie = async () => {
    // Attempt to bootstrap session for admin/subadmin/user based on path.
    if (typeof window === 'undefined') return;
    const path = window.location.pathname || '/';

    // If we already have a token in-memory, sync it to state and return.
    const token = getAuthToken();
    if (token) {
      setAuthState({ accessToken: token, userType: getUserType(), isLoading: false });
      return;
    }

    // If we are already bootstrapping, return.
    if (isBootstrappingRef.current) return;

    isBootstrappingRef.current = true;
    setAuthState((prev) => ({ ...prev, isLoading: true }));

    // Try refresh helper
    const tryRefresh = async (endpoint, type) => {
      console.log(`[tryRefresh] Attempting: ${endpoint} for role: ${type}`);
      
      if (globalRefreshPromise) {
        console.log(`[tryRefresh] Reusing existing refresh promise for: ${endpoint}`);
        const result = await globalRefreshPromise;
        if (result.success && result.accessToken) {
          setAuthState({ accessToken: result.accessToken, userType: type, isLoading: false });
          return true;
        }
        return false;
      }

      globalRefreshPromise = (async () => {
        try {
          const response = await axios.post(
            `${import.meta.env.VITE_BACKEND_APP_API_URL}${endpoint}`,
            {},
            { withCredentials: true }
          );
          console.log(`[tryRefresh] Success for ${endpoint}:`, response.data);
          const newAccessToken = response?.data?.accessToken;
          if (newAccessToken) {
            setAuthToken(newAccessToken, type);
            setAuthState({ accessToken: newAccessToken, userType: type, isLoading: false });
            return { success: true, accessToken: newAccessToken };
          }
        } catch (e) {
          console.error(`[tryRefresh] Error for ${endpoint}:`, e.response?.data || e.message || e);
        } finally {
          globalRefreshPromise = null;
        }
        return { success: false, accessToken: null };
      })();

      const result = await globalRefreshPromise;
      return result.success;
    };

    try {
      let ok = false;
      // Try a targeted refresh first
      if (path.startsWith('/admin')) {
        ok = await tryRefresh('/api/admin/refresh-Admin-Token', 'admin');
      } else if (path.startsWith('/subadmin')) {
        ok = await tryRefresh('/api/subadmin/refresh-SubAdmin-Token', 'subadmin');
      } else if (path.startsWith('/user')) {
        ok = await tryRefresh('/api/user/refresh-User-Token', 'user');
      }

      if (!ok) {
        // Fallback: try admin -> subadmin -> user to cover cross-routing cases
        const adminOk = await tryRefresh('/api/admin/refresh-Admin-Token', 'admin');
        if (adminOk) {
          ok = true;
        } else {
          const subadminOk = await tryRefresh('/api/subadmin/refresh-SubAdmin-Token', 'subadmin');
          if (subadminOk) {
            ok = true;
          } else {
            const userOk = await tryRefresh('/api/user/refresh-User-Token', 'user');
            if (userOk) {
              ok = true;
            }
          }
        }
      }

      if (!ok) {
        setAuthState({ accessToken: null, userType: null, isLoading: false });
      }
    } finally {
      isBootstrappingRef.current = false;
      setAuthState((prev) => ({ ...prev, isLoading: false }));
    }
  };

  // Initialize auth state from sessionStorage
  useEffect(() => {
    if (getAuthToken()) {
      return;
    }

    syncAuthState();
    // initial attempt (may be on /user)
    bootstrapUserSessionFromCookie();

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
