import axiosInstance from './axiosInstance';

export interface ContactEnquiry {
  _id: string;
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  status: 'pending' | 'read' | 'responded';
  createdAt: string;
}

// Create new enquiry
export const createContactEnquiry = async (data: any) => {
  const response = await axiosInstance.post('/contact', data);
  return response.data;
};

// Get all enquiries (Admin)
export const getAllContactEnquiries = async () => {
    const response = await axiosInstance.get('/admin/contact-enquiries');
    return response.data;
};

// Get enquiry by ID (Admin)
export const getContactEnquiryById = async (id: string) => {
    const response = await axiosInstance.get(`/admin/contact-enquiries/${id}`);
    return response.data;
};

// Delete enquiry (Admin)
export const deleteContactEnquiry = async (id: string) => {
    const response = await axiosInstance.delete(`/admin/contact-enquiries/${id}`);
    return response.data;
}
