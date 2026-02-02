import api from './axiosInstance';

// Admin Auth APIs
export const loginAdmin = (credentials: any) => api.post('/admin/login', credentials);
export const getAdminProfile = () => api.get('/admin/me');

// Admin Statistics
export const getStatistics = () => api.get('/admin/statistics');

// Admin Enquiry APIs
export const getAllEnquiries = () => api.get('/admin/enquiries');
export const updateEnquiryStatus = (id: string, status: string) => api.put(`/admin/enquiry/${id}`, { status });
export const updateEnquiry = (id: string, data: any) => api.put(`/admin/enquiry/${id}/update`, data);
export const uploadInvoice = (id: string, formData: FormData) => api.post(`/admin/enquiry/${id}/invoice`, formData); 
export const deleteEnquiry = (id: string) => api.delete(`/admin/enquiry/${id}`);
export const assignTechnician = (id: string, technicianId: string) => api.put(`/admin/enquiry/${id}/assign`, { technicianId });

// Admin Customer APIs
export const getAllCustomers = () => api.get('/admin/customers');

// Admin Management APIs
export const getAllAdmins = () => api.get('/admin/admins');
export const createAdmin = (adminData: any) => api.post('/admin/admins', adminData);
export const updateAdmin = (id: string, adminData: any) => api.put(`/admin/admins/${id}`, adminData);
export const deleteAdmin = (id: string) => api.delete(`/admin/admins/${id}`);

// Category Management APIs
export const getAllCategoriesAdmin = () => api.get('/categories/admin');
export const createCategory = (data: any) => api.post('/categories', data);
export const updateCategory = (id: string, data: any) => api.put(`/categories/${id}`, data);
export const deleteCategory = (id: string) => api.delete(`/categories/${id}`);
export const reorderCategories = (orderedIds: string[]) => api.put('/categories/reorder', { orderedIds });

// Service Management APIs
export const getAllServicesAdmin = () => api.get('/admin/services');
export const createService = (serviceData: any) => api.post('/admin/services', serviceData);
export const updateService = (id: string, serviceData: any) => api.put(`/admin/services/${id}`, serviceData);
export const deleteService = (id: string) => api.delete(`/admin/services/${id}`);
export const toggleServiceStatus = (id: string) => api.put(`/admin/services/${id}/toggle`);

// Theme Management APIs
export const getAllThemes = () => api.get('/admin/themes');
export const updateTheme = (themeData: any) => api.put('/admin/theme', themeData);

// Gallery Management APIs
export const getAllGalleryImagesAdmin = () => api.get('/admin/gallery');
export const createGalleryImage = (imageData: any) => api.post('/admin/gallery', imageData);
export const updateGalleryImage = (id: string, imageData: any) => api.put(`/admin/gallery/${id}`, imageData);
export const deleteGalleryImage = (id: string) => api.delete(`/admin/gallery/${id}`);

// Technician Management APIs
export const getTechnicians = () => api.get('/technicians');
export const createTechnician = (data: any) => api.post('/technicians', data);
export const updateTechnician = (id: string, data: any) => api.put(`/technicians/${id}`, data);
export const deleteTechnician = (id: string) => api.delete(`/technicians/${id}`);

// Review Management APIs
export const getAllReviews = () => api.get('/reviews');
