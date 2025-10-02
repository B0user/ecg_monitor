// Centralized API URL configuration for frontend
// Prefer VITE_API_URL if provided, fallback to localhost backend
export const API_URL = 'https://api.ecg-panel.demo.medcore.kz';

// Optional helpers
export const API_BASE = `${API_URL}/api`;
export const UPLOADS_BASE = `${API_URL}/uploads`;

// Demo mode: when true, app uses mock data and no backend is required
export const DEMO = String(import.meta.env.VITE_DEMO || 'false').toLowerCase() === 'true';
