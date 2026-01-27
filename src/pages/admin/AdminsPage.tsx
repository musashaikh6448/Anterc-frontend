import React, { useEffect, useState } from 'react';
import { Plus, Edit, Trash2, UserCog, Search, Zap } from 'lucide-react';
import { getAllAdmins, createAdmin, updateAdmin, deleteAdmin } from '@/api/adminApi';
import { useAuth } from '../../AuthContext';
import { toast } from 'sonner';
import Pagination from '@/components/admin/Pagination';
import Modal from '@/components/admin/Modal';
import AdminFormModal from '@/components/admin/AdminFormModal';

const AdminsPage: React.FC = () => {
  const { user } = useAuth();
  const [admins, setAdmins] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletingAdmin, setDeletingAdmin] = useState<any>(null);
  const [editingAdmin, setEditingAdmin] = useState<any>(null);
  const [formData, setFormData] = useState({ name: '', phone: '', password: '' });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    fetchAdmins();
  }, []);

  const fetchAdmins = async () => {
    setLoading(true);
    try {
      const { data } = await getAllAdmins();
      setAdmins(data);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to load admins');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.phone.length !== 10) {
      toast.error('Phone number must be exactly 10 digits');
      return;
    }

    if (!editingAdmin && !formData.password) {
      toast.error('Password is required for new admins');
      return;
    }

    try {
      if (editingAdmin) {
        await updateAdmin(editingAdmin._id, formData);
        toast.success('Admin updated successfully');
      } else {
        await createAdmin(formData);
        toast.success('Admin created successfully');
      }
      setShowForm(false);
      setEditingAdmin(null);
      setFormData({ name: '', phone: '', password: '' });
      fetchAdmins();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to save admin');
    }
  };

  const handleEdit = (admin: any) => {
    setEditingAdmin(admin);
    setFormData({ name: admin.name, phone: admin.phone, password: '' });
    setShowForm(true);
  };

  const handleDeleteClick = (admin: any) => {
    setDeletingAdmin(admin);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    if (!deletingAdmin) return;

    try {
      await deleteAdmin(deletingAdmin._id);
      toast.success('Admin deleted successfully');
      setShowDeleteModal(false);
      setDeletingAdmin(null);
      fetchAdmins();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to delete admin');
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingAdmin(null);
    setFormData({ name: '', phone: '', password: '' });
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const filteredAdmins = admins.filter(
    (admin) =>
      admin.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      admin.phone?.includes(searchTerm)
  );

  const totalPages = Math.ceil(filteredAdmins.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedAdmins = filteredAdmins.slice(startIndex, startIndex + itemsPerPage);

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
          <UserCog size={14} className="text-indigo-600" />
          <span className="text-indigo-600 font-black text-[10px] uppercase tracking-widest">Admin Management</span>
        </div>
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tighter leading-[1.05]">
              Admin <span className="text-slate-400">Accounts</span>
            </h1>
            <p className="text-slate-500 max-w-2xl text-sm sm:text-base font-medium leading-relaxed mt-3">
              Manage admin accounts and permissions for your system.
            </p>
          </div>
          <button
            onClick={() => {
              setEditingAdmin(null);
              setFormData({ name: '', phone: '', password: '' });
              setShowForm(true);
            }}
            className="px-5 py-2.5 bg-slate-900 text-white rounded-xl font-black hover:bg-indigo-600 transition-all shadow-lg flex items-center gap-2 whitespace-nowrap text-sm"
          >
            <Plus size={18} />
            <span className="hidden sm:inline">Add Admin</span>
          </button>
        </div>
      </div>

      {/* Form Modal */}
      <AdminFormModal
        isOpen={showForm}
        onClose={handleCancel}
        title={editingAdmin ? 'Edit Admin' : 'Create Admin'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Name</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all font-medium"
              placeholder="Enter admin name"
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Phone (10 digits)</label>
            <input
              type="tel"
              required
              maxLength={10}
              value={formData.phone}
              onChange={(e) => {
                const numericValue = e.target.value.replace(/\D/g, '');
                if (numericValue.length <= 10) {
                  setFormData({ ...formData, phone: numericValue });
                }
              }}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all font-medium"
              placeholder="Enter 10-digit phone number"
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">
              Password {editingAdmin && '(leave empty to keep current)'}
            </label>
            <input
              type="password"
              required={!editingAdmin}
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all font-medium"
              placeholder="Enter password"
            />
          </div>
          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              className="flex-1 px-6 py-3 bg-slate-900 text-white rounded-xl font-black hover:bg-indigo-600 transition-all"
            >
              {editingAdmin ? 'Update' : 'Create'}
            </button>
            <button
              type="button"
              onClick={handleCancel}
              className="flex-1 px-6 py-3 bg-slate-100 text-slate-700 rounded-xl font-bold hover:bg-slate-200 transition-all"
            >
              Cancel
            </button>
          </div>
        </form>
      </AdminFormModal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false);
          setDeletingAdmin(null);
        }}
        title="Delete Admin"
        message={`Are you sure you want to delete admin "${deletingAdmin?.name}"? This action cannot be undone.`}
        type="confirm"
        onConfirm={handleDeleteConfirm}
        confirmText="Delete"
        cancelText="Cancel"
      />

      {/* Search */}
      <div className="bg-white border border-slate-100 rounded-xl sm:rounded-2xl p-4 hover:shadow-lg transition-all duration-300">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
          <input
            type="text"
            placeholder="Search by name or phone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all font-medium"
          />
        </div>
      </div>

      {/* Stats Card - Reduced Size */}
      <div className="bg-slate-900 rounded-2xl sm:rounded-[2.5rem] p-5 sm:p-6 text-white relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-48 h-48 sm:w-64 sm:h-64 bg-indigo-600/10 rounded-full blur-[80px] transition-all duration-1000 group-hover:bg-indigo-600/20"></div>
        <div className="relative z-10 flex items-center justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest opacity-90 mb-2">Total Admins</p>
            <p className="text-3xl sm:text-4xl font-black">{admins.length}</p>
          </div>
          <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center">
            <UserCog size={24} strokeWidth={2.5} />
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
                  Name
                </th>
                <th className="px-4 py-3 text-left text-xs font-black text-slate-500 uppercase tracking-widest">
                  Phone
                </th>
                <th className="px-4 py-3 text-left text-xs font-black text-slate-500 uppercase tracking-widest">
                  Created
                </th>
                <th className="px-4 py-3 text-left text-xs font-black text-slate-500 uppercase tracking-widest">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {paginatedAdmins.map((admin) => (
                <tr key={admin._id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 bg-indigo-50 rounded-lg flex items-center justify-center text-indigo-600">
                        <UserCog size={18} />
                      </div>
                      <span className="text-sm font-bold text-slate-900">{admin.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-slate-600">{admin.phone}</td>
                  <td className="px-4 py-3 text-sm text-slate-500">{formatDate(admin.createdAt)}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleEdit(admin)}
                        className="text-indigo-600 hover:text-indigo-700 p-2 rounded-lg hover:bg-indigo-50 transition-all"
                      >
                        <Edit size={16} />
                      </button>
                      {admin._id !== user?._id && (
                        <button
                          onClick={() => handleDeleteClick(admin)}
                          className="text-rose-600 hover:text-rose-700 p-2 rounded-lg hover:bg-rose-50 transition-all"
                        >
                          <Trash2 size={16} />
                        </button>
                      )}
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
        {paginatedAdmins.map((admin) => (
          <div key={admin._id} className="bg-white border border-slate-100 rounded-xl sm:rounded-2xl p-4 hover:shadow-lg transition-all duration-300">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-indigo-50 rounded-lg flex items-center justify-center text-indigo-600">
                <UserCog size={20} />
              </div>
              <div className="flex-1">
                <div className="text-sm font-bold text-slate-900">{admin.name}</div>
                <div className="text-xs text-slate-500">{admin.phone}</div>
              </div>
            </div>
            <div className="mb-3">
              <div className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">Created</div>
              <div className="text-sm text-slate-500">{formatDate(admin.createdAt)}</div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => handleEdit(admin)}
                className="flex-1 py-2.5 bg-indigo-50 text-indigo-600 rounded-xl font-bold text-sm hover:bg-indigo-100 transition-all flex items-center justify-center gap-2"
              >
                <Edit size={14} />
                Edit
              </button>
              {admin._id !== user?._id && (
                <button
                  onClick={() => handleDeleteClick(admin)}
                  className="flex-1 py-2.5 bg-rose-50 text-rose-600 rounded-xl font-bold text-sm hover:bg-rose-100 transition-all flex items-center justify-center gap-2"
                >
                  <Trash2 size={14} />
                  Delete
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      {filteredAdmins.length > 0 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          itemsPerPage={itemsPerPage}
          totalItems={filteredAdmins.length}
        />
      )}

      {filteredAdmins.length === 0 && (
        <div className="text-center py-12 bg-white border border-slate-100 rounded-xl">
          <p className="text-slate-500 font-medium">No admins found</p>
        </div>
      )}
    </div>
  );
};

export default AdminsPage;
