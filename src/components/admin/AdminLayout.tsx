import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  MessageSquare,
  Users,
  UserCog,
  Palette,
  LogOut,
  Menu,
  X,
  Sparkles,
  Mail
} from 'lucide-react';
import { useAuth } from '../../AuthContext';
import { toast } from 'sonner';

interface AdminLayoutProps {
  children: React.ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    navigate('/');
  };

  const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/admin/dashboard' },
    { icon: MessageSquare, label: 'Service Enquiries', path: '/admin/enquiries' },
    { icon: Mail, label: 'Contact Messages', path: '/admin/contact-enquiries' },
    { icon: Users, label: 'Customers', path: '/admin/customers' },
    { icon: UserCog, label: 'Admins', path: '/admin/admins' },
    { icon: Sparkles, label: 'Services', path: '/admin/services' },
    { icon: Palette, label: 'Theme', path: '/admin/theme' },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50/20 to-slate-50 flex">
      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden transition-opacity"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 w-72 bg-white border-r border-slate-100 flex flex-col z-50 transform transition-transform duration-300 ease-in-out ${sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
          }`}
      >
        {/* Sidebar Header */}
        <div className="p-6 border-b border-slate-100">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight">Admin Panel</h1>
              <p className="text-xs text-slate-500 mt-1 font-medium">Welcome back, {user?.name}</p>
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              className="md:hidden p-2 rounded-lg hover:bg-slate-100 transition-colors"
            >
              <X size={20} className="text-slate-600" />
            </button>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);
            return (
              <button
                key={item.path}
                onClick={() => {
                  navigate(item.path);
                  setSidebarOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl font-bold text-sm transition-all duration-500 group ${active
                    ? 'bg-slate-900 text-white shadow-xl'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  }`}
              >
                <div className={`p-2 rounded-xl transition-all ${active
                    ? 'bg-white/10'
                    : 'bg-slate-50 group-hover:bg-indigo-50 group-hover:text-indigo-600'
                  }`}>
                  <Icon size={18} strokeWidth={2.5} />
                </div>
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Logout Button */}
        <div className="p-4 border-t border-slate-100">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl font-bold text-sm text-rose-600 hover:bg-rose-50 transition-all duration-500"
          >
            <div className="p-2 rounded-xl bg-rose-50">
              <LogOut size={18} strokeWidth={2.5} />
            </div>
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 md:ml-72 min-h-screen">
        {/* Mobile Header */}
        <div className="md:hidden sticky top-0 z-30 bg-white/80 backdrop-blur-lg border-b border-slate-100 p-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-black text-slate-900">Admin Panel</h2>
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-2 rounded-xl hover:bg-slate-50 transition-all"
            >
              <Menu size={24} className="text-slate-600" />
            </button>
          </div>
        </div>

        {/* Page Content */}
        <div className="p-4 md:p-6 lg:p-8">{children}</div>
      </main>
    </div>
  );
};

export default AdminLayout;
