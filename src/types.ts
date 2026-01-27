
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
  location: string;
  brand: string;
  issue: string;
  email?: string;
  subject?: string;
  message?: string;
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
}

export interface StatItem {
  label: string;
  value: string;
  icon: string;
}
