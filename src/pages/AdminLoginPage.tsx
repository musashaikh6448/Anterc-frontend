import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Smartphone, Lock, ShieldCheck, ArrowRight, UserCog } from 'lucide-react';
import { useAuth } from '../AuthContext';
import { toast } from 'sonner';
import { loginAdmin } from '@/api/adminApi';

const AdminLoginPage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login, user } = useAuth();

  const [formData, setFormData] = useState({
    mobile: '',
    password: ''
  });

  useEffect(() => {
    window.scrollTo(0, 0);
    
    // If already logged in as admin, redirect to dashboard
    if (user && user.role === 'admin') {
      navigate('/admin/dashboard', { replace: true });
    }
  }, [user, navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    // Validate mobile number to only allow 10 digits
    if (name === 'mobile') {
      const numericValue = value.replace(/\D/g, ''); // Remove non-digits
      if (numericValue.length <= 10) {
        setFormData({ ...formData, [name]: numericValue });
      }
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate mobile number
    if (formData.mobile.length !== 10) {
      toast.error('Mobile number must be exactly 10 digits');
      return;
    }
    
    if (!formData.password) {
      toast.error('Password is required');
      return;
    }
    
    setLoading(true);

    try {
      const response = await loginAdmin({
        phone: formData.mobile,
        password: formData.password
      });

      const { token, ...userData } = response.data;
      login(token, userData);
      
      toast.success('Admin login successful!');
      navigate('/admin/dashboard', { replace: true });
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Authentication failed';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50/30 to-slate-50 flex flex-col items-center justify-center p-4 sm:p-8">
      <div className="w-full max-w-md bg-white rounded-[2.5rem] sm:rounded-[3.5rem] p-8 sm:p-12 border border-slate-100 shadow-2xl shadow-slate-200/40 relative overflow-hidden">
        {/* Abstract Background Decoration */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-50/60 rounded-full blur-[80px] -mr-32 -mt-32"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-purple-50/40 rounded-full blur-[60px] -ml-24 -mb-24"></div>

        <div className="relative z-10 text-center mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-indigo-50 rounded-full border border-indigo-100 mb-6">
            <UserCog size={16} className="text-indigo-600" strokeWidth={3} />
            <span className="text-indigo-600 font-black text-[10px] uppercase tracking-widest">Admin Access</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-black text-slate-900 tracking-tighter leading-tight mb-4">
            Admin Login
          </h1>
          <p className="text-slate-500 font-medium max-w-xs mx-auto">
            Access admin dashboard and manage services
          </p>
        </div>

        <form onSubmit={handleSubmit} className="relative z-10 space-y-6">
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">
              <Smartphone size={14} strokeWidth={2.5} /> Mobile Number
            </label>
            <div className="relative">
              <div className="absolute left-6 top-1/2 -translate-y-1/2 font-black text-slate-400 text-sm border-r border-slate-200 pr-3">+91</div>
              <input
                required
                name="mobile"
                type="tel"
                value={formData.mobile}
                onChange={handleChange}
                maxLength={10}
                pattern="[0-9]{10}"
                placeholder="10 digit number"
                className="w-full pl-20 pr-8 py-5 bg-slate-50 border border-slate-100 rounded-2xl focus:bg-white focus:ring-4 focus:ring-indigo-100/50 focus:border-indigo-500 outline-none text-sm sm:text-base font-bold transition-all placeholder:text-slate-300"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">
              <Lock size={14} strokeWidth={2.5} /> Password
            </label>
            <input
              required
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
              className="w-full px-8 py-5 bg-slate-50 border border-slate-100 rounded-2xl focus:bg-white focus:ring-4 focus:ring-indigo-100/50 focus:border-indigo-500 outline-none text-sm sm:text-base font-bold transition-all placeholder:text-slate-300"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-5 sm:py-6 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-200 disabled:text-slate-400 text-white font-black text-base sm:text-lg rounded-[2rem] transition-all shadow-2xl active:scale-[0.98] flex items-center justify-center gap-4"
          >
            {loading ? (
              <>
                <div className="w-5 h-5 border-4 border-white/20 border-t-white rounded-full animate-spin"></div>
                Verifying...
              </>
            ) : (
              <>
                Login to Dashboard
                <ArrowRight size={20} strokeWidth={3} />
              </>
            )}
          </button>
        </form>

        <div className="relative z-10 mt-8 text-center">
          <button
            onClick={() => navigate('/auth')}
            className="text-sm text-slate-500 hover:text-indigo-600 font-bold transition-colors"
          >
            Customer Login →
          </button>
        </div>

        <p className="relative z-10 text-center mt-6 text-slate-400 text-xs font-bold leading-relaxed">
          Secure admin access only. <br />
          Unauthorized access is prohibited.
        </p>
      </div>
    </div>
  );
};

export default AdminLoginPage;
