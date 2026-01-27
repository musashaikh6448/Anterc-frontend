import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { User, Smartphone, Lock, ShieldCheck, ArrowRight } from 'lucide-react';
import { useAuth } from '../AuthContext';
import { toast } from 'sonner';
import { loginCustomer, signupCustomer } from '@/api/customerApi';

const AuthPage: React.FC = () => {
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  // Get redirect path from state (set by guest-to-user enquiry flow)
  const from = location.state?.from?.pathname || location.state?.returnTo || '/';

  const [formData, setFormData] = useState({
    fullName: '',
    mobile: '',
    password: ''
  });

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [mode]);



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
    
    setLoading(true);

    try {
      let response;
      if (mode === 'signup') {
        response = await signupCustomer({
          name: formData.fullName,
          phone: formData.mobile,
          password: formData.password
        });
        toast.success('Account created successfully!');
      } else {
        response = await loginCustomer({
          phone: formData.mobile,
          password: formData.password
        });
        toast.success('Welcome back!');
      }

      const { token, ...user } = response.data;
      login(token, user);
      navigate(from, { replace: true });
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Authentication failed';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/50 flex flex-col items-center justify-center p-4 sm:p-8">
      <div className="w-full max-w-xl bg-white rounded-[2.5rem] sm:rounded-[3.5rem] p-8 sm:p-16 border border-slate-100 shadow-2xl shadow-slate-200/40 relative overflow-hidden">
        {/* Abstract Background Decoration */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-50/60 rounded-full blur-[80px] -mr-32 -mt-32"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-emerald-50/40 rounded-full blur-[60px] -ml-24 -mb-24"></div>

        <div className="relative z-10 text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-indigo-50 rounded-full border border-indigo-100 mb-6">
            <ShieldCheck size={14} className="text-indigo-600" strokeWidth={3} />
            <span className="text-indigo-600 font-black text-[10px] uppercase tracking-widest">Safe & Secure Auth</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-black text-slate-900 tracking-tighter leading-tight mb-4">
            {mode === 'login' ? 'Welcome Back' : 'Create Account'}
          </h1>
          <p className="text-slate-500 font-medium max-w-xs mx-auto">
            {mode === 'login'
              ? 'Access your service enquiries and bookings in Nanded.'
              : 'Join Antarc Services for a faster checkout experience.'}
          </p>
        </div>

        {/* Auth Toggle */}
        <div className="relative z-10 flex bg-slate-100 p-1.5 rounded-[1.5rem] mb-10">
          <button
            onClick={() => setMode('login')}
            className={`flex-1 py-4 font-black text-xs uppercase tracking-widest rounded-[1.25rem] transition-all ${mode === 'login' ? 'bg-white text-indigo-600 shadow-lg' : 'text-slate-400 hover:text-slate-600'}`}
          >
            Login
          </button>
          <button
            onClick={() => setMode('signup')}
            className={`flex-1 py-4 font-black text-xs uppercase tracking-widest rounded-[1.25rem] transition-all ${mode === 'signup' ? 'bg-white text-indigo-600 shadow-lg' : 'text-slate-400 hover:text-slate-600'}`}
          >
            Sign Up
          </button>
        </div>


        <form onSubmit={handleSubmit} className="relative z-10 space-y-6">
          {mode === 'signup' && (
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">
                <User size={14} strokeWidth={2.5} /> Full Name
              </label>
              <input
                required
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                placeholder="e.g. Rahul Sharma"
                className="w-full px-8 py-5 bg-slate-50 border border-slate-100 rounded-2xl focus:bg-white focus:ring-4 focus:ring-indigo-100/50 focus:border-indigo-500 outline-none text-sm sm:text-base font-bold transition-all placeholder:text-slate-300"
              />
            </div>
          )}

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
            className="w-full py-5 sm:py-6 bg-slate-900 hover:bg-indigo-600 disabled:bg-slate-200 text-white font-black text-base sm:text-lg rounded-[2rem] transition-all shadow-2xl active:scale-[0.98] flex items-center justify-center gap-4"
          >
            {loading ? (
              <>
                <div className="w-5 h-5 border-4 border-white/20 border-t-white rounded-full animate-spin"></div>
                Verifying...
              </>
            ) : (
              <>
                {mode === 'login' ? 'Login' : 'Create Account'}
                <ArrowRight size={20} strokeWidth={3} />
              </>
            )}
          </button>
        </form>

        <div className="relative z-10 text-center mt-8">
          <button
            onClick={() => navigate('/admin/login')}
            className="text-sm text-slate-500 hover:text-indigo-600 font-bold transition-colors"
          >
            Admin Login →
          </button>
        </div>

        <p className="relative z-10 text-center mt-6 text-slate-400 text-xs font-bold leading-relaxed">
          By continuing, you agree to Antarc Services' <br />
          <span className="text-slate-900 underline underline-offset-4 cursor-pointer">Terms</span> and <span className="text-slate-900 underline underline-offset-4 cursor-pointer">Privacy Policy</span>.
        </p>
      </div>
    </div>
  );
};

export default AuthPage;
