import api from './axiosInstance';

// Public Gallery APIs
export const getAllGalleryImages = () => api.get('/gallery');
