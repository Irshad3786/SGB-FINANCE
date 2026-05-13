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

      if (!isAuthenticated || userType !== 'user' || !accessToken) {
        if (isActive) {
          setIsVerified(false);
          setVerificationLoading(false);
        }
        return;
      }

      try {
        await apiClient.get('/api/user/me');
        if (isActive) {
          setIsVerified(true);
        }
      } catch {
        setAuthToken(null, null);
        if (isActive) {
          setIsVerified(false);
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
  }, [accessToken, isAuthenticated, requiredUserType, userType]);

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
