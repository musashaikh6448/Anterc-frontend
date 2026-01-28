import React, { useEffect, useState } from 'react';
import { Search, Filter, Trash2, Eye, MessageSquare } from 'lucide-react';
import { getAllContactEnquiries, deleteContactEnquiry } from '@/api/contactApi';
import { toast } from 'sonner';
import Pagination from '@/components/admin/Pagination';
import Modal from '@/components/admin/Modal';

const ContactEnquiriesPage: React.FC = () => {
    const [enquiries, setEnquiries] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showViewModal, setShowViewModal] = useState(false);
    const [selectedEnquiry, setSelectedEnquiry] = useState<any>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    useEffect(() => {
        fetchEnquiries();
    }, []);

    const fetchEnquiries = async () => {
        setLoading(true);
        try {
            const data = await getAllContactEnquiries();
            setEnquiries(data);
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Failed to load contact enquiries');
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteClick = (enquiry: any) => {
        setSelectedEnquiry(enquiry);
        setShowDeleteModal(true);
    };

    const handleViewClick = (enquiry: any) => {
        setSelectedEnquiry(enquiry);
        setShowViewModal(true);
    };

    const handleDeleteConfirm = async () => {
        if (!selectedEnquiry) return;

        try {
            await deleteContactEnquiry(selectedEnquiry._id);
            toast.success('Enquiry deleted successfully');
            setShowDeleteModal(false);
            setSelectedEnquiry(null);
            fetchEnquiries();
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Failed to delete enquiry');
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
            enquiry.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            enquiry.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            enquiry.phone?.includes(searchTerm) ||
            enquiry.subject?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            enquiry.message?.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesSearch ;
    });

    const totalPages = Math.ceil(filteredEnquiries.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedEnquiries = filteredEnquiries.slice(startIndex, startIndex + itemsPerPage);

    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm]);

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
                    <span className="text-indigo-600 font-black text-[10px] uppercase tracking-widest">Contact Enquiries</span>
                </div>
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tighter leading-[1.05]">
                    Contact <span className="text-slate-400">Us Messages</span>
                </h1>
                <p className="text-slate-500 max-w-2xl text-sm sm:text-base font-medium leading-relaxed">
                    Manage and track messages from the Contact Us page.
                </p>
            </div>

            {/* Delete Confirmation Modal */}
            <Modal
                isOpen={showDeleteModal}
                onClose={() => {
                    setShowDeleteModal(false);
                    setSelectedEnquiry(null);
                }}
                title="Delete Enquiry"
                message={`Are you sure you want to delete this enquiry? This action cannot be undone.`}
                type="confirm"
                onConfirm={handleDeleteConfirm}
                confirmText="Delete"
                cancelText="Cancel"
            />

            {/* View Details Modal */}
            {showViewModal && selectedEnquiry && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl animate-in fade-in zoom-in-95 duration-200">
                        <div className="p-6 border-b border-slate-100 flex justify-between items-center sticky top-0 bg-white/80 backdrop-blur-md">
                            <h3 className="text-xl font-black text-slate-900">Enquiry Details</h3>
                            <button
                                onClick={() => setShowViewModal(false)}
                                className="p-2 hover:bg-slate-100 rounded-full transition-colors"
                                aria-label="Close modal"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                            </button>
                        </div>
                        <div className="p-6 space-y-6">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                <div>
                                    <label className="text-xs font-black text-slate-500 uppercase tracking-widest block mb-1">Name</label>
                                    <p className="text-slate-900 font-bold">{selectedEnquiry.name}</p>
                                </div>
                                <div>
                                    <label className="text-xs font-black text-slate-500 uppercase tracking-widest block mb-1">Phone</label>
                                    <p className="text-slate-900 font-bold">{selectedEnquiry.phone}</p>
                                </div>
                                <div>
                                    <label className="text-xs font-black text-slate-500 uppercase tracking-widest block mb-1">Email</label>
                                    <p className="text-slate-900 font-bold">{selectedEnquiry.email}</p>
                                </div>
                                <div>
                                    <label className="text-xs font-black text-slate-500 uppercase tracking-widest block mb-1">Date</label>
                                    <p className="text-slate-900 font-medium">{formatDate(selectedEnquiry.createdAt)}</p>
                                </div>
                            </div>
                            <div>
                                <label className="text-xs font-black text-slate-500 uppercase tracking-widest block mb-1">Subject</label>
                                <p className="text-slate-900 font-bold">{selectedEnquiry.subject}</p>
                            </div>
                            <div>
                                <label className="text-xs font-black text-slate-500 uppercase tracking-widest block mb-1">Message</label>
                                <div className="bg-slate-50 p-4 rounded-xl text-slate-700 leading-relaxed whitespace-pre-wrap">
                                    {selectedEnquiry.message}
                                </div>
                            </div>
                           
                        </div>
                        <div className="p-6 border-t border-slate-100 bg-slate-50 flex justify-end">
                            <button
                                onClick={() => setShowViewModal(false)}
                                className="px-6 py-2.5 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition-colors"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Filters */}
            <div className="bg-white border border-slate-100 rounded-xl sm:rounded-2xl p-4 hover:shadow-lg transition-all duration-300">
                <div className="flex flex-col sm:flex-row gap-4">
                    <div className="flex-1 relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                        <input
                            type="text"
                            placeholder="Search by name, email, phone, or message..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all font-medium"
                        />
                    </div>
                   
                </div>
            </div>

            {/* Desktop Table View */}
            <div className="hidden lg:block bg-white border border-slate-100 rounded-xl sm:rounded-2xl overflow-hidden hover:shadow-lg transition-all duration-300">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-slate-50">
                            <tr>
                                <th className="px-4 py-3 text-left text-xs font-black text-slate-500 uppercase tracking-widest">Name</th>
                                <th className="px-4 py-3 text-left text-xs font-black text-slate-500 uppercase tracking-widest">Email</th>
                                <th className="px-4 py-3 text-left text-xs font-black text-slate-500 uppercase tracking-widest">Phone</th>
                                <th className="px-4 py-3 text-left text-xs font-black text-slate-500 uppercase tracking-widest">Subject</th>
                                <th className="px-4 py-3 text-left text-xs font-black text-slate-500 uppercase tracking-widest">Date</th>
                                <th className="px-4 py-3 text-left text-xs font-black text-slate-500 uppercase tracking-widest">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {paginatedEnquiries.map((enquiry) => (
                                <tr key={enquiry._id} className="hover:bg-slate-50 transition-colors">
                                    <td className="px-4 py-3 text-sm font-bold text-slate-900">{enquiry.name}</td>
                                    <td className="px-4 py-3 text-sm text-slate-600">{enquiry.email}</td>
                                    <td className="px-4 py-3 text-sm text-slate-600">{enquiry.phone}</td>
                                    <td className="px-4 py-3 text-sm text-slate-900 max-w-xs truncate">{enquiry.subject}</td>
                                    
                                    <td className="px-4 py-3 text-sm text-slate-500">{formatDate(enquiry.createdAt)}</td>
                                    <td className="px-4 py-3">
                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={() => handleViewClick(enquiry)}
                                                className="text-indigo-600 hover:text-indigo-700 p-2 rounded-lg hover:bg-indigo-50 transition-all"
                                                title="View Details"
                                            >
                                                <Eye size={16} />
                                            </button>
                                            <button
                                                onClick={() => handleDeleteClick(enquiry)}
                                                className="text-rose-600 hover:text-rose-700 p-2 rounded-lg hover:bg-rose-50 transition-all"
                                                title="Delete"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
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
                                <div className="text-sm font-bold text-slate-900">{enquiry.name}</div>
                                <div className="text-xs text-slate-500">{formatDate(enquiry.createdAt)}</div>
                            </div>
                            
                        </div>

                        <div className="space-y-2 mb-3">
                            <div className="text-sm text-slate-900 font-medium truncate">{enquiry.subject}</div>
                            <div className="text-xs text-slate-500 truncate">{enquiry.email}</div>
                        </div>

                        <div className="flex gap-3">
                            <button
                                onClick={() => handleViewClick(enquiry)}
                                className="flex-1 py-2 bg-indigo-50 text-indigo-600 rounded-xl font-bold text-sm hover:bg-indigo-100 transition-all flex items-center justify-center gap-2"
                            >
                                <Eye size={14} /> View
                            </button>
                            <button
                                onClick={() => handleDeleteClick(enquiry)}
                                className="flex-1 py-2 bg-rose-50 text-rose-600 rounded-xl font-bold text-sm hover:bg-rose-100 transition-all flex items-center justify-center gap-2"
                            >
                                <Trash2 size={14} /> Delete
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
                    <p className="text-slate-500 font-medium">No contact enquiries found</p>
                </div>
            )}
        </div>
    );
};

export default ContactEnquiriesPage;
