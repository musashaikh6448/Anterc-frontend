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
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'technician assigned':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'cancelled':
        return 'bg-rose-50 text-rose-700 border-rose-200';
      case 'pending':
      default:
        return 'bg-amber-50 text-amber-700 border-amber-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'completed':
        return <CheckCircle2 size={14} className="stroke-current" />;
      case 'technician assigned':
        return <UserCog size={14} className="stroke-current" />;
      case 'cancelled':
        return <AlertCircle size={14} className="stroke-current" />;
      case 'pending':
      default:
        return <Clock size={14} className="stroke-current" />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-32">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12">

        {/* HEADER SECTION */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
          <div>
            <button
              onClick={() => navigate('/')}
              className="inline-flex items-center gap-2 text-slate-500 hover:text-indigo-600 transition-colors mb-4 text-sm font-semibold"
            >
              <ChevronLeft size={18} />
              Back to Services
            </button>
            <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight">
              My Enquiries
            </h1>
            <p className="text-slate-500 mt-2">
              Manage and track your service requests
            </p>
          </div>

          <div className="bg-white px-4 py-2 rounded-xl border border-slate-200 shadow-sm">
            <span className="text-slate-600 text-sm font-medium">Total Requests: </span>
            <span className="text-indigo-600 font-bold">{enquiries.length}</span>
          </div>
        </div>

        {/* ENQUIRIES LIST */}
        {enquiries.length > 0 ? (
          <div className="grid gap-6">
            {enquiries.map((enquiry) => (
              <div
                key={enquiry._id}
                className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow overflow-hidden"
              >
                {/* CARD HEADER */}
                <div className="bg-slate-50/50 px-6 py-4 border-b border-slate-100 flex flex-wrap justify-between items-center gap-4">
                  <div className="flex items-center gap-3">
                    <span className="bg-white p-2 rounded-lg border border-slate-200 shadow-sm text-indigo-600">
                      <Package size={20} />
                    </span>
                    <div>
                      <h3 className="font-bold text-slate-900 text-lg leading-tight">
                        {enquiry.serviceType}
                      </h3>
                      <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5">
                        <span className="font-mono">#{enquiry._id?.slice(-6).toUpperCase()}</span>
                        <span>•</span>
                        <span>{new Date(enquiry.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}</span>
                      </div>
                    </div>
                  </div>

                  <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold border ${getStatusStyle(enquiry.status)}`}>
                    {getStatusIcon(enquiry.status)}
                    <span className="capitalize">{enquiry.status}</span>
                  </div>
                </div>

                {/* CARD BODY */}
                <div className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

                    {/* DETAILS COLUMN */}
                    <div className="space-y-4">
                      <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Service Details</h4>

                      <div className="flex items-start gap-3">
                        <Smartphone size={18} className="text-slate-400 mt-0.5" />
                        <div>
                          <p className="text-sm font-medium text-slate-700">Appliance</p>
                          <p className="text-slate-900 font-semibold">
                            {enquiry.applianceType}
                            {enquiry.brand && <span className="text-slate-500 font-normal"> • {enquiry.brand}</span>}
                          </p>
                        </div>
                      </div>

                      {enquiry.message && (
                        <div className="flex items-start gap-3">
                          <MessageSquare size={18} className="text-slate-400 mt-0.5" />
                          <div>
                            <p className="text-sm font-medium text-slate-700">Description</p>
                            <p className="text-slate-600 text-sm leading-relaxed mt-1 bg-slate-50 p-3 rounded-lg border border-slate-100">
                              {enquiry.message}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* LOCATION COLUMN */}
                    <div className="space-y-4">
                      <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Location</h4>

                      {(enquiry.city || enquiry.address) ? (
                        <div className="flex items-start gap-3">
                          <MapPin size={18} className="text-slate-400 mt-0.5" />
                          <div>
                            <p className="text-sm font-medium text-slate-700">Service Address</p>
                            <div className="text-slate-600 text-sm mt-1">
                              {enquiry.address && <p>{enquiry.address}</p>}
                              <p>
                                {enquiry.city}{enquiry.state ? `, ${enquiry.state}` : ''}
                                {enquiry.pincode && ` - ${enquiry.pincode}`}
                              </p>
                              {enquiry.landmark && (
                                <p className="text-indigo-600 text-xs font-medium mt-1">
                                  Near {enquiry.landmark}
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="text-slate-400 text-sm italic">No address details provided</div>
                      )}
                    </div>

                  </div>
                </div>

                {/* CARD FOOTER Actions */}
                <div className="col-span-1 md:col-span-2 px-6 py-4 bg-slate-50 border-t border-slate-100 flex justify-end gap-3">
                  {enquiry.invoiceUrl && (
                    <a
                      href={enquiry.invoiceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-4 py-2 bg-white text-slate-700 text-sm font-medium rounded-lg border border-slate-200 hover:bg-slate-50 hover:text-indigo-600 hover:border-indigo-200 transition-all"
                    >
                      <Download size={16} />
                      Invoice
                    </a>
                  )}

                  <a
                    href="tel:+917385650510"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 shadow-sm shadow-indigo-200 transition-all"
                  >
                    <Phone size={16} />
                    Support
                  </a>
                </div>

              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-slate-300">
            <div className="bg-slate-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Package size={32} className="text-slate-400" />
            </div>
            <h3 className="text-xl font-bold text-slate-900">
              No Enquiries Found
            </h3>
            <p className="text-slate-500 mt-2 max-w-sm mx-auto">
              You haven't submitted any service requests yet. Book a service to get started!
            </p>
            <button
              onClick={() => navigate('/')}
              className="mt-6 px-6 py-3 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700 transition shadow-lg shadow-indigo-100"
            >
              Book a Service
            </button>
          </div>
        )}

      </div>
    </div>
  );
};

export default MyEnquiriesPage;

