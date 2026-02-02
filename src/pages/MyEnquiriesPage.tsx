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
  Phone,
  Star
} from 'lucide-react';
import { useAuth } from '../AuthContext';
import { getMyEnquiries } from '@/api/customerApi';
import { toast } from 'sonner';
import ReviewModal from '@/components/ReviewModal';

const MyEnquiriesPage: React.FC = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();

  const [enquiries, setEnquiries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [reviewEnquiry, setReviewEnquiry] = useState<any>(null);

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

  useEffect(() => {
    window.scrollTo(0, 0);

    if (!authLoading && !user) {
      navigate('/auth');
      return;
    }

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



  const handleRateClick = (enquiry: any) => {
    setReviewEnquiry(enquiry);
    setShowReviewModal(true);
  };

  const handleReviewSuccess = () => {
    setShowReviewModal(false);
    fetchEnquiries(); // Reload to get updated isReviewed status
  };

  const handleDownloadInvoice = async (url: string, enquiryId: string) => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = `Invoice_${enquiryId}.pdf`; // Try to force a name
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(downloadUrl);
    } catch (error) {
      toast.error('Failed to download invoice');
      console.error(error);
      // Fallback to opening in new tab
      window.open(url, '_blank');
    }
  };

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
  /* ... (keeping existing getStatusIcon) ... */
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
      {/* ... (ReviewModal and Header) ... */}
      <ReviewModal
        isOpen={showReviewModal}
        onClose={() => setShowReviewModal(false)}
        enquiry={reviewEnquiry}
        onSuccess={handleReviewSuccess}
      />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12">
        {/* ... (Header code unchanged) ... */}
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
                {/* ... (Card Header & Body unchanged) ... */}
                {/* CARD HEADER */}
                <div className="bg-slate-50/50 px-6 py-4 border-b border-slate-100 flex flex-wrap justify-between items-center gap-4">
                  <div className="flex items-center gap-3">
                    <span className="bg-white p-2 rounded-lg border border-slate-200 shadow-sm text-indigo-600">
                      <Package size={20} />
                    </span>
                    <div>
                      <h3 className="font-bold text-slate-900 text-lg leading-tight">
                        {enquiry.items && enquiry.items.length > 0 ? 'Multiple Services Booking' : enquiry.serviceType}
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
                    {/* ... (Existing Body Logic) ... */}
                    {/* DETAILS COLUMN */}
                    <div className="space-y-4">
                      <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Service Details</h4>

                      {enquiry.items && enquiry.items.length > 0 ? (
                        <div className="space-y-4">
                          {enquiry.items.map((item: any, idx: number) => (
                            <div key={idx} className="flex items-start gap-3 p-3 bg-slate-50/80 rounded-xl border border-slate-100">
                              <div className="w-12 h-12 bg-white rounded-lg overflow-hidden shrink-0 border border-slate-200">
                                {item.imageUrl ? (
                                  <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
                                ) : (
                                  <div className="w-full h-full flex items-center justify-center bg-slate-100">
                                    <Package size={16} className="text-slate-400" />
                                  </div>
                                )}
                              </div>
                              <div className="flex-1">
                                <p className="text-sm font-bold text-slate-900 line-clamp-1">{item.name}</p>
                                <p className="text-xs text-slate-500 mb-1">{item.category}</p>
                                <div className="flex items-center gap-2">
                                  <span className="text-xs font-black text-slate-900">₹{item.price}</span>
                                  {item.actualPrice > item.price && (
                                    <span className="text-[10px] text-slate-400 line-through">₹{item.actualPrice}</span>
                                  )}
                                </div>
                              </div>
                            </div>
                          ))}

                          {/* Message for multi-service */}
                          {enquiry.message && (
                            <div className="flex items-start gap-3 pt-2">
                              <MessageSquare size={16} className="text-slate-400 mt-0.5" />
                              <div className="flex-1">
                                <p className="text-xs font-bold text-slate-600 mb-1">Additional Note</p>
                                <p className="text-slate-600 text-xs leading-relaxed italic">
                                  "{enquiry.message}"
                                </p>
                              </div>
                            </div>
                          )}
                        </div>
                      ) : (
                        // SINGLE SERVICE VIEW
                        <>
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
                        </>
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
                <div className="col-span-1 md:col-span-2 px-6 py-4 bg-slate-50 border-t border-slate-100 flex flex-wrap sm:flex-nowrap justify-end gap-3 items-center">

                  {enquiry.status === 'completed' && !enquiry.isReviewed && (
                    <button
                      onClick={() => handleRateClick(enquiry)}
                      className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-4 py-2 bg-yellow-400 text-slate-900 text-sm font-bold rounded-lg hover:bg-yellow-500 shadow-sm transition-all"
                    >
                      <Star size={16} className="fill-current" />
                      Rate Service
                    </button>
                  )}

                  {enquiry.invoiceUrl && (
                    <button
                      onClick={() => handleDownloadInvoice(enquiry.invoiceUrl, enquiry._id)}
                      className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-4 py-2 bg-white text-slate-700 text-sm font-medium rounded-lg border border-slate-200 hover:bg-slate-50 hover:text-indigo-600 hover:border-indigo-200 transition-all"
                    >
                      <Download size={16} />
                      Invoice
                    </button>
                  )}

                  <a
                    href="tel:+917385650510"
                    className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 shadow-sm shadow-indigo-200 transition-all"
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

