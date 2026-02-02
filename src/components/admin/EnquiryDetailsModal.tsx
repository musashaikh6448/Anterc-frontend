import React, { useEffect } from 'react';
import { X, Copy, MessageCircle, User, Phone, Mail, MapPin, Calendar, Wrench, FileText, UserCog } from 'lucide-react';
import { toast } from 'sonner';
import { getTechnicians, assignTechnician } from '../../api/adminApi';

interface EnquiryDetailsModalProps {
    isOpen: boolean;
    onClose: () => void;
    enquiry: any;
    onUpdate?: () => void;
}

const EnquiryDetailsModal: React.FC<EnquiryDetailsModalProps> = ({
    isOpen,
    onClose,
    enquiry,
    onUpdate
}) => {
    const [technicians, setTechnicians] = React.useState<any[]>([]);
    const [selectedTechnician, setSelectedTechnician] = React.useState('');
    const [assigning, setAssigning] = React.useState(false);

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
            fetchTechnicians();
            if (enquiry?.technician?._id) {
                setSelectedTechnician(enquiry.technician._id);
            } else if (enquiry?.technician) {
                setSelectedTechnician(enquiry.technician);
            } else {
                setSelectedTechnician('');
            }
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen, enquiry]);

    const fetchTechnicians = async () => {
        try {
            const { data } = await getTechnicians();
            setTechnicians(data);
        } catch (error) {
            console.error('Failed to load technicians');
        }
    };

    const handleAssign = async () => {
        if (!selectedTechnician) return;
        setAssigning(true);
        try {
            await assignTechnician(enquiry._id, selectedTechnician);
            toast.success('Technician assigned successfully');
            if (onUpdate) onUpdate();
            onClose();
        } catch (error) {
            toast.error('Failed to assign technician');
        } finally {
            setAssigning(false);
        }
    };

    if (!isOpen || !enquiry) return null;

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-IN', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const constructShareText = () => {
        let serviceDetails = '';
        if (enquiry.items && enquiry.items.length > 0) {
            serviceDetails = `*Services Requested:*\n`;
            enquiry.items.forEach((item: any) => {
                const qty = item.quantity || 1;
                const itemTotal = item.price * qty;
                serviceDetails += `- ${item.name} (${item.category})${qty > 1 ? ` x${qty}` : ''}: ₹${itemTotal}\n`;
            });
            const total = enquiry.items.reduce((acc: number, item: any) => acc + (item.price * (item.quantity || 1)), 0);
            serviceDetails += `\n*Total Estimated:* ₹${total}`;
        } else {
            serviceDetails = `*Service:* ${enquiry.serviceType}\n*Appliance:* ${enquiry.applianceType} ${enquiry.brand ? `(${enquiry.brand})` : ''}`;
        }

        return `*Service Enquiry Details*
-------------------------
*Customer:* ${enquiry.user?.name || 'N/A'}
*Mobile:* ${enquiry.user?.phone || 'N/A'}

${serviceDetails}

*Address:*
${enquiry.address}
${enquiry.landmark ? `Near ${enquiry.landmark}` : ''}
${enquiry.city}, ${enquiry.state} - ${enquiry.pincode}

*Message:*
${enquiry.message || 'No message provided'}

*Date:* ${new Date(enquiry.createdAt).toLocaleString('en-IN')}
-------------------------`;
    };

    const handleCopy = () => {
        const text = constructShareText();
        navigator.clipboard.writeText(text);
        toast.success('Enquiry details copied to clipboard');
    };

    const handleWhatsAppShare = () => {
        const text = constructShareText();
        const url = `https://wa.me/?text=${encodeURIComponent(text)}`;
        window.open(url, '_blank');
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="relative bg-white rounded-2xl sm:rounded-3xl w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
                {/* Header */}
                <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                    <h2 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight">
                        Enquiry Details
                    </h2>
                    <button
                        onClick={onClose}
                        className="p-2 rounded-xl hover:bg-slate-100 transition-colors text-slate-500 hover:text-slate-700"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Content - Scrollable */}
                <div className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-8">
                    {/* Customer Info Section */}
                    <div className="space-y-4">
                        <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-2">
                            Customer Information
                        </h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <div className="flex items-start gap-3">
                                <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600 flex-shrink-0">
                                    <User size={20} strokeWidth={2.5} />
                                </div>
                                <div>
                                    <p className="text-xs font-bold text-slate-400 mb-0.5">Name</p>
                                    <p className="text-sm font-bold text-slate-900">{enquiry.user?.name || 'N/A'}</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600 flex-shrink-0">
                                    <Phone size={20} strokeWidth={2.5} />
                                </div>
                                <div>
                                    <p className="text-xs font-bold text-slate-400 mb-0.5">Phone</p>
                                    <p className="text-sm font-bold text-slate-900">{enquiry.user?.phone || 'N/A'}</p>
                                </div>
                            </div>

                        </div>
                    </div>

                    {/* Service Info Section */}
                    <div className="space-y-4">
                        <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-2">
                            Service Request
                        </h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            {enquiry.items && enquiry.items.length > 0 ? (
                                <div className="sm:col-span-2 space-y-3 bg-slate-50 p-4 rounded-xl border border-slate-100">
                                    <div className="flex justify-between items-center pb-2 border-b border-slate-200">
                                        <span className="text-xs font-black text-slate-500 uppercase">Service</span>
                                        <span className="text-xs font-black text-slate-500 uppercase">Price</span>
                                    </div>
                                    {enquiry.items.map((item: any, idx: number) => (
                                        <div key={idx} className="flex justify-between items-start text-sm">
                                            <div>
                                                <p className="font-bold text-slate-800">{item.name}</p>
                                                <p className="text-xs text-slate-500">{item.category}</p>
                                                {item.quantity && item.quantity > 1 && (
                                                    <p className="text-xs text-indigo-600 font-bold mt-0.5">Qty: {item.quantity}</p>
                                                )}
                                            </div>
                                            <div className="text-right">
                                                <p className="font-bold text-slate-900">₹{item.price * (item.quantity || 1)}</p>
                                                {item.actualPrice && (
                                                    <p className="text-xs text-slate-400 line-through">₹{item.actualPrice * (item.quantity || 1)}</p>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                    <div className="pt-3 border-t border-slate-200 flex justify-between items-center mt-2">
                                        <span className="font-black text-slate-900">Total</span>
                                        <span className="font-black text-indigo-600 text-lg">
                                            ₹{enquiry.items.reduce((acc: number, item: any) => acc + (item.price * (item.quantity || 1)), 0)}
                                        </span>
                                    </div>
                                </div>
                            ) : (
                                <div className="flex items-start gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-violet-50 flex items-center justify-center text-violet-600 flex-shrink-0">
                                        <Wrench size={20} strokeWidth={2.5} />
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold text-slate-400 mb-0.5">Service Type</p>
                                        <p className="text-sm font-bold text-slate-900">{enquiry.serviceType}</p>
                                        <p className="text-xs text-slate-500 mt-1">{enquiry.applianceType} {enquiry.brand && `(${enquiry.brand})`}</p>
                                    </div>
                                </div>
                            )}
                            <div className="flex items-start gap-3">
                                <div className="w-10 h-10 rounded-xl bg-violet-50 flex items-center justify-center text-violet-600 flex-shrink-0">
                                    <Calendar size={20} strokeWidth={2.5} />
                                </div>
                                <div>
                                    <p className="text-xs font-bold text-slate-400 mb-0.5">Submitted On</p>
                                    <p className="text-sm font-bold text-slate-900">{formatDate(enquiry.createdAt)}</p>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-start gap-3 bg-slate-50 p-4 rounded-xl border border-slate-100">
                            <FileText size={20} className="text-slate-400 mt-0.5 flex-shrink-0" />
                            <div>
                                <p className="text-xs font-bold text-slate-400 mb-1">Message / Requirement</p>
                                <p className="text-sm text-slate-700 leading-relaxed">{enquiry.message || 'No specific message provided.'}</p>
                            </div>
                        </div>
                    </div>

                    {/* Technician Assignment Section */}
                    <div className="space-y-4">
                        <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-2">
                            Technician Assignment
                        </h3>
                        <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Assign Technician</label>
                            <div className="flex gap-2">
                                <select
                                    value={selectedTechnician}
                                    onChange={(e) => setSelectedTechnician(e.target.value)}
                                    className="flex-1 px-4 py-2 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 text-sm font-medium text-slate-700"
                                >
                                    <option value="">Select Technician</option>
                                    {technicians.map(tech => (
                                        <option key={tech._id} value={tech._id}>
                                            {tech.name} ({tech.availabilityStatus})
                                        </option>
                                    ))}
                                </select>
                                <button
                                    onClick={handleAssign}
                                    disabled={assigning || !selectedTechnician || selectedTechnician === enquiry?.technician?._id}
                                    className="px-4 py-2 bg-indigo-600 text-white rounded-lg font-bold text-sm hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                >
                                    {assigning ? '...' : 'Assign'}
                                </button>
                            </div>
                            {enquiry.technician && (
                                <div className="mt-3 flex items-center gap-2 text-xs font-medium text-emerald-600 bg-emerald-50 px-3 py-2 rounded-lg border border-emerald-100">
                                    <UserCog size={14} />
                                    Currently Assigned: {enquiry.technician.name}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Location Section */}
                    <div className="space-y-4">
                        <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-2">
                            Service Location
                        </h3>
                        <div className="flex items-start gap-3">
                            <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600 flex-shrink-0">
                                <MapPin size={20} strokeWidth={2.5} />
                            </div>
                            <div className="space-y-1">
                                <p className="text-sm font-bold text-slate-900">{enquiry.address}</p>
                                {enquiry.landmark && (
                                    <p className="text-xs text-indigo-600 font-medium bg-indigo-50 px-2 py-0.5 rounded inline-block">
                                        Near {enquiry.landmark}
                                    </p>
                                )}
                                <p className="text-sm text-slate-600">
                                    {enquiry.city}, {enquiry.state} - <span className="font-mono font-medium">{enquiry.pincode}</span>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer Actions */}
                <div className="p-6 border-t border-slate-100 bg-slate-50/50 flex flex-col sm:flex-row gap-3">
                    <button
                        onClick={handleCopy}
                        className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-white border border-slate-200 hover:border-indigo-200 hover:bg-slate-50 text-slate-700 hover:text-indigo-600 rounded-xl font-bold transition-all shadow-sm"
                    >
                        <Copy size={18} strokeWidth={2.5} />
                        Copy Details
                    </button>
                    <button
                        onClick={handleWhatsAppShare}
                        className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold transition-all shadow-lg shadow-emerald-600/20 active:scale-[0.98]"
                    >
                        <MessageCircle size={18} strokeWidth={2.5} />
                        Share via WhatsApp
                    </button>
                </div>
            </div>
        </div>
    );
};

export default EnquiryDetailsModal;
