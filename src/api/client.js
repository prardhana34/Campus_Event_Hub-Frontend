import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

const client = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

// Request interceptor to attach JWT token
client.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle errors
client.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      const currentPath = window.location.pathname;
      const isAuthPage =
        currentPath.includes('/login') ||
        currentPath.includes('/register') ||
        currentPath.includes('/verify-email') ||
        currentPath.includes('/forgot-password') ||
        currentPath.includes('/reset-password');

      // Only handle if token was present and is now rejected
      const token = localStorage.getItem('token');
      if (token && !isAuthPage) {
        // Only trigger session expiration for genuine token failures
        // Dispatch to AuthContext so state and localStorage stay perfectly synchronized
        window.dispatchEvent(new CustomEvent('auth:session-expired', {
          detail: { message: error.response?.data?.message || 'Session expired' }
        }));
      }
    }
    return Promise.reject(error);
  }
);

export default client;
