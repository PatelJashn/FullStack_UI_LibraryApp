// API Configuration
// This file centralizes the backend URL configuration

// Get the API URL from environment variable or use a default
const getApiUrl = () => {
  // In production (Vercel), this should be set via environment variable
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
  }
  
  // Fallback for development
  return 'http://localhost:5002';
};

// Export the API base URL
export const API_BASE_URL = getApiUrl();

// Helper function to create full API URLs
export const createApiUrl = (endpoint) => {
  return `${API_BASE_URL}${endpoint}`;
};

// Common API endpoints
export const API_ENDPOINTS = {
  // Auth endpoints
  LOGIN: '/api/auth/login',
  SIGNUP: '/api/auth/signup',
  PROFILE: '/api/auth/profile',
  
  // UI Components endpoints
  COMPONENTS: '/api/ui-components',
  COMPONENT_BY_ID: (id) => `/api/ui-components/${id}`,
  AI_MODIFY: (id) => `/api/ui-components/${id}/ai-modify`,
  
  // Health check
  HEALTH: '/health'
};

console.log('🔧 API Configuration:', {
  API_BASE_URL,
  environment: import.meta.env.MODE,
  hasEnvVar: !!import.meta.env.VITE_API_URL
});
