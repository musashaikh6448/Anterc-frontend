import React, { useEffect, useState } from 'react';
import { Search, Filter, Trash2, Clock, CheckCircle2, XCircle, AlertCircle, MessageSquare, Eye, Upload, FileText, Check } from 'lucide-react';
import { getAllEnquiries, updateEnquiryStatus, deleteEnquiry } from '@/api/adminApi';
import { toast } from 'sonner';
import Pagination from '@/components/admin/Pagination';
import Modal from '@/components/admin/Modal';
import EnquiryDetailsModal from '@/components/admin/EnquiryDetailsModal';
import InvoiceUploadModal from '@/components/admin/InvoiceUploadModal';

const EnquiriesPage: React.FC = () => {
  const [enquiries, setEnquiries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletingEnquiry, setDeletingEnquiry] = useState<any>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [selectedEnquiry, setSelectedEnquiry] = useState<any>(null);
  const [uploadEnquiryId, setUploadEnquiryId] = useState<string>('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    fetchEnquiries();
  }, []);

  const fetchEnquiries = async () => {
    setLoading(true);
    try {
      const { data } = await getAllEnquiries();
      setEnquiries(data);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to load enquiries');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (id: string, status: string) => {
    try {
      await updateEnquiryStatus(id, status);
      toast.success('Enquiry status updated successfully');
      fetchEnquiries();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to update status');
    }
  };

  const handleDeleteClick = (enquiry: any) => {
    setDeletingEnquiry(enquiry);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    if (!deletingEnquiry) return;

    try {
      await deleteEnquiry(deletingEnquiry._id);
      toast.success('Enquiry deleted successfully');
      setShowDeleteModal(false);
      setDeletingEnquiry(null);
      fetchEnquiries();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to delete enquiry');
    }
  };

  const handleViewClick = (enquiry: any) => {
    setSelectedEnquiry(enquiry);
    setShowDetailsModal(true);
  };

  const handleUploadClick = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setUploadEnquiryId(id);
    setShowUploadModal(true);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case 'in-progress':
        return 'bg-indigo-100 text-indigo-700 border-indigo-200';
      case 'cancelled':
        return 'bg-rose-100 text-rose-700 border-rose-200';
      default:
        return 'bg-amber-100 text-amber-700 border-amber-200';
    }
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const filteredEnquiries = enquiries.filter((enquiry) => {
    const matchesSearch =
      enquiry.serviceType?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      enquiry.user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      enquiry.user?.phone?.includes(searchTerm) ||
      enquiry.applianceType?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      enquiry.message?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || enquiry.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalPages = Math.ceil(filteredEnquiries.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedEnquiries = filteredEnquiries.slice(startIndex, startIndex + itemsPerPage);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Header */}
      <div className="space-y-3">
        <div className="inline-flex items-center gap-2 bg-indigo-50 px-4 py-1.5 rounded-full border border-indigo-100">
          <MessageSquare size={14} className="text-indigo-600" />
          <span className="text-indigo-600 font-black text-[10px] uppercase tracking-widest">Enquiries Management</span>
        </div>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tighter leading-[1.05]">
          Customer <span className="text-slate-400">Enquiries</span>
        </h1>
        <p className="text-slate-500 max-w-2xl text-sm sm:text-base font-medium leading-relaxed">
          Manage and track all customer service enquiries with real-time status updates.
        </p>
      </div>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false);
          setDeletingEnquiry(null);
        }}
        title="Delete Enquiry"
        message={`Are you sure you want to delete this enquiry? This action cannot be undone.`}
        type="confirm"
        onConfirm={handleDeleteConfirm}
        confirmText="Delete"
        cancelText="Cancel"
      />

      {/* Enquiry Details Modal */}
      <EnquiryDetailsModal
        isOpen={showDetailsModal}
        onClose={() => {
          setShowDetailsModal(false);
          setSelectedEnquiry(null);
        }}
        enquiry={selectedEnquiry}
      />

      {/* Invoice Upload Modal */}
      <InvoiceUploadModal
        isOpen={showUploadModal}
        onClose={() => {
          setShowUploadModal(false);
          setUploadEnquiryId('');
        }}
        enquiryId={uploadEnquiryId}
        onSuccess={fetchEnquiries}
      />

      {/* Filters */}
      <div className="bg-white border border-slate-100 rounded-xl sm:rounded-2xl p-4 hover:shadow-lg transition-all duration-300">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
            <input
              type="text"
              placeholder="Search by service, customer, phone, appliance, or message..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all font-medium"
            />
          </div>
          <div className="relative">
            <Filter className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="pl-12 pr-8 py-3 bg-slate-50 border border-slate-100 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none appearance-none cursor-pointer font-medium"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="in-progress">In Progress</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>
      </div>

      {/* Stats Card - Reduced Size */}
      <div className="bg-slate-900 rounded-2xl sm:rounded-[2.5rem] p-5 sm:p-6 text-white relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-48 h-48 sm:w-64 sm:h-64 bg-indigo-600/10 rounded-full blur-[80px] transition-all duration-1000 group-hover:bg-indigo-600/20"></div>
        <div className="relative z-10 flex items-center justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest opacity-90 mb-2">Total Enquiries</p>
            <p className="text-3xl sm:text-4xl font-black">{filteredEnquiries.length}</p>
          </div>
          <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center">
            <MessageSquare size={24} strokeWidth={2.5} />
          </div>
        </div>
      </div>

      {/* Desktop Table View */}
      <div className="hidden lg:block bg-white border border-slate-100 rounded-xl sm:rounded-2xl overflow-hidden hover:shadow-lg transition-all duration-300">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-black text-slate-500 uppercase tracking-widest">
                  ID
                </th>
                <th className="px-4 py-3 text-left text-xs font-black text-slate-500 uppercase tracking-widest">
                  Customer
                </th>
                <th className="px-4 py-3 text-left text-xs font-black text-slate-500 uppercase tracking-widest">
                  Service
                </th>
                <th className="px-4 py-3 text-left text-xs font-black text-slate-500 uppercase tracking-widest">
                  Appliance
                </th>
                <th className="px-4 py-3 text-left text-xs font-black text-slate-500 uppercase tracking-widest">
                  Brand
                </th>
                <th className="px-4 py-3 text-left text-xs font-black text-slate-500 uppercase tracking-widest">
                  Location
                </th>
                <th className="px-4 py-3 text-left text-xs font-black text-slate-500 uppercase tracking-widest">
                  Message
                </th>
                <th className="px-4 py-3 text-left text-xs font-black text-slate-500 uppercase tracking-widest">
                  Status
                </th>
                <th className="px-4 py-3 text-left text-xs font-black text-slate-500 uppercase tracking-widest">
                  Date
                </th>
                <th className="px-4 py-3 text-left text-xs font-black text-slate-500 uppercase tracking-widest">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {paginatedEnquiries.map((enquiry) => (
                <tr key={enquiry._id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-4 py-3">
                    <span className="text-sm font-bold text-slate-900 font-mono">
                      {enquiry._id.substr(-6)}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div>
                      <div className="text-sm font-bold text-slate-900">{enquiry.user?.name || 'N/A'}</div>
                      <div className="text-xs text-slate-500">{enquiry.user?.phone || 'N/A'}</div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm font-bold text-slate-900">{enquiry.serviceType}</td>
                  <td className="px-4 py-3 text-sm text-slate-600">{enquiry.applianceType}</td>
                  <td className="px-4 py-3 text-sm text-slate-600">{enquiry.brand || '-'}</td>
                  <td className="px-4 py-3">
                    <div className="text-sm font-bold text-slate-900">{enquiry.city}</div>
                    <div className="text-xs text-slate-500">{enquiry.pincode}</div>
                    <div className="text-[10px] text-slate-400 truncate max-w-[150px]" title={enquiry.address}>{enquiry.address}</div>
                    {enquiry.landmark && <div className="text-[10px] text-indigo-500 font-medium truncate max-w-[150px]">Near {enquiry.landmark}</div>}
                  </td>
                  <td className="px-4 py-3 text-sm text-slate-600 max-w-xs truncate" title={enquiry.message}>
                    {enquiry.message}
                  </td>
                  <td className="px-4 py-3">
                    <select
                      value={enquiry.status}
                      onChange={(e) => handleStatusUpdate(enquiry._id, e.target.value)}
                      className={`px-3 py-1.5 rounded-lg border text-xs font-bold uppercase tracking-widest cursor-pointer transition-all ${getStatusColor(
                        enquiry.status
                      )}`}
                    >
                      <option value="pending">Pending</option>
                      <option value="in-progress">In Progress</option>
                      <option value="completed">Completed</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </td>
                  <td className="px-4 py-3 text-sm text-slate-500">{formatDate(enquiry.createdAt)}</td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => handleViewClick(enquiry)}
                      className="text-indigo-600 hover:text-indigo-700 p-2 rounded-lg hover:bg-indigo-50 transition-all mr-2"
                      title="View Details"
                    >
                      <Eye size={16} />
                    </button>
                    {enquiry.status === 'completed' && (
                      <div className="flex items-center gap-1 inline-block">
                        {enquiry.invoiceUrl ? (
                          <>
                            <a
                              href={enquiry.invoiceUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-emerald-600 hover:text-emerald-700 p-2 rounded-lg hover:bg-emerald-50 transition-all mr-1"
                              title="View Uploaded Invoice"
                            >
                              <FileText size={16} />
                            </a>
                            <button
                              onClick={(e) => handleUploadClick(enquiry._id, e)}
                              className="text-slate-400 hover:text-indigo-600 p-2 rounded-lg hover:bg-slate-100 transition-all mr-2"
                              title="Re-upload Invoice"
                            >
                              <Upload size={16} />
                            </button>
                          </>
                        ) : (
                          <button
                            onClick={(e) => handleUploadClick(enquiry._id, e)}
                            className="text-slate-900 hover:text-indigo-600 p-2 rounded-lg hover:bg-slate-100 transition-all mr-2"
                            title="Upload Invoice"
                          >
                            <Upload size={16} />
                          </button>
                        )}
                      </div>
                    )}
                    <button
                      onClick={() => handleDeleteClick(enquiry)}
                      className="text-rose-600 hover:text-rose-700 p-2 rounded-lg hover:bg-rose-50 transition-all"
                      title="Delete Enquiry"
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile Card View */}
      <div className="lg:hidden space-y-3">
        {paginatedEnquiries.map((enquiry) => (
          <div key={enquiry._id} className="bg-white border border-slate-100 rounded-xl sm:rounded-2xl p-4 hover:shadow-lg transition-all duration-300">
            <div className="flex items-start justify-between mb-3">
              <div>
                <div className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">ID</div>
                <div className="text-sm font-bold text-slate-900 font-mono">{enquiry._id.substr(-6)}</div>
              </div>
              <select
                value={enquiry.status}
                onChange={(e) => handleStatusUpdate(enquiry._id, e.target.value)}
                className={`px-3 py-1.5 rounded-lg border text-xs font-bold uppercase tracking-widest ${getStatusColor(
                  enquiry.status
                )}`}
              >
                <option value="pending">Pending</option>
                <option value="in-progress">In Progress</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>

            <div className="space-y-2 mb-3">
              <div>
                <div className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">Customer</div>
                <div className="text-sm font-bold text-slate-900">{enquiry.user?.name || 'N/A'}</div>
                <div className="text-xs text-slate-500">{enquiry.user?.phone || 'N/A'}</div>
              </div>
              <div>
                <div className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">Service</div>
                <div className="text-sm font-bold text-slate-900">{enquiry.serviceType}</div>
              </div>
              <div>
                <div className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">Appliance</div>
                <div className="text-sm text-slate-600">{enquiry.applianceType} {enquiry.brand && <span className="text-slate-400">({enquiry.brand})</span>}</div>
              </div>
              <div>
                <div className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">Location</div>
                <div className="text-sm font-bold text-slate-900">{enquiry.city}, {enquiry.state} - {enquiry.pincode}</div>
                <div className="text-xs text-slate-500 mt-1">{enquiry.address}</div>
                {enquiry.landmark && <div className="text-xs text-indigo-500 font-medium mt-0.5">Near {enquiry.landmark}</div>}
              </div>
              <div>
                <div className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">Message</div>
                <div className="text-sm text-slate-600">{enquiry.message}</div>
              </div>
              <div>
                <div className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">Date</div>
                <div className="text-sm text-slate-500">{formatDate(enquiry.createdAt)}</div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => handleViewClick(enquiry)}
                className="py-2.5 bg-indigo-50 text-indigo-600 rounded-xl font-bold text-sm hover:bg-indigo-100 transition-all flex items-center justify-center gap-2"
              >
                <Eye size={14} />
                View
              </button>
              {enquiry.status === 'completed' && (
                <>
                  {enquiry.invoiceUrl ? (
                    <div className="flex gap-2 col-span-2 sm:col-span-1">
                      <a
                        href={enquiry.invoiceUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 py-2.5 bg-emerald-50 text-emerald-600 rounded-xl font-bold text-sm hover:bg-emerald-100 transition-all flex items-center justify-center gap-2"
                      >
                        <FileText size={14} />
                        View Invoice
                      </a>
                      <button
                        onClick={(e) => handleUploadClick(enquiry._id, e)}
                        className="py-2.5 px-3 bg-slate-100 text-slate-500 rounded-xl font-bold text-sm hover:bg-slate-200 transition-all flex items-center justify-center"
                        title="Re-upload"
                      >
                        <Upload size={14} />
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={(e) => handleUploadClick(enquiry._id, e)}
                      className="py-2.5 bg-slate-100 text-slate-800 rounded-xl font-bold text-sm hover:bg-slate-200 transition-all flex items-center justify-center gap-2"
                    >
                      <Upload size={14} />
                      Invoice
                    </button>
                  )}
                </>
              )}
              <button
                onClick={() => handleDeleteClick(enquiry)}
                className="py-2.5 bg-rose-50 text-rose-600 rounded-xl font-bold text-sm hover:bg-rose-100 transition-all flex items-center justify-center gap-2"
              >
                <Trash2 size={14} />
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      {filteredEnquiries.length > 0 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          itemsPerPage={itemsPerPage}
          totalItems={filteredEnquiries.length}
        />
      )}

      {filteredEnquiries.length === 0 && (
        <div className="text-center py-12 bg-white border border-slate-100 rounded-xl">
          <p className="text-slate-500 font-medium">No enquiries found</p>
        </div>
      )}
    </div>
  );
};

export default EnquiriesPage;
