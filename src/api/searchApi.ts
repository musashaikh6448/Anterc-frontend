import api from './axiosInstance';

// Search APIs
export const searchServices = (query: string) => 
  api.get('/search', { params: { q: query } });
