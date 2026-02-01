import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ChevronLeft,
  Clock,
  CheckCircle2,
  AlertCircle,
  Package,
  Smartphone,
  MessageSquare,
  MapPin,
  Download,
  UserCog,
  Phone
} from 'lucide-react';
import { useAuth } from '../AuthContext';
import { getMyEnquiries } from '@/api/customerApi';
import { toast } from 'sonner';

const MyEnquiriesPage: React.FC = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();

  const [enquiries, setEnquiries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);

    if (!authLoading && !user) {
      navigate('/auth');
      return;
    }

    const fetchEnquiries = async () => {
      try {
        const { data } = await getMyEnquiries();
        setEnquiries(data || []);
      } catch (error) {
        toast.error('Failed to load enquiries');
      } finally {
        setLoading(false);
      }
    };

    if (user) fetchEnquiries();
  }, [user, authLoading, navigate]);

  if (loading || authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  /* ---------------- STATUS UI ---------------- */

  const getStatusStyle = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'completed':
        return 'bg-emerald-50 text-emerald-600 border-emerald-100';
      case 'technician assigned':
        return 'bg-indigo-50 text-indigo-600 border-indigo-100';
      case 'cancelled':
        return 'bg-rose-50 text-rose-600 border-rose-100';
      case 'pending':
      default:
        return 'bg-amber-50 text-amber-600 border-amber-100';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'completed':
        return <CheckCircle2 size={14} strokeWidth={3} />;
      case 'technician assigned':
        return <Package size={14} strokeWidth={3} />;
      case 'cancelled':
        return <AlertCircle size={14} strokeWidth={3} />;
      case 'pending':
      default:
        return <Clock size={14} strokeWidth={3} />;
    }
  };

  return (
    <div className="min-h-screen bg-white pb-32">
      <div className="max-w-4xl mx-auto px-4 py-12">

        {/* BACK BUTTON */}
        <button
          onClick={() => navigate('/')}
          className="inline-flex items-center gap-2 text-slate-400 hover:text-indigo-600 transition-colors mb-12 font-bold text-xs uppercase tracking-widest"
        >
          <ChevronLeft size={16} strokeWidth={3} />
          Back to Services
        </button>

        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
          <div>
            <span className="text-indigo-600 font-bold text-xs uppercase tracking-[0.3em]">
              History
            </span>
            <h1 className="text-4xl sm:text-5xl font-black text-slate-900">
              My Enquiries
            </h1>
          </div>
          <p className="text-slate-400 font-medium">
            Tracking {enquiries.length} service requests
          </p>
        </div>

        {/* LIST */}
        {enquiries.length > 0 ? (
          <div className="grid gap-6">
            {enquiries.map((enquiry, idx) => (
              <div
                key={enquiry._id}
                className="bg-white rounded-[2rem] p-8 border border-slate-200 hover:border-indigo-200 hover:shadow-xl transition-all"
              >
                <div className="space-y-5">

                  {/* TOP */}
                  <div className="flex flex-wrap gap-4 items-center">
                    <span className="px-3 py-1 bg-slate-100 rounded-full text-[10px] font-black text-slate-500 uppercase tracking-widest">
                      {enquiry._id?.slice(-6)}
                    </span>

                    <span
                      className={`flex items-center gap-2 px-4 py-1.5 rounded-2xl border text-[10px] font-black uppercase tracking-widest ${getStatusStyle(enquiry.status)}`}
                    >
                      {getStatusIcon(enquiry.status)}
                      {enquiry.status}
                    </span>

                    {enquiry.invoiceUrl && (
                      <a
                        href={enquiry.invoiceUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 px-3 py-1 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-full text-[10px] font-black uppercase tracking-widest transition-colors"
                      >
                        <Download size={14} className="stroke-[3]" />
                        Invoice
                      </a>
                    )}
                  </div>

                  <a
                    href="tel:+917385650510"
                    className="flex items-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-700 rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-indigo-100 transition-colors border border-indigo-100"
                  >
                    <Phone size={14} className="stroke-[3]" />
                    Call Support
                  </a>
                </div>

                {/* TITLE */}
                <h3 className="text-2xl font-black text-slate-900">
                  {enquiry.serviceType}
                </h3>

                {/* META */}
                <div className="flex flex-wrap gap-6">
                  <div className="flex items-center gap-2">
                    <Smartphone size={14} className="text-slate-400" />
                    <span className="text-xs font-bold text-slate-500">
                      {enquiry.applianceType} {enquiry.brand && <span className="font-normal text-slate-400">({enquiry.brand})</span>}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Clock size={14} className="text-slate-400" />
                    <span className="text-xs font-bold text-slate-500">
                      {new Date(enquiry.createdAt).toLocaleDateString()}
                    </span>
                  </div>

                  {(enquiry.city || enquiry.address) && (
                    <div className="flex items-start gap-2 max-w-[50%]">
                      <MapPin size={14} className="text-slate-400 mt-0.5 shrink-0" />
                      <div className="flex flex-col">
                        <span className="text-xs font-bold text-slate-500">
                          {enquiry.city}{enquiry.state ? `, ${enquiry.state}` : ''} {enquiry.pincode && `- ${enquiry.pincode}`}
                        </span>
                        {enquiry.address && <span className="text-[10px] text-slate-400 leading-tight mt-0.5">{enquiry.address}</span>}
                        {enquiry.landmark && <span className="text-[10px] text-indigo-500 font-medium mt-0.5">Near {enquiry.landmark}</span>}
                      </div>
                    </div>
                  )}
                </div>

                {/* MESSAGE */}
                {enquiry.message && (
                  <div className="bg-slate-50 rounded-2xl p-4 border text-sm text-slate-600 whitespace-pre-line">
                    <div className="flex items-center gap-2 mb-2 text-slate-400 font-bold text-xs uppercase">
                      <MessageSquare size={14} />
                      Enquiry Details
                    </div>
                    {enquiry.message.trim()}
                  </div>
                )}

              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-24 bg-slate-50 rounded-[3rem] border border-dashed">
            <Package size={40} className="mx-auto text-slate-300 mb-6" />
            <h3 className="text-2xl font-black text-slate-900">
              Empty Inbox
            </h3>
            <p className="text-slate-400 mt-2">
              You haven't made any service enquiries yet.
            </p>
            <button
              onClick={() => navigate('/')}
              className="mt-10 px-10 py-5 bg-indigo-600 text-white font-extrabold rounded-2xl hover:bg-indigo-700 transition"
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

