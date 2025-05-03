import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

// Update API_URL to the correct base URL without trailing slash
const API_URL = 'http://localhost:8000/api';

// Define interfaces
interface LoginCredentials {
  username: string;
  password: string;
}

interface RegisterData {
  username: string;
  email: string;
  password: string;
  first_name?: string;
  last_name?: string;
}

interface AuthTokens {
  access: string;
  refresh: string;
}

interface DecodedToken {
  exp: number;
  user_id: number;
  username: string;
}

// Setup axios instance
const authApi = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add interceptor to add token to requests
authApi.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Add interceptor to refresh token if expired
authApi.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    // If error is 401 and not a retry
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        const refreshToken = localStorage.getItem('refresh_token');
        
        if (!refreshToken) {
          // No refresh token available, logout
          logout();
          return Promise.reject(error);
        }
        
        const response = await axios.post(`${API_URL}/token/refresh/`, {
          refresh: refreshToken,
        });
        
        if (response.data.access) {
          localStorage.setItem('access_token', response.data.access);
          authApi.defaults.headers.common.Authorization = `Bearer ${response.data.access}`;
          originalRequest.headers.Authorization = `Bearer ${response.data.access}`;
          
          return authApi(originalRequest);
        }
      } catch (refreshError) {
        // Refresh token failed, logout
        logout();
        return Promise.reject(refreshError);
      }
    }
    
    return Promise.reject(error);
  }
);

// Auth functions
export const login = async (credentials: LoginCredentials): Promise<boolean> => {
  try {
    const response = await axios.post<AuthTokens>(`${API_URL}/token/`, credentials);
    
    localStorage.setItem('access_token', response.data.access);
    localStorage.setItem('refresh_token', response.data.refresh);
    
    // Set default auth header
    authApi.defaults.headers.common.Authorization = `Bearer ${response.data.access}`;
    
    return true;
  } catch (error) {
    console.error('Login failed:', error);
    return false;
  }
};

export const register = async (userData: RegisterData): Promise<boolean> => {
  try {
    await axios.post(`${API_URL}/v1/register/`, userData);
    return true;
  } catch (error: any) {
    console.error('Registration failed:', error?.response?.data || error.message);
    return false;
  }
};

export const logout = (): void => {
  localStorage.removeItem('access_token');
  localStorage.removeItem('refresh_token');
  delete authApi.defaults.headers.common.Authorization;
};

export const isAuthenticated = (): boolean => {
  const token = localStorage.getItem('access_token');
  if (!token) return false;
  
  try {
    const decoded = jwtDecode<DecodedToken>(token);
    const currentTime = Date.now() / 1000;
    
    return decoded.exp > currentTime;
  } catch (error) {
    return false;
  }
};

export const getCurrentUserId = (): number | null => {
  const token = localStorage.getItem('access_token');
  if (!token) return null;
  
  try {
    const decoded = jwtDecode<DecodedToken>(token);
    return decoded.user_id;
  } catch (error) {
    return null;
  }
};

export const getCurrentUsername = (): string | null => {
  const token = localStorage.getItem('access_token');
  if (!token) return null;
  
  try {
    const decoded = jwtDecode<DecodedToken>(token);
    return decoded.username;
  } catch (error) {
    return null;
  }
};

export default authApi;