import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Clock, CheckCircle2, AlertCircle, Package, ArrowRight, Smartphone } from 'lucide-react';
import { useAuth } from '../AuthContext';
import { getMyEnquiries } from '@/api/customerApi';
import { toast } from 'sonner';

const MyEnquiriesPage: React.FC = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const [enquiries, setEnquiries] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);
    if (!authLoading && !user) {
      navigate('/auth');
      return;
    }

    const fetchEnquiries = async () => {
      try {
        const { data } = await getMyEnquiries();
        setEnquiries(data);
      } catch (err) {
        toast.error('Failed to load enquiries');
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchEnquiries();
    }
  }, [user, authLoading, navigate]);

  if (loading || authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'Completed':
        return 'bg-emerald-50 text-emerald-600 border-emerald-100';
      case 'Technician Assigned':
        return 'bg-indigo-50 text-indigo-600 border-indigo-100';
      case 'Cancelled':
        return 'bg-rose-50 text-rose-600 border-rose-100';
      default:
        return 'bg-amber-50 text-amber-600 border-amber-100';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Completed':
        return <CheckCircle2 size={14} strokeWidth={3} />;
      case 'Technician Assigned':
        return <Package size={14} strokeWidth={3} />;
      case 'Cancelled':
        return <AlertCircle size={14} strokeWidth={3} />;
      default:
        return <Clock size={14} strokeWidth={3} />;
    }
  };

  return (
    <div className="min-h-screen bg-white pb-32">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <button
          onClick={() => navigate('/')}
          className="inline-flex items-center gap-2 text-slate-400 hover:text-indigo-600 transition-colors mb-12 font-bold text-xs uppercase tracking-widest"
        >
          <ChevronLeft size={16} strokeWidth={3} />
          Back to Services
        </button>

        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
          <div className="space-y-2">
            <span className="text-indigo-600 font-bold text-xs uppercase tracking-[0.3em]">History</span>
            <h1 className="text-4xl sm:text-5xl font-black text-slate-900 tracking-tight">My Enquiries</h1>
          </div>
          <p className="text-slate-400 font-medium">Tracking {enquiries.length} active service requests.</p>
        </div>

        {enquiries.length > 0 ? (
          <div className="grid grid-cols-1 gap-6">
            {enquiries.map((enquiry, idx) => (
              <div
                key={enquiry._id}
                className="group bg-white rounded-[2rem] p-8 border border-slate-200/50 hover:border-indigo-200 hover:shadow-2xl hover:shadow-indigo-50 transition-all duration-500 animate-fade-in"
                style={{ animationDelay: `${idx * 100}ms` }}
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
                  <div className="space-y-4">
                    <div className="flex flex-wrap items-center gap-4">
                      <div className="px-3 py-1 bg-slate-100 rounded-full text-[10px] font-black text-slate-500 uppercase tracking-widest">
                        {enquiry._id.substr(-6)}
                      </div>
                      <div className={`flex items-center gap-2 px-4 py-1.5 rounded-2xl border text-[10px] font-black uppercase tracking-widest ${getStatusStyle(enquiry.status)}`}>
                        {getStatusIcon(enquiry.status)}
                        {enquiry.status}
                      </div>
                    </div>

                    <h3 className="text-2xl font-black text-slate-900 group-hover:text-indigo-600 transition-colors tracking-tight">
                      {enquiry.serviceType}
                    </h3>

                    <div className="flex flex-wrap items-center gap-x-8 gap-y-3">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400">
                          <Smartphone size={14} />
                        </div>
                        <p className="text-xs font-bold text-slate-500">{enquiry.applianceType}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400">
                          <Clock size={14} />
                        </div>
                        <p className="text-xs font-bold text-slate-500">{new Date(enquiry.createdAt).toLocaleDateString()}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400">
                          <Package size={14} />
                        </div>
                        <p className="text-xs font-bold text-slate-500 py-1">#{enquiry._id.substr(0, 8)}</p>
                      </div>
                    </div>
                  </div>

                  <button className="flex items-center justify-center gap-3 px-8 py-4 bg-slate-900 text-white font-extrabold text-sm rounded-2xl hover:bg-indigo-600 transition-all shadow-xl active:scale-[0.98]">
                    Details
                    <ArrowRight size={16} strokeWidth={3} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-24 bg-slate-50/50 rounded-[3rem] border border-dashed border-slate-200">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-white rounded-[2rem] text-slate-300 mb-6 shadow-sm">
              <Package size={32} />
            </div>
            <h3 className="text-2xl font-black text-slate-900 tracking-tight">Empty Inbox</h3>
            <p className="text-slate-400 font-medium mt-2 max-w-xs mx-auto">You haven't made any service enquiries yet.</p>
            <button
              onClick={() => navigate('/')}
              className="mt-10 px-10 py-5 bg-indigo-600 text-white font-extrabold rounded-2xl shadow-xl shadow-indigo-100 hover:bg-indigo-700 active:scale-95 transition-all"
            >
              Book First Service
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyEnquiriesPage;