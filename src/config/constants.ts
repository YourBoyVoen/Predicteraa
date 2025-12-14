// API base URL configuration
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL && import.meta.env.VITE_API_PORT
  ? `http://${import.meta.env.VITE_API_BASE_URL}:${import.meta.env.VITE_API_PORT}`
  : 'http://localhost:8000';
