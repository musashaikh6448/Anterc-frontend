import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { ChevronLeft, User, Smartphone, MapPin, Info, Send, CheckCircle2, ShieldCheck, BadgeCheck } from 'lucide-react';
import { EnquiryFormData } from '../types';
import { useAuth } from '../AuthContext';
import { toast } from 'sonner';
import { createEnquiry } from '@/api/customerApi';
import { getServicesByCategory } from '@/api/serviceApi';

const EnquiryPage: React.FC = () => {
  const { categoryId, serviceId } = useParams<{ categoryId: string; serviceId: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();

  const [category, setCategory] = useState<any>(null);
  const [service, setService] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState<EnquiryFormData>({
    fullName: user?.name || '',
    mobile: user?.phone || '',
    location: '',
    brand: '',
    issue: '',
  });

  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    
    // Check if user is logged in, if not redirect to login
    if (!user) {
      navigate('/auth', { state: { returnTo: `/enquiry/${categoryId}/${serviceId}` } });
      return;
    }
    
    fetchService();
  }, [categoryId, serviceId, user, navigate]);

  useEffect(() => {
    if (user) {
      // Fetch full user profile to get address and other details
      const fetchUserProfile = async () => {
        try {
          const { getCustomerProfile } = await import('@/api/customerApi');
          const { data } = await getCustomerProfile();
          setFormData(prev => ({
            ...prev,
            fullName: data.name || prev.fullName,
            mobile: data.phone || prev.mobile,
            location: data.address || prev.location,
          }));
        } catch (error) {
          // Fallback to basic user data
          setFormData(prev => ({
            ...prev,
            fullName: user.name || prev.fullName,
            mobile: user.phone || prev.mobile,
          }));
        }
      };
      fetchUserProfile();
    }
  }, [user]);

  const fetchService = async () => {
    if (!categoryId || !serviceId) return;

    try {
      setLoading(true);
      // Convert URL id back to category name
      const categoryNameMap: Record<string, string> = {
        'air-conditioner': 'Air Conditioner',
        'ceiling-table-fan': 'Ceiling & Table Fan',
        'water-purifier': 'Water Purifier',
        'visi-cooler': 'Visi Cooler',
        'water-cooler': 'Water Cooler',
        'air-cooler': 'Air Cooler',
        'cctv-camera': 'CCTV Camera',
        'computer-laptop': 'Computer & Laptop',
        'microwave-oven': 'Microwave oven',
        'electric-induction': 'Electric Induction',
        'air-purifier': 'Air Purifier',
        'home-theatre-sound-box': 'Home theatre/ Sound box',
        'inverter-batteries': 'Inverter Batteries',
        'vacuum-cleaner': 'Vacuum cleaner',
        'washing-machine': 'Washing Machine',
        'deep-freezer': 'Deep Freezer',
      };

      const categoryName = categoryNameMap[categoryId] ||
        categoryId.split('-')
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
          .join(' ');

      const { data } = await getServicesByCategory(categoryName);

      if (data.length > 0) {
        const firstService = data[0];
        setCategory({
          id: categoryId,
          title: firstService.category,
          description: firstService.description,
        });

        // Parse serviceId: format is "serviceId-subIndex"
        const [mainServiceId, subIndex] = serviceId.split('-');
        const mainService = data.find((s: any) => s._id === mainServiceId);

        if (mainService && mainService.subServices && mainService.subServices[parseInt(subIndex)]) {
          const subService = mainService.subServices[parseInt(subIndex)];
          setService({
            id: serviceId,
            name: subService.name,
            description: subService.description,
            price: subService.price,
            imageUrl: subService.imageUrl,
            issuesResolved: subService.issuesResolved || [],
          });
        } else {
          // Fallback: try to find by service ID directly
          const foundService = data.find((s: any) => s._id === serviceId);
          if (foundService && foundService.subServices && foundService.subServices[0]) {
            const subService = foundService.subServices[0];
            setService({
              id: serviceId,
              name: subService.name,
              description: subService.description,
              price: subService.price,
              imageUrl: subService.imageUrl,
              issuesResolved: subService.issuesResolved || [],
            });
          }
        }
      }
    } catch (error: any) {
      console.error('Failed to load service:', error);
      toast.error('Failed to load service details');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      // Redirect to auth with return path
      navigate('/auth', { state: { from: location } });
      return;
    }

    setSubmitting(true);

    try {
      await createEnquiry({
        serviceType: service?.name || 'Service',
        applianceType: category?.title || 'Appliance',
        message: `
          Location: ${formData.location}
          Brand: ${formData.brand}
          Issue: ${formData.issue}
          Contact: ${formData.fullName} (${formData.mobile})
        `,
        address: formData.location,
        city: '', // Can be added to form if needed
        brand: formData.brand
      });
      toast.success('Enquiry sent successfully!');
      navigate('/success');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to submit enquiry');
    } finally {
      setSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50/30 flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!service) {
    return (
      <div className="min-h-screen bg-slate-50/30 flex items-center justify-center">
        <div className="text-center">
          <p className="text-slate-500 mb-4 font-bold">Service not found</p>
          <button
            onClick={() => navigate(-1)}
            className="text-indigo-600 font-bold hover:underline"
          >
            Go back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50/30 pb-20 sm:pb-32">
      <div className="max-w-3xl mx-auto px-4 py-8 sm:py-24">
        <button onClick={() => navigate(-1)} className="inline-flex items-center gap-2 text-slate-400 hover:text-indigo-600 transition-all mb-8 sm:mb-12 font-black text-[10px] uppercase tracking-[0.3em]">
          <ChevronLeft size={16} strokeWidth={3} />
          Go Back
        </button>

        <div className="bg-white rounded-[2rem] sm:rounded-[3rem] p-6 sm:p-16 border border-slate-100 shadow-2xl shadow-slate-200/40 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-48 h-48 sm:w-64 sm:h-64 bg-indigo-50/50 rounded-full blur-[60px] sm:blur-[80px] -mr-24 -mt-24 sm:-mr-32 sm:-mt-32"></div>

          <div className="relative z-10 mb-10 sm:mb-16 space-y-3 sm:space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-50 rounded-full border border-indigo-100">
              <CheckCircle2 size={14} className="text-indigo-600 sm:w-4 sm:h-4" strokeWidth={3} />
              <span className="text-indigo-600 font-black text-[8px] sm:text-[10px] uppercase tracking-widest">Callback guaranteed</span>
            </div>
            <h1 className="text-3xl sm:text-6xl font-black text-slate-900 tracking-tighter leading-tight">{service.name}</h1>
            <p className="text-slate-500 text-sm sm:text-lg font-medium leading-relaxed">Let's get your technician scheduled. Enter your details below.</p>
            {service.price && (
              <p className="text-2xl sm:text-3xl font-black text-indigo-600">₹{service.price}</p>
            )}
          </div>

          <form onSubmit={handleSubmit} className="relative z-10 space-y-8 sm:space-y-12">
            <div className="space-y-6 sm:space-y-10">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-8">
                <div className="group space-y-2 sm:space-y-3">
                  <label className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] group-focus-within:text-indigo-600 transition-colors">
                    <User size={14} strokeWidth={2.5} /> Name
                  </label>
                  <input
                    required
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    placeholder="Enter full name"
                    className="w-full px-5 sm:px-8 py-4 sm:py-5 bg-slate-50 border border-slate-100 rounded-xl sm:rounded-2xl focus:bg-white focus:ring-4 focus:ring-indigo-100/50 focus:border-indigo-500 focus:outline-none text-sm sm:text-base font-bold transition-all placeholder:text-slate-300"
                  />
                </div>

                <div className="group space-y-2 sm:space-y-3">
                  <label className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] group-focus-within:text-indigo-600 transition-colors">
                    <Smartphone size={14} strokeWidth={2.5} /> Mobile
                  </label>
                  <div className="relative">
                    <div className="absolute left-4 sm:left-6 top-1/2 -translate-y-1/2 font-black text-slate-400 text-xs sm:text-sm border-r border-slate-200 pr-2 sm:pr-3">+91</div>
                    <input
                      required
                      name="mobile"
                      value={formData.mobile}
                      onChange={handleChange}
                      pattern="[0-9]{10}"
                      maxLength={10}
                      placeholder="10 digit number"
                      className="w-full pl-14 sm:pl-20 pr-5 sm:pr-8 py-4 sm:py-5 bg-slate-50 border border-slate-100 rounded-xl sm:rounded-2xl focus:bg-white focus:ring-4 focus:ring-indigo-100/50 focus:border-indigo-500 focus:outline-none text-sm sm:text-base font-bold transition-all placeholder:text-slate-300"
                    />
                  </div>
                </div>
              </div>

              <div className="group space-y-2 sm:space-y-3">
                <label className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] group-focus-within:text-indigo-600 transition-colors">
                  <MapPin size={14} strokeWidth={2.5} /> Address
                </label>
                <input
                  required
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  placeholder="Street, Building, Landmark"
                  className="w-full px-5 sm:px-8 py-4 sm:py-5 bg-slate-50 border border-slate-100 rounded-xl sm:rounded-2xl focus:bg-white focus:ring-4 focus:ring-indigo-100/50 focus:border-indigo-500 focus:outline-none text-sm sm:text-base font-bold transition-all placeholder:text-slate-300"
                />
              </div>

              <div className="group space-y-2 sm:space-y-3">
                <label className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] group-focus-within:text-indigo-600 transition-colors">
                  <Info size={14} strokeWidth={2.5} /> Issue Details
                </label>
                <div className="space-y-3 sm:space-y-4">
                  <input
                    name="brand"
                    value={formData.brand}
                    onChange={handleChange}
                    placeholder="Appliance Brand (Optional)"
                    className="w-full px-5 sm:px-8 py-4 sm:py-5 bg-slate-50 border border-slate-100 rounded-xl sm:rounded-2xl focus:bg-white focus:ring-4 focus:ring-indigo-100/50 focus:border-indigo-500 focus:outline-none text-sm sm:text-base font-bold transition-all placeholder:text-slate-300"
                  />
                  <textarea
                    required
                    name="issue"
                    value={formData.issue}
                    onChange={handleChange}
                    rows={3}
                    placeholder="Describe the problem..."
                    className="w-full px-5 sm:px-8 py-4 sm:py-5 bg-slate-50 border border-slate-100 rounded-[1.5rem] sm:rounded-[2rem] focus:bg-white focus:ring-4 focus:ring-indigo-100/50 focus:border-indigo-500 focus:outline-none text-sm sm:text-base font-bold transition-all resize-none placeholder:text-slate-300"
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-5 sm:py-6 bg-slate-900 hover:bg-indigo-600 disabled:bg-slate-200 text-white font-black text-base sm:text-lg rounded-xl sm:rounded-[2rem] transition-all shadow-2xl active:scale-[0.98] flex items-center justify-center gap-3 sm:gap-4"
            >
              {submitting ? (
                <>
                  <div className="w-5 h-5 border-4 border-white/20 border-t-white rounded-full animate-spin"></div>
                  Processing...
                </>
              ) : (
                <>
                  Confirm Enquiry
                  <Send size={20} strokeWidth={3} />
                </>
              )}
            </button>
          </form>

          <div className="mt-10 sm:mt-16 pt-6 sm:pt-8 border-t border-slate-50 flex flex-wrap items-center justify-center gap-6 sm:gap-8 opacity-60">
            <div className="flex items-center gap-2 text-[9px] font-bold text-slate-400 uppercase tracking-widest">
              <ShieldCheck size={16} /> Data Secure
            </div>
            <div className="flex items-center gap-2 text-[9px] font-bold text-slate-400 uppercase tracking-widest">
              <BadgeCheck size={16} /> Verified Pros
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnquiryPage;
