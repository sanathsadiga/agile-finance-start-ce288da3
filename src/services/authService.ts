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

export interface SignupEmailRequest {
  email: string;
}

export interface SignupDetailsRequest {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  businessName?: string;
  otp: string;
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

export interface ProfileResponse {
  id: number;
  businessName: string;
  currency: string | null;
  address: string | null;
  phoneNumber: string | null;
  country: string | null;
  state: string | null;
  city: string | null;
  zipCode: string | null;
  website: string | null;
}

// Backend login/signup response format
interface BackendAuthResponse {
  token: string;
  userId: number;
}

// Helper function to decode JWT token and extract user info
const decodeJWT = (token: string) => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error('Error decoding JWT:', error);
    return null;
  }
};

export const authService = {
  // Login with email and password
  login: async (credentials: LoginRequest): Promise<AuthResponse> => {
    try {
      console.log('Attempting login with:', { email: credentials.email });
      
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

      const backendResponse: BackendAuthResponse = await response.json();
      console.log('Backend login response:', backendResponse);
      
      const authResponse: AuthResponse = {
        token: backendResponse.token,
        user: {
          id: backendResponse.userId.toString(),
          email: credentials.email,
          firstName: '',
          lastName: '',
        }
      };
      
      // Store token and user info in localStorage
      localStorage.setItem('authToken', backendResponse.token);
      localStorage.setItem('user', JSON.stringify(authResponse.user));
      
      console.log('Login successful, token stored, user ID:', backendResponse.userId);
      return authResponse;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  },

  // Get current user info from localStorage
  getCurrentUserFromToken: async (): Promise<{ id: string; email: string } | null> => {
    try {
      const userStr = localStorage.getItem('user');
      if (!userStr) return null;

      const user = JSON.parse(userStr);
      return {
        id: user.id,
        email: user.email,
      };
    } catch (error) {
      console.error('Error getting user from localStorage:', error);
      return null;
    }
  },

  // Step 1: Register with email only (generates OTP)
  signupWithEmail: async (email: string): Promise<void> => {
    try {
      console.log('Sending signup email:', { email });
      
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:8080'}/api/v1/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        throw new Error(`Signup failed: ${response.statusText}`);
      }

      console.log('OTP sent successfully');
    } catch (error) {
      console.error('Signup email error:', error);
      throw error;
    }
  },

  // Step 2: Verify OTP and complete signup
  verifyOtpAndCompleteSignup: async (userData: SignupDetailsRequest): Promise<AuthResponse> => {
    try {
      console.log('Verifying OTP and completing signup:', { email: userData.email });
      
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:8080'}/api/v1/auth/verify-otp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        throw new Error(`OTP verification failed: ${response.statusText}`);
      }

      const backendResponse: BackendAuthResponse = await response.json();
      console.log('Backend signup response:', backendResponse);
      
      const authResponse: AuthResponse = {
        token: backendResponse.token,
        user: {
          id: backendResponse.userId.toString(),
          email: userData.email,
          firstName: userData.firstName,
          lastName: userData.lastName,
          companyName: userData.businessName,
        }
      };
      
      // Store token and user info in localStorage
      localStorage.setItem('authToken', backendResponse.token);
      localStorage.setItem('user', JSON.stringify(authResponse.user));
      
      console.log('Signup completed successfully, token stored, user ID:', backendResponse.userId);
      return authResponse;
    } catch (error) {
      console.error('OTP verification error:', error);
      throw error;
    }
  },

  // Fetch user profile
  fetchProfile: async (userId: string): Promise<ProfileResponse> => {
    try {
      console.log('Fetching profile for user:', userId);
      
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:8080'}/api/v1/profile/${userId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Profile fetch failed: ${response.statusText}`);
      }

      const profileData = await response.json();
      console.log('Profile data received:', profileData);
      
      return profileData;
    } catch (error) {
      console.error('Profile fetch error:', error);
      throw error;
    }
  },

  // Register new user (legacy - keeping for compatibility)
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
