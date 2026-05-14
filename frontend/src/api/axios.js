import axios from "axios";

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_APP_API_URL,
  withCredentials: true,
});

// We no longer persist auth state to `localStorage` or `sessionStorage`.
// Authentication relies on short-lived access tokens stored in-memory
// and refresh tokens kept as httpOnly, secure cookies on the server.
const persistAuthState = () => {
  // intentionally no-op to avoid writing to web storage
};

// Start with no persisted client-side state; tokens are in-memory only.
let accessToken = null;
let _refreshToken = null;
let userType = null;
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  
  isRefreshing = false;
  failedQueue = [];
};

export const setAuthToken = (token, type = null) => {
  accessToken = token || null;
  userType = accessToken ? (type || userType || null) : (type || null);
  if (accessToken) {
    apiClient.defaults.headers.common.Authorization = `Bearer ${accessToken}`;
  } else {
    delete apiClient.defaults.headers.common.Authorization;
  }
  // don't persist to storage; keep tokens in-memory only
  persistAuthState();

  if (typeof window !== "undefined") {
    window.dispatchEvent(
      new CustomEvent("authStateChanged", {
        detail: { accessToken, userType },
      })
    );
  }
};

export const setRefreshToken = (token) => {
  _refreshToken = token || null;
};

if (accessToken) {
  apiClient.defaults.headers.common.Authorization = `Bearer ${accessToken}`;
}

apiClient.interceptors.request.use((config) => {
  if (accessToken) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

// ✅ Response interceptor to handle 401 and refresh token
apiClient.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config;

    // If error is 401 and we haven't already tried to refresh
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        // Queue the request while refresh is in progress
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then(token => {
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return apiClient(originalRequest);
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // Determine refresh endpoint based on user type
        const currentUserType = userType;
        let refreshEndpoint = '';

        console.log('Attempting refresh for user type:', currentUserType);
        
        
        if (currentUserType === 'subadmin') {
          refreshEndpoint = '/api/subadmin/refresh-SubAdmin-Token';
        } else if (currentUserType === 'admin') {
          refreshEndpoint = '/api/admin/refresh-Admin-Token';
        } else {
          // Default to user if userType is 'user' or anything else
          refreshEndpoint = '/api/user/refresh-User-Token';
        }

        // Only send the cookie, not the refreshToken in the body
        const response = await axios.post(
          `${import.meta.env.VITE_BACKEND_APP_API_URL}${refreshEndpoint}`,
          {},
          { withCredentials: true }
        );

        
        const { accessToken: newAccessToken, refreshToken: newRefreshToken } = response.data;

        // Update tokens (preserve userType)
        setAuthToken(newAccessToken, currentUserType);
        if (newRefreshToken) {
          setRefreshToken(newRefreshToken);
        }

        // Update original request header
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

        // Process queued requests
        processQueue(null, newAccessToken);

        // Retry original request
        return apiClient(originalRequest);
      } catch (refreshError) {
        // Refresh token failed - redirect to login
        processQueue(refreshError, null);

        // Clear auth state
        setAuthToken(null, null);
        setRefreshToken(null);
        userType = null;

        // Redirect to login page
        if (typeof window !== 'undefined') {
          const currentAuthType = userType;
          const loginPath = currentAuthType === 'admin' ? '/admin-signin' : '/login';
          window.location.href = loginPath;
        }

        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default apiClient;
