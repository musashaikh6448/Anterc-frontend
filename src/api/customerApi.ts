import api from './axiosInstance';

// Auth APIs
export const signupCustomer = (userData: any) => api.post('/customer/signup', userData);
export const loginCustomer = (credentials: any) => api.post('/customer/login', credentials);
export const getCustomerProfile = () => api.get('/customer/me');

// Enquiry APIs
export const createEnquiry = (enquiryData: any) => api.post('/customer/enquiry', enquiryData);
export const getMyEnquiries = () => api.get('/customer/enquiries');

// Review APIs
export const createReview = (reviewData: any) => api.post('/reviews', reviewData);
