// src/config/api.js
// Centralized API configuration loaded from environment variables (.env)

export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/v1';
