import React, { useState, useEffect } from 'react';
import {
    Plus,
    Search,
    Trash2,
    Edit2,
    UserCog,
    Phone,
    ShieldCheck,
    Power
} from 'lucide-react';
import { toast } from 'sonner';
import {
    getTechnicians,
    createTechnician,
    updateTechnician,
    deleteTechnician
} from '../../api/adminApi';
import TechnicianModal from '../../components/admin/TechnicianModal';

const TechniciansPage: React.FC = () => {
    const [technicians, setTechnicians] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedTech, setSelectedTech] = useState<any | null>(null);

    useEffect(() => {
        fetchTechnicians();
    }, []);

    const fetchTechnicians = async () => {
        try {
            const { data } = await getTechnicians();
            setTechnicians(data);
        } catch (error) {
            toast.error('Failed to load technicians');
        } finally {
            setLoading(false);
        }
    };

    const handleCreate = async (formData: any) => {
        try {
            await createTechnician(formData);
            toast.success('Technician added successfully');
            fetchTechnicians();
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Failed to add technician');
            throw error;
        }
    };

    const handleUpdate = async (formData: any) => {
        if (!selectedTech) return;
        try {
            await updateTechnician(selectedTech._id, formData);
            toast.success('Technician updated successfully');
            fetchTechnicians();
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Failed to update technician');
            throw error;
        }
    };

    const handleDelete = async (id: string) => {
        if (!window.confirm('Are you sure you want to delete this technician?')) return;
        try {
            await deleteTechnician(id);
            toast.success('Technician deleted successfully');
            fetchTechnicians();
        } catch (error) {
            toast.error('Failed to delete technician');
        }
    };

    const openAddModal = () => {
        setSelectedTech(null);
        setIsModalOpen(true);
    };

    const openEditModal = (tech: any) => {
        setSelectedTech(tech);
        setIsModalOpen(true);
    };

    const filteredTechnicians = technicians.filter(tech =>
        tech.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tech.phone.includes(searchQuery)
    );

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'available': return 'bg-emerald-50 text-emerald-600 border-emerald-100';
            case 'busy': return 'bg-amber-50 text-amber-600 border-amber-100';
            case 'off-duty': return 'bg-slate-50 text-slate-500 border-slate-100';
            default: return 'bg-slate-50 text-slate-600';
        }
    };

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-black text-slate-900">Technicians</h1>
                    <p className="text-slate-500 mt-1 font-medium">Manage your field service team</p>
                </div>
                <button
                    onClick={openAddModal}
                    className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition shadow-lg shadow-indigo-200"
                >
                    <Plus size={18} strokeWidth={3} />
                    Add Technician
                </button>
            </div>

            {/* Search */}
            <div className="relative max-w-md">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                <input
                    type="text"
                    placeholder="Search by name or phone..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-400 font-medium text-slate-600 placeholder:text-slate-400 transition-all"
                />
            </div>

            {/* List */}
            {loading ? (
                <div className="flex justify-center py-12">
                    <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
                </div>
            ) : filteredTechnicians.length > 0 ? (
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {filteredTechnicians.map((tech) => (
                        <div key={tech._id} className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-md transition-all group">
                            <div className="flex justify-between items-start mb-4">
                                <div className="w-12 h-12 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600">
                                    <UserCog size={24} />
                                </div>
                                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button
                                        onClick={() => openEditModal(tech)}
                                        className="p-2 hover:bg-slate-100 rounded-xl text-slate-400 hover:text-indigo-600 transition-colors"
                                    >
                                        <Edit2 size={16} />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(tech._id)}
                                        className="p-2 hover:bg-rose-50 rounded-xl text-slate-400 hover:text-rose-600 transition-colors"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </div>

                            <div>
                                <h3 className="text-lg font-bold text-slate-900">{tech.name}</h3>
                                <div className="flex items-center gap-2 mt-1 text-slate-500 text-sm font-medium">
                                    <Phone size={14} />
                                    {tech.phone}
                                </div>
                            </div>

                            <div className="mt-4 pt-4 border-t border-slate-50 flex flex-wrap gap-2">
                                <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border ${getStatusColor(tech.availabilityStatus)}`}>
                                    {tech.availabilityStatus}
                                </span>
                                {tech.specialization && (
                                    <span className="px-3 py-1 bg-slate-100 text-slate-600 rounded-full text-[10px] font-bold uppercase tracking-widest border border-slate-200 flex items-center gap-1">
                                        <ShieldCheck size={12} />
                                        {tech.specialization}
                                    </span>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center py-12 bg-slate-50 rounded-[2rem] border border-dashed border-slate-200">
                    <UserCog size={48} className="mx-auto text-slate-300 mb-4" />
                    <h3 className="text-lg font-bold text-slate-900">No technicians found</h3>
                    <p className="text-slate-400">Add your first technician to get started</p>
                </div>
            )}

            <TechnicianModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSubmit={selectedTech ? handleUpdate : handleCreate}
                technician={selectedTech}
            />
        </div>
    );
};

export default TechniciansPage;
