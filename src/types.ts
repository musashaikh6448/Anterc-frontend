
export interface Service {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  issuesResolved?: string[];
  estimatedTime?: string;
  price: number;
}

export interface Category {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  services: Service[];
}

export interface User {
  id: string;
  fullName: string;
  mobile: string;
  avatar?: string;
}

export interface EnquiryFormData {
  fullName: string;
  mobile: string;
  location?: string; // Kept for backward compatibility
  address: string;
  landmark: string;
  city: string;
  state: string;
  pincode: string;
  brand: string;
  issue: string;
  email?: string;
  subject?: string;
  message?: string;
  bookedFor?: 'myself' | 'others';

}

export interface BookingFormData {
  fullName: string;
  mobile: string;
  city: string;
  address: string;
  brand: string;
  model: string;
  issue: string;
  preferredDate: string;
  preferredTime: string;
  bookedFor?: 'myself' | 'others';
}

export interface StatItem {
  label: string;
  value: string;
  icon: string;
}
