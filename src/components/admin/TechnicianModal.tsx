import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';

interface TechnicianModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: any) => Promise<void>;
    technician?: any | null;
}

const TechnicianModal: React.FC<TechnicianModalProps> = ({ isOpen, onClose, onSubmit, technician }) => {
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        password: '',
        specialization: '',
        availabilityStatus: 'available'
    });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (technician) {
            setFormData({
                name: technician.name || '',
                phone: technician.phone || '',
                password: '', // Don't fill password on edit
                specialization: technician.specialization || '',
                availabilityStatus: technician.availabilityStatus || 'available'
            });
        } else {
            setFormData({
                name: '',
                phone: '',
                password: '',
                specialization: '',
                availabilityStatus: 'available'
            });
        }
    }, [technician, isOpen]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await onSubmit(formData);
            onClose();
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
            <div className="bg-white rounded-3xl w-full max-w-md overflow-hidden shadow-2xl">
                <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                    <h3 className="text-xl font-black text-slate-900">
                        {technician ? 'Edit Technician' : 'Add New Technician'}
                    </h3>
                    <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-400 hover:text-slate-600">
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Full Name</label>
                        <input
                            type="text"
                            name="name"
                            required
                            value={formData.name}
                            onChange={handleChange}
                            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 font-medium text-slate-700"
                            placeholder="Enter technician name"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Phone Number</label>
                        <input
                            type="tel"
                            name="phone"
                            required
                            pattern="[0-9]{10}"
                            maxLength={10}
                            value={formData.phone}
                            onChange={handleChange}
                            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 font-medium text-slate-700"
                            placeholder="10-digit mobile number"
                        />
                    </div>

                    {!technician && (
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Password</label>
                            <input
                                type="password"
                                name="password"
                                required={!technician}
                                value={formData.password}
                                onChange={handleChange}
                                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 font-medium text-slate-700"
                                placeholder="Set login password"
                            />
                        </div>
                    )}

                    {technician && (
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">New Password (Optional)</label>
                            <input
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 font-medium text-slate-700"
                                placeholder="Leave blank to keep current"
                            />
                        </div>
                    )}

                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Specialization</label>
                        <select
                            name="specialization"
                            value={formData.specialization}
                            onChange={handleChange}
                            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 font-medium text-slate-700 appearance-none"
                        >
                            <option value="">Select Specialization</option>
                            <option value="AC Repair">AC Repair</option>
                            <option value="Appliance Repair">Appliance Repair</option>
                            <option value="Plumbing">Plumbing</option>
                            <option value="Electrical">Electrical</option>
                            <option value="General">General</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Status</label>
                        <select
                            name="availabilityStatus"
                            value={formData.availabilityStatus}
                            onChange={handleChange}
                            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 font-medium text-slate-700 appearance-none"
                        >
                            <option value="available">Available</option>
                            <option value="busy">Busy</option>
                            <option value="off-duty">Off Duty</option>
                        </select>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-lg shadow-indigo-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all mt-4"
                    >
                        {loading ? 'Processing...' : (technician ? 'Update Technician' : 'Add Technician')}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default TechnicianModal;
