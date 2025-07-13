// API Configuration
const getApiBaseUrl = () => {
  // Check if we're in production (Vercel deployment)
  if (process.env.NODE_ENV === 'production') {
    return 'https://edutaskmap-backend.vercel.app';
  }
  
  // Development environment
  return process.env.REACT_APP_API_BASE_URL || 'http://localhost:3001';
};

export const API_BASE_URL = getApiBaseUrl(); 