
// API Configuration
export const API_CONFIG = {
  // Base URL for your Java Spring backend
  // Update this to match your Spring Boot server
  BASE_URL: process.env.REACT_APP_API_URL || 'http://localhost:8080/api',
  
  // Endpoints
  ENDPOINTS: {
    // Authentication
    LOGIN: '/auth/login',
    SIGNUP: '/auth/signup',
    GOOGLE_AUTH: '/auth/google',
    LOGOUT: '/auth/logout',
    
    // Invoices
    INVOICES: '/invoices',
    
    // Expenses
    EXPENSES: '/expenses',
    
    // Blogs
    BLOGS: '/blogs',
    
    // Admin endpoints
    ADMIN_BLOGS: '/admin/blogs',
    ADMIN_USERS: '/admin/users',
    ADMIN_SUBSCRIPTIONS: '/admin/subscriptions',
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
