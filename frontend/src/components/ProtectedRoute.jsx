import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import apiClient, { setAuthToken } from '../api/axios';
import { useAuth } from '../context/AuthContext';
import Loader from './Loader';

// 🔐 ProtectedRoute component to protect routes based on authentication
const ProtectedRoute = ({ 
  children, 
  requiredUserType = null, 
  redirectPath = '/login' 
}) => {
  const { isAuthenticated, accessToken, userType, isLoading } = useAuth();
  const [isVerified, setIsVerified] = useState(requiredUserType !== 'user');
  const [verificationLoading, setVerificationLoading] = useState(requiredUserType === 'user');

  useEffect(() => {
    let isActive = true;

    const verifyUserSession = async () => {
      if (requiredUserType !== 'user') {
        if (isActive) {
          setIsVerified(true);
          setVerificationLoading(false);
        }
        return;
      }

      // Wait for AuthContext to hydrate from storage.
      if (isLoading) {
        return;
      }

      // For user routes: if we have a token but userType is missing (or stale),
      // we can still verify via /api/user/me and then persist userType.
      if (!accessToken) {
        if (isActive) {
          setIsVerified(false);
          setVerificationLoading(false);
        }
        return;
      }

      try {
        if (isActive) {
          setVerificationLoading(true);
        }
        await apiClient.get('/api/user/me');
        if (isActive) {
          setIsVerified(true);
        }
        // Ensure userType is present for future refreshes.
        if (userType !== 'user') {
          setAuthToken(accessToken, 'user');
        }
      } catch (error) {
        const status = error?.response?.status;
        // Only clear auth on true auth failures. Network/5xx should not log the user out.
        if (status === 401 || status === 403) {
          setAuthToken(null, null);
          if (isActive) {
            setIsVerified(false);
          }
        } else {
          if (isActive) {
            setIsVerified(true);
          }
        }
      } finally {
        if (isActive) {
          setVerificationLoading(false);
        }
      }
    };

    verifyUserSession();

    return () => {
      isActive = false;
    };
  }, [accessToken, isAuthenticated, isLoading, requiredUserType, userType]);

  // Show loader while checking auth state
  if (isLoading || verificationLoading) {
    return <Loader />;
  }

  // Check if user is authenticated
  if (!isAuthenticated) {
    return <Navigate to={redirectPath} replace />;
  }

  if (requiredUserType === 'user' && !isVerified) {
    return <Navigate to={redirectPath} replace />;
  }

  // Check if user has the required role (if specified)
  if (requiredUserType && userType !== requiredUserType) {
    // Redirect to appropriate dashboard based on user type
    const roleRedirectMap = {
      admin: '/admin',
      subadmin: '/subadmin/dashboard',
      user: '/user',
    };
    return <Navigate to={roleRedirectMap[userType] || redirectPath} replace />;
  }

  return children;
};

export default ProtectedRoute;
