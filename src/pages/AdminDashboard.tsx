import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import AdminLayout from '../components/admin/AdminLayout';
import DashboardPage from './admin/DashboardPage';
import EnquiriesPage from './admin/EnquiriesPage';
import CustomersPage from './admin/CustomersPage';
import AdminsPage from './admin/AdminsPage';
import ServicesPage from './admin/ServicesPage';
import ThemePage from './admin/ThemePage';

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate('/admin/login');
      return;
    }
    
    // Redirect /admin to /admin/dashboard
    if (location.pathname === '/admin' || location.pathname === '/admin/') {
      navigate('/admin/dashboard', { replace: true });
    }
  }, [user, navigate, location]);

  if (!user || user.role !== 'admin') {
    return null;
  }

  // Render appropriate page based on path
  const renderPage = () => {
    const path = location.pathname;
    if (path.includes('/enquiries')) return <EnquiriesPage />;
    if (path.includes('/customers')) return <CustomersPage />;
    if (path.includes('/admins')) return <AdminsPage />;
    if (path.includes('/services')) return <ServicesPage />;
    if (path.includes('/theme')) return <ThemePage />;
    return <DashboardPage />;
  };

  return <AdminLayout>{renderPage()}</AdminLayout>;
};

export default AdminDashboard;
