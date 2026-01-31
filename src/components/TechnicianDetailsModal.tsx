import React from 'react';
import { X, Phone, BadgeCheck, Users, Wrench } from 'lucide-react';
import { toast } from 'sonner';

interface TechnicianDetailsModalProps {
    isOpen: boolean;
    onClose: () => void;
    technician: {
        _id: string;
        name: string;
        phone: string;
        specialization?: string;
        availabilityStatus?: string;
    } | null;
}

const TechnicianDetailsModal: React.FC<TechnicianDetailsModalProps> = ({
    isOpen,
    onClose,
    technician
}) => {
    if (!isOpen || !technician) return null;

    const handleCall = () => {
        window.location.href = `tel:${technician.phone}`;
        toast.success(`Calling ${technician.name}...`);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="relative bg-white w-full max-w-sm rounded-[2rem] overflow-hidden shadow-2xl transform transition-all scale-100 border border-slate-200">

                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 p-2 bg-slate-100 hover:bg-slate-200 text-slate-500 rounded-full transition-colors z-10"
                >
                    <X size={20} />
                </button>

                <div className="relative pt-12 px-8 pb-10 flex flex-col items-center text-center">
                    {/* Avatar */}
                    <div className="w-24 h-24 rounded-[2rem] bg-white p-1.5 shadow-xl mb-4">
                        <div className="w-full h-full rounded-[1.7rem] bg-indigo-50 flex items-center justify-center text-indigo-600">
                            <Users size={48} strokeWidth={1.5} />
                        </div>
                    </div>

                    {/* Name & Badge */}
                    <div className="flex items-center gap-2 mb-1">
                        <h2 className="text-2xl font-black text-slate-900 tracking-tight">
                            {technician.name}
                        </h2>
                        <BadgeCheck size={20} className="text-emerald-500 fill-emerald-50" />
                    </div>

                    {/* Role/Specialization */}
                    <p className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-6 flex items-center gap-1.5">
                        <Wrench size={14} className="mb-0.5" />
                        {technician.specialization || 'Field Technician'}
                    </p>



                    <div className="flex items-center gap-2 px-6 py-3 bg-indigo-50 rounded-2xl text-indigo-900 font-bold border border-indigo-100 hover:bg-indigo-100 transition-colors cursor-pointer" onClick={() => window.location.href = `tel:${technician.phone}`}>
                        <Phone size={18} className="text-indigo-600 fill-indigo-200" />
                        <span className="text-lg tracking-wide">{technician.phone}</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TechnicianDetailsModal;
