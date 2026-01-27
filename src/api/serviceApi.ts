import api from './axiosInstance';

// Public Service APIs
export const getAllServices = () => api.get('/services');
export const getServicesByCategory = (category: string) => api.get(`/services/category/${category}`);
export const getServiceById = (id: string) => api.get(`/services/${id}`);
