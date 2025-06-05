
// API Configuration
export const API_CONFIG = {
  // Base URL for your Java Spring backend
  // Update this to match your Spring Boot server
  BASE_URL: import.meta.env.VITE_API_URL || 'http://localhost:8080',
  
  // Endpoints
  ENDPOINTS: {
    // Authentication
    LOGIN: '/api/v1/auth/login',
    SIGNUP: '/api/v1/auth/signup',
    GOOGLE_AUTH: '/api/v1/auth/google',
    LOGOUT: '/api/v1/auth/logout',
    
    // Invoices
    INVOICES: '/api/v1/invoices',
    
    // Expenses
    EXPENSES: '/api/v1/expenses',
    
    // Blogs
    BLOGS: '/api/v1/blogs',
    
    // Admin endpoints
    ADMIN_BLOGS: '/api/v1/admin/blogs',
    ADMIN_USERS: '/api/v1/admin/users',
    ADMIN_SUBSCRIPTIONS: '/api/v1/admin/subscriptions',
  },
  
  // Request timeouts
  TIMEOUT: 30000, // 30 seconds
  
  // Authentication storage keys
  STORAGE_KEYS: {
    AUTH_TOKEN: 'authToken',
    USER: 'user',
    REFRESH_TOKEN: 'refreshToken',
  },
};

// API status codes
export const API_STATUS = {
  SUCCESS: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
};
