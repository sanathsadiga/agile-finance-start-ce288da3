
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
    try {
      console.log('Attempting login with:', { email: credentials.email });
      
      // Make the API call and handle potential response formats
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:8080'}/api/v1/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });

      if (!response.ok) {
        throw new Error(`Login failed: ${response.statusText}`);
      }

      // Get the response as text first to handle plain token response
      const responseText = await response.text();
      console.log('Raw response:', responseText);
      
      // The backend returns just the token as plain text
      const token = responseText.trim();
      
      const authResponse: AuthResponse = {
        token,
        user: {
          id: 'temp-id',
          email: credentials.email,
          firstName: '',
          lastName: '',
        }
      };
      
      // Store token in localStorage
      localStorage.setItem('authToken', token);
      localStorage.setItem('user', JSON.stringify(authResponse.user));
      
      console.log('Login successful, token stored');
      return authResponse;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
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
