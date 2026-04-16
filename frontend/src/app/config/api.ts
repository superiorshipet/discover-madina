// In production (Railway), use relative path (nginx proxies to backend)
// In development, use localhost:8080
export const API_BASE = import.meta.env.DEV 
  ? 'http://localhost:8080/api' 
  : '/api';
