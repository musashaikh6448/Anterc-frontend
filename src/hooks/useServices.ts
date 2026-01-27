import { useState, useEffect } from 'react';
import { getAllServices } from '@/api/serviceApi';

export const useServices = () => {
  const [services, setServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      setLoading(true);
      const { data } = await getAllServices();
      setServices(data);
      setError(null);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load services');
    } finally {
      setLoading(false);
    }
  };

  // Group services by category
  const servicesByCategory = services.reduce((acc, service) => {
    if (!acc[service.category]) {
      acc[service.category] = [];
    }
    acc[service.category].push(service);
    return acc;
  }, {} as Record<string, any[]>);

  // Get services for a specific category
  const getServicesByCategory = (category: string) => {
    return services.filter((s) => s.category === category);
  };

  // Get a single service by ID
  const getServiceById = (id: string) => {
    return services.find((s) => s._id === id);
  };

  return {
    services,
    servicesByCategory,
    getServicesByCategory,
    getServiceById,
    loading,
    error,
    refetch: fetchServices,
  };
};
