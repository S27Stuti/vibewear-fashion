import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || (typeof window !== 'undefined' && !window.location.port.includes('5173') ? '/api/v1' : 'http://localhost:5000/api/v1');

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Request interceptor to attach JWT token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('vibewear_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // If token expired, clear localStorage
    if (error.response && error.response.status === 401) {
      if (localStorage.getItem('vibewear_token')) {
        localStorage.removeItem('vibewear_token');
        localStorage.removeItem('vibewear_user');
      }
    }
    return Promise.reject(error);
  }
);

export default apiClient;
