import api from './axiosInstance';

// Public Theme APIs
export const getActiveTheme = () => api.get('/theme');
