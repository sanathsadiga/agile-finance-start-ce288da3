
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

      const responseText = await response.text();
      console.log('Raw response:', responseText);
      
      const token = responseText.trim();
      
      // Decode JWT to get user information
      const decodedToken = decodeJWT(token);
      console.log('Decoded token:', decodedToken);
      
      // Extract user ID from token - the 'sub' field typically contains the user identifier
      let userId = 'temp-id';
      if (decodedToken && decodedToken.sub) {
        // If the sub contains an email, we'll need to make an API call to get the actual user ID
        // For now, let's try to extract any numeric ID from the token
        if (decodedToken.userId) {
          userId = decodedToken.userId.toString();
        } else if (decodedToken.id) {
          userId = decodedToken.id.toString();
        } else {
          // If no numeric ID is found in token, we'll need to call a "me" endpoint
          console.warn('No user ID found in token, using email as identifier for now');
          userId = decodedToken.sub; // This might be the email
        }
      }
      
      const authResponse: AuthResponse = {
        token,
        user: {
          id: userId,
          email: credentials.email,
          firstName: '',
          lastName: '',
        }
      };
      
      // Store token in localStorage
      localStorage.setItem('authToken', token);
      localStorage.setItem('user', JSON.stringify(authResponse.user));
      
      console.log('Login successful, token stored, user ID:', userId);
      return authResponse;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  },

  // Get current user info from token
  getCurrentUserFromToken: async (): Promise<{ id: string; email: string } | null> => {
    try {
      const token = localStorage.getItem('authToken');
      if (!token) return null;

      // Try to call a "me" endpoint to get the current user's info including numeric ID
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:8080'}/api/v1/auth/me`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const userData = await response.json();
        console.log('User data from /me endpoint:', userData);
        return {
          id: userData.id ? userData.id.toString() : 'temp-id',
          email: userData.email || '',
        };
      } else {
        // Fallback to decoding JWT
        const decodedToken = decodeJWT(token);
        if (decodedToken) {
          return {
            id: decodedToken.userId?.toString() || decodedToken.id?.toString() || 'temp-id',
            email: decodedToken.sub || '',
          };
        }
      }
    } catch (error) {
      console.error('Error getting user from token:', error);
    }
    return null;
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

      const responseText = await response.text();
      console.log('Raw OTP verification response:', responseText);
      
      const token = responseText.trim();
      
      // Decode JWT to get user information
      const decodedToken = decodeJWT(token);
      console.log('Decoded signup token:', decodedToken);
      
      let userId = 'temp-id';
      if (decodedToken && decodedToken.sub) {
        if (decodedToken.userId) {
          userId = decodedToken.userId.toString();
        } else if (decodedToken.id) {
          userId = decodedToken.id.toString();
        } else {
          userId = decodedToken.sub;
        }
      }
      
      const authResponse: AuthResponse = {
        token,
        user: {
          id: userId,
          email: userData.email,
          firstName: userData.firstName,
          lastName: userData.lastName,
          companyName: userData.businessName,
        }
      };
      
      // Store token in localStorage
      localStorage.setItem('authToken', token);
      localStorage.setItem('user', JSON.stringify(authResponse.user));
      
      console.log('Signup completed successfully, token stored, user ID:', userId);
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
      
      // If userId is still "temp-id", try to get the real user ID first
      if (userId === 'temp-id') {
        const currentUser = await authService.getCurrentUserFromToken();
        if (currentUser && currentUser.id !== 'temp-id') {
          userId = currentUser.id;
          // Update localStorage with the real user ID
          const user = JSON.parse(localStorage.getItem('user') || '{}');
          user.id = userId;
          localStorage.setItem('user', JSON.stringify(user));
        }
      }
      
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
