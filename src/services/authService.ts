
import { api } from './api';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface SignupRequest {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  companyName?: string;
}

export interface AuthResponse {
  token: string;
  user?: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    companyName?: string;
  };
}

export const authService = {
  // Login with email and password
  login: async (credentials: LoginRequest): Promise<AuthResponse> => {
    // The backend returns just a token string, so we need to handle this
    const token = await api.post<string>('/api/v1/auth/login', credentials);
    
    // Since backend only returns token, we create a minimal user object
    const response: AuthResponse = {
      token,
      user: {
        id: 'temp-id', // You might want to decode JWT or fetch user data separately
        email: credentials.email,
        firstName: '',
        lastName: '',
      }
    };
    
    // Store token in localStorage
    localStorage.setItem('authToken', response.token);
    localStorage.setItem('user', JSON.stringify(response.user));
    
    return response;
  },

  // Register new user
  signup: async (userData: SignupRequest): Promise<AuthResponse> => {
    const token = await api.post<string>('/api/v1/auth/signup', userData);
    
    const response: AuthResponse = {
      token,
      user: {
        id: 'temp-id',
        email: userData.email,
        firstName: userData.firstName,
        lastName: userData.lastName,
        companyName: userData.companyName,
      }
    };
    
    // Store token in localStorage
    localStorage.setItem('authToken', response.token);
    localStorage.setItem('user', JSON.stringify(response.user));
    
    return response;
  },

  // Google OAuth login
  googleLogin: async (): Promise<AuthResponse> => {
    const token = await api.post<string>('/api/v1/auth/google');
    
    const response: AuthResponse = {
      token,
      user: {
        id: 'temp-id',
        email: '',
        firstName: '',
        lastName: '',
      }
    };
    
    // Store token in localStorage
    localStorage.setItem('authToken', response.token);
    localStorage.setItem('user', JSON.stringify(response.user));
    
    return response;
  },

  // Logout
  logout: async (): Promise<void> => {
    try {
      await api.post('/api/v1/auth/logout');
    } finally {
      // Always clear local storage
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
    }
  },

  // Get current user from localStorage
  getCurrentUser: () => {
    const userStr = localStorage.getItem('user');
    const token = localStorage.getItem('authToken');
    
    if (!userStr || !token) return null;
    
    try {
      return JSON.parse(userStr);
    } catch {
      return null;
    }
  },

  // Check if user is authenticated
  isAuthenticated: (): boolean => {
    return !!localStorage.getItem('authToken');
  },
};
