import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Search, Sparkles, Filter, X, ChevronDown, ChevronUp } from 'lucide-react';
import { toast } from 'sonner';
import Pagination from '@/components/admin/Pagination';
import Modal from '@/components/admin/Modal';
import AdminFormModal from '@/components/admin/AdminFormModal';
import ImageUpload from '@/components/admin/ImageUpload';
import {
  getAllServicesAdmin,
  createService,
  updateService,
  deleteService,
} from '@/api/adminApi';

const CATEGORIES = [
  'Air Conditioner',
  'Electrician',
  'Plumbing',
  'Washing Machine',
  'TV',
  'Refrigerator',
  'Deep Freezer',
  'Ceiling & Table Fan',
  'Water Purifier',
  'Dishwasher',
  'Dispenser',
  'Visi Cooler',
  'Water Cooler',
  'Air Cooler',
  'CCTV Camera',
  'Computer & Laptop',
  'Printer',
  'Stabilizer',
  'Chimneys',
  'Microwave oven',
  'Electric Induction',
  'Air Purifier',
  'Geysers',
  'Home theatre/ Sound box',
  'Inverter Batteries',
  'Vacuum cleaner',
];

const ServicesPage: React.FC = () => {
  const [services, setServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [showForm, setShowForm] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletingService, setDeletingService] = useState<any>(null);
  const [editingService, setEditingService] = useState<any>(null);
  const [formData, setFormData] = useState({
    category: '',
    title: '',
    description: '',
    imageUrl: '',
    subServices: [] as any[],
  });
  const [submitting, setSubmitting] = useState(false);
  const [expandedServices, setExpandedServices] = useState<Set<string>>(new Set());
  const [expandedSubServices, setExpandedSubServices] = useState<Set<number>>(new Set());
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const toggleService = (serviceId: string) => {
    setExpandedServices(prev => {
      const newSet = new Set(prev);
      if (newSet.has(serviceId)) {
        newSet.delete(serviceId);
      } else {
        newSet.add(serviceId);
      }
      return newSet;
    });
  };

  const toggleSubService = (index: number) => {
    setExpandedSubServices(prev => {
      const newSet = new Set(prev);
      if (newSet.has(index)) {
        newSet.delete(index);
      } else {
        newSet.add(index);
      }
      return newSet;
    });
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    setLoading(true);
    try {
      const { data } = await getAllServicesAdmin();
      setServices(data);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to load services');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.category || !formData.title || !formData.description || !formData.imageUrl) {
      toast.error('Please fill all required fields');
      return;
    }

    setSubmitting(true);
    try {
      if (editingService) {
        await updateService(editingService._id, formData);
        toast.success('Service updated successfully');
      } else {
        await createService(formData);
        toast.success('Service created successfully');
      }
      setShowForm(false);
      setEditingService(null);
      resetForm();
      fetchServices();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to save service');
    } finally {
      setSubmitting(false);
    }
  };

  const resetForm = () => {
    setFormData({
      category: '',
      title: '',
      description: '',
      imageUrl: '',
      subServices: [],
    });
    setExpandedSubServices(new Set());
  };

  const handleEdit = (service: any) => {
    setEditingService(service);
    setFormData({
      category: service.category,
      title: service.title,
      description: service.description,
      imageUrl: service.imageUrl,
      subServices: service.subServices || [],
    });
    setShowForm(true);
  };

  const handleDeleteClick = (service: any) => {
    setDeletingService(service);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    if (!deletingService) return;

    try {
      await deleteService(deletingService._id);
      toast.success('Service deleted successfully');
      setShowDeleteModal(false);
      setDeletingService(null);
      fetchServices();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to delete service');
    }
  };

  const addSubService = () => {
    const newIndex = formData.subServices.length;
    setFormData({
      ...formData,
      subServices: [
        ...formData.subServices,
        {
          name: '',
          description: '',
          price: '',
          imageUrl: '',
          issuesResolved: [],
        },
      ],
    });
    // Auto-expand the newly added sub-service
    setExpandedSubServices(prev => new Set([...prev, newIndex]));
  };

  const updateSubService = (index: number, field: string, value: any) => {
    const updated = [...formData.subServices];
    updated[index] = { ...updated[index], [field]: value };
    setFormData({ ...formData, subServices: updated });
  };

  const removeSubService = (index: number) => {
    const updated = formData.subServices.filter((_, i) => i !== index);
    setFormData({ ...formData, subServices: updated });
  };

  const addIssueResolved = (subServiceIndex: number, issue: string) => {
    if (!issue.trim()) return;
    const updated = [...formData.subServices];
    updated[subServiceIndex].issuesResolved = [
      ...(updated[subServiceIndex].issuesResolved || []),
      issue.trim(),
    ];
    setFormData({ ...formData, subServices: updated });
  };

  const removeIssueResolved = (subServiceIndex: number, issueIndex: number) => {
    const updated = [...formData.subServices];
    updated[subServiceIndex].issuesResolved = updated[subServiceIndex].issuesResolved.filter(
      (_, i) => i !== issueIndex
    );
    setFormData({ ...formData, subServices: updated });
  };

  const filteredServices = services.filter((service) => {
    const matchesSearch =
      service.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      service.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      service.category?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || service.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const totalPages = Math.ceil(filteredServices.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedServices = filteredServices.slice(startIndex, startIndex + itemsPerPage);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, categoryFilter]);

  const avgPrice =
    services.length > 0
      ? Math.round(
          services.reduce((sum, s) => {
            const subPrices = s.subServices?.map((sub: any) => sub.price || 0) || [];
            return sum + (subPrices.length > 0 ? subPrices.reduce((a: number, b: number) => a + b, 0) / subPrices.length : 0);
          }, 0) / services.length
        )
      : 0;

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
          <Sparkles size={14} className="text-indigo-600" />
          <span className="text-indigo-600 font-black text-[10px] uppercase tracking-widest">
            Services Management
          </span>
        </div>
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tighter leading-[1.05]">
              Service <span className="text-slate-400">Catalog</span>
            </h1>
            <p className="text-slate-500 max-w-2xl text-sm sm:text-base font-medium leading-relaxed mt-3">
              Manage service categories and offerings for your business.
            </p>
          </div>
          <button
            onClick={() => {
              setEditingService(null);
              resetForm();
              setShowForm(true);
            }}
            className="px-5 py-2.5 bg-slate-900 text-white rounded-xl font-black hover:bg-indigo-600 transition-all shadow-lg flex items-center gap-2 whitespace-nowrap text-sm"
          >
            <Plus size={18} />
            <span className="hidden sm:inline">Add Service</span>
          </button>
        </div>
      </div>

      {/* Form Modal */}
      <AdminFormModal
        isOpen={showForm}
        onClose={() => {
          setShowForm(false);
          setEditingService(null);
          resetForm();
        }}
        title={editingService ? 'Edit Service' : 'Create Service'}
      >
        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
          {/* Category */}
          <div>
            <label className="block text-xs sm:text-sm font-bold text-slate-700 mb-2">
              Category <span className="text-rose-600">*</span>
            </label>
            <select
              required
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-slate-50 border border-slate-100 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all text-sm sm:text-base font-medium"
            >
              <option value="">Select category</option>
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Title */}
          <div>
            <label className="block text-xs sm:text-sm font-bold text-slate-700 mb-2">
              Service Title <span className="text-rose-600">*</span>
            </label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-slate-50 border border-slate-100 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all text-sm sm:text-base font-medium"
              placeholder="e.g., Air Conditioner Service"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs sm:text-sm font-bold text-slate-700 mb-2">
              Description <span className="text-rose-600">*</span>
            </label>
            <textarea
              required
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-slate-50 border border-slate-100 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all text-sm sm:text-base font-medium resize-none"
              placeholder="Enter service description"
              rows={3}
            />
          </div>

          {/* Main Image Upload */}
          <div>
            <ImageUpload
              value={formData.imageUrl}
              onChange={(base64) => setFormData({ ...formData, imageUrl: base64 })}
              label="Service Image (Square) *"
              aspectRatio="square"
            />
          </div>

          {/* Sub-Services Section */}
          <div className="border-t border-slate-200 pt-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-black text-slate-900">Sub-Services</h3>
              <button
                type="button"
                onClick={addSubService}
                className="px-4 py-2 bg-indigo-50 text-indigo-600 rounded-xl font-bold text-sm hover:bg-indigo-100 transition-all flex items-center gap-2"
              >
                <Plus size={16} />
                Add Sub-Service
              </button>
            </div>

            <div className="space-y-2 sm:space-y-3">
              {formData.subServices.map((subService, index) => {
                const isExpanded = expandedSubServices.has(index);
                const issuesCount = subService.issuesResolved?.length || 0;
                
                return (
                  <div
                    key={index}
                    className="bg-slate-50 border border-slate-200 rounded-lg sm:rounded-xl overflow-hidden"
                  >
                    {/* Accordion Header */}
                    <button
                      type="button"
                      onClick={() => toggleSubService(index)}
                      className="w-full p-3 sm:p-4 flex items-center justify-between gap-3 hover:bg-slate-100 transition-colors text-left"
                    >
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        {/* Sub-Service Thumbnail */}
                        {subService.imageUrl ? (
                          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg overflow-hidden bg-white border border-slate-200 flex-shrink-0">
                            <img
                              src={subService.imageUrl}
                              alt={subService.name || `Sub-Service ${index + 1}`}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                (e.target as HTMLImageElement).src = 'https://via.placeholder.com/100x100?text=No+Image';
                              }}
                            />
                          </div>
                        ) : (
                          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-white border border-slate-200 flex items-center justify-center flex-shrink-0">
                            <Sparkles size={14} className="text-slate-400" />
                          </div>
                        )}

                        {/* Sub-Service Info */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="text-sm sm:text-base font-black text-slate-900 line-clamp-1">
                              {subService.name || `Sub-Service ${index + 1}`}
                            </h4>
                            {subService.price && (
                              <span className="text-xs sm:text-sm font-black text-indigo-600 whitespace-nowrap">
                                ₹{subService.price}
                              </span>
                            )}
                          </div>
                          {subService.description && (
                            <p className="text-xs text-slate-500 line-clamp-1 hidden sm:block">
                              {subService.description}
                            </p>
                          )}
                          {issuesCount > 0 && (
                            <span className="inline-block mt-1 px-2 py-0.5 bg-indigo-100 text-indigo-700 rounded text-[9px] sm:text-[10px] font-bold">
                              {issuesCount} issue{issuesCount !== 1 ? 's' : ''}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Actions & Expand Icon */}
                      <div className="flex items-center gap-1.5 flex-shrink-0">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            removeSubService(index);
                          }}
                          className="p-1.5 sm:p-2 text-rose-600 hover:bg-rose-50 rounded-lg transition-all"
                          title="Remove"
                        >
                          <X size={14} className="sm:w-4 sm:h-4" />
                        </button>
                        <div className="p-1.5 sm:p-2 text-slate-400">
                          {isExpanded ? (
                            <ChevronUp size={16} className="sm:w-5 sm:h-5" />
                          ) : (
                            <ChevronDown size={16} className="sm:w-5 sm:h-5" />
                          )}
                        </div>
                      </div>
                    </button>

                    {/* Accordion Content - Expandable */}
                    <div
                      className={`overflow-hidden transition-all duration-300 ease-in-out ${
                        isExpanded ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'
                      }`}
                    >
                      <div className="p-3 sm:p-4 pt-0 space-y-3 sm:space-y-4 border-t border-slate-200">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                          <div>
                            <label className="block text-xs font-bold text-slate-700 mb-1.5">
                              Name <span className="text-rose-600">*</span>
                            </label>
                            <input
                              type="text"
                              required
                              value={subService.name}
                              onChange={(e) => updateSubService(index, 'name', e.target.value)}
                              className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none text-sm"
                              placeholder="e.g., Anti-Bacterial Jet Service"
                            />
                          </div>

                          <div>
                            <label className="block text-xs font-bold text-slate-700 mb-1.5">
                              Price (₹) <span className="text-rose-600">*</span>
                            </label>
                            <input
                              type="number"
                              required
                              min="0"
                              value={subService.price}
                              onChange={(e) => updateSubService(index, 'price', e.target.value)}
                              className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none text-sm"
                              placeholder="Enter price"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1.5">
                            Description <span className="text-rose-600">*</span>
                          </label>
                          <textarea
                            required
                            value={subService.description}
                            onChange={(e) => updateSubService(index, 'description', e.target.value)}
                            className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none text-sm resize-none"
                            placeholder="Enter description"
                            rows={2}
                          />
                        </div>

                        <div>
                          <ImageUpload
                            value={subService.imageUrl || ''}
                            onChange={(base64) => updateSubService(index, 'imageUrl', base64)}
                            label="Sub-Service Image (Square)"
                            aspectRatio="square"
                          />
                        </div>

                        {/* Issues Resolved */}
                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-2">
                            What We Resolve
                          </label>
                          <div className="flex flex-wrap gap-2 mb-2">
                            {(subService.issuesResolved || []).map((issue: string, issueIndex: number) => (
                              <span
                                key={issueIndex}
                                className="inline-flex items-center gap-1 px-2 sm:px-3 py-1 bg-indigo-100 text-indigo-700 rounded-lg text-xs font-bold"
                              >
                                {issue}
                                <button
                                  type="button"
                                  onClick={() => removeIssueResolved(index, issueIndex)}
                                  className="hover:text-rose-600"
                                >
                                  <X size={12} />
                                </button>
                              </span>
                            ))}
                          </div>
                          <div className="flex gap-2">
                            <input
                              type="text"
                              placeholder="Add issue (e.g., Low cooling)"
                              onKeyPress={(e) => {
                                if (e.key === 'Enter') {
                                  e.preventDefault();
                                  addIssueResolved(index, e.currentTarget.value);
                                  e.currentTarget.value = '';
                                }
                              }}
                              className="flex-1 px-3 py-2 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none text-sm"
                            />
                            <button
                              type="button"
                              onClick={(e) => {
                                const input = e.currentTarget.previousElementSibling as HTMLInputElement;
                                if (input.value.trim()) {
                                  addIssueResolved(index, input.value);
                                  input.value = '';
                                }
                              }}
                              className="px-3 sm:px-4 py-2 bg-indigo-600 text-white rounded-lg font-bold text-sm hover:bg-indigo-700 transition-all whitespace-nowrap"
                            >
                              Add
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {formData.subServices.length === 0 && (
              <p className="text-sm text-slate-500 text-center py-4">
                No sub-services added. Click "Add Sub-Service" to add one.
              </p>
            )}
          </div>

          <div className="flex gap-3 pt-4 border-t border-slate-200">
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 px-6 py-3 bg-slate-900 text-white rounded-xl font-black hover:bg-indigo-600 disabled:bg-slate-300 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
            >
              {submitting ? (
                <>
                  <div className="w-5 h-5 border-4 border-white/20 border-t-white rounded-full animate-spin"></div>
                  {editingService ? 'Updating...' : 'Creating...'}
                </>
              ) : (
                editingService ? 'Update Service' : 'Create Service'
              )}
            </button>
            <button
              type="button"
              onClick={() => {
                setShowForm(false);
                setEditingService(null);
                resetForm();
              }}
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
          setDeletingService(null);
        }}
        title="Delete Service"
        message={`Are you sure you want to delete service "${deletingService?.title}"? This action cannot be undone.`}
        type="confirm"
        onConfirm={handleDeleteConfirm}
        confirmText="Delete"
        cancelText="Cancel"
      />

      {/* Filters */}
      <div className="bg-white border border-slate-100 rounded-xl sm:rounded-2xl p-4 hover:shadow-lg transition-all duration-300">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
            <input
              type="text"
              placeholder="Search services..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all font-medium"
            />
          </div>
          <div className="relative">
            <Filter className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="pl-12 pr-8 py-3 bg-slate-50 border border-slate-100 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none appearance-none cursor-pointer font-medium"
            >
              <option value="all">All Categories</option>
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
        <div className="bg-slate-900 rounded-2xl sm:rounded-[2.5rem] p-5 sm:p-6 text-white relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-40 h-40 sm:w-48 sm:h-48 bg-indigo-600/10 rounded-full blur-[80px] transition-all duration-1000 group-hover:bg-indigo-600/20"></div>
          <div className="relative z-10">
            <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center mb-3">
              <Sparkles size={20} strokeWidth={2.5} />
            </div>
            <p className="text-xs font-bold uppercase tracking-widest opacity-90 mb-2">Total Services</p>
            <p className="text-3xl sm:text-4xl font-black">{services.length}</p>
          </div>
        </div>
        <div className="bg-white border border-slate-100 rounded-xl sm:rounded-2xl p-5 sm:p-6 hover:shadow-lg transition-all duration-300">
          <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center mb-3 text-emerald-600">
            <Sparkles size={20} strokeWidth={2.5} />
          </div>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Categories</p>
          <p className="text-3xl sm:text-4xl font-black text-slate-900">{CATEGORIES.length}</p>
        </div>
        <div className="bg-white border border-slate-100 rounded-xl sm:rounded-2xl p-5 sm:p-6 hover:shadow-lg transition-all duration-300">
          <div className="w-10 h-10 bg-amber-50 rounded-xl flex items-center justify-center mb-3 text-amber-600">
            <Sparkles size={20} strokeWidth={2.5} />
          </div>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Avg Price</p>
          <p className="text-3xl sm:text-4xl font-black text-slate-900">₹{avgPrice}</p>
        </div>
      </div>

      {/* Services List - Accordion Layout */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : (
        <div className="space-y-2 sm:space-y-3">
          {paginatedServices.length > 0 ? (
            paginatedServices.map((service) => {
              const isExpanded = expandedServices.has(service._id);
              const subServicesCount = service.subServices?.length || 0;
              
              return (
                <div
                  key={service._id}
                  className="bg-white border border-slate-100 rounded-lg sm:rounded-xl hover:shadow-md transition-all duration-200 overflow-hidden"
                >
                  {/* Accordion Header - Always Visible */}
                  <button
                    onClick={() => toggleService(service._id)}
                    className="w-full p-3 sm:p-4 flex items-center justify-between gap-3 hover:bg-slate-50 transition-colors text-left"
                  >
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      {/* Service Image Thumbnail */}
                      <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-lg overflow-hidden bg-slate-50 border border-slate-100 flex-shrink-0">
                        {service.imageUrl ? (
                          <img
                            src={service.imageUrl}
                            alt={service.title}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = 'https://via.placeholder.com/100x100?text=No+Image';
                            }}
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-slate-100 text-slate-400">
                            <Sparkles size={16} className="sm:w-5 sm:h-5" />
                          </div>
                        )}
                      </div>

                      {/* Service Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="px-2 py-0.5 bg-indigo-50 text-indigo-600 rounded text-[9px] sm:text-[10px] font-black uppercase tracking-widest">
                            {service.category}
                          </span>
                          {subServicesCount > 0 && (
                            <span className="px-2 py-0.5 bg-slate-100 text-slate-600 rounded text-[9px] sm:text-[10px] font-bold">
                              {subServicesCount} sub{subServicesCount !== 1 ? 's' : ''}
                            </span>
                          )}
                        </div>
                        <h3 className="text-sm sm:text-base font-black text-slate-900 mb-0.5 line-clamp-1">
                          {service.title}
                        </h3>
                        <p className="text-xs text-slate-500 line-clamp-1 hidden sm:block">
                          {service.description}
                        </p>
                      </div>
                    </div>

                    {/* Actions & Expand Icon */}
                    <div className="flex items-center gap-1.5 flex-shrink-0">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEdit(service);
                        }}
                        className="p-1.5 sm:p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all"
                        title="Edit"
                      >
                        <Edit size={14} className="sm:w-4 sm:h-4" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteClick(service);
                        }}
                        className="p-1.5 sm:p-2 text-rose-600 hover:bg-rose-50 rounded-lg transition-all"
                        title="Delete"
                      >
                        <Trash2 size={14} className="sm:w-4 sm:h-4" />
                      </button>
                      <div className="p-1.5 sm:p-2 text-slate-400">
                        {isExpanded ? (
                          <ChevronUp size={16} className="sm:w-5 sm:h-5" />
                        ) : (
                          <ChevronDown size={16} className="sm:w-5 sm:h-5" />
                        )}
                      </div>
                    </div>
                  </button>

                  {/* Accordion Content - Expandable */}
                  <div
                    className={`overflow-hidden transition-all duration-300 ease-in-out ${
                      isExpanded ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'
                    }`}
                  >
                    <div className="p-3 sm:p-4 pt-0 border-t border-slate-100 space-y-3">
                      {/* Service Description */}
                      <div className="pb-2 border-b border-slate-50">
                        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                          {service.description}
                        </p>
                      </div>

                      {/* Main Service Image */}
                      <div className="w-full aspect-video rounded-lg overflow-hidden bg-slate-50 border border-slate-100">
                        {service.imageUrl ? (
                          <img
                            src={service.imageUrl}
                            alt={service.title}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = 'https://via.placeholder.com/400x300?text=No+Image';
                            }}
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-slate-100 text-slate-400">
                            <Sparkles size={24} />
                          </div>
                        )}
                      </div>

                      {/* Sub-Services */}
                      {service.subServices && service.subServices.length > 0 ? (
                        <div className="space-y-2">
                          <h4 className="text-xs font-black text-slate-700 uppercase tracking-widest flex items-center gap-2">
                            <Sparkles size={12} />
                            Sub-Services ({subServicesCount})
                          </h4>
                          <div className="space-y-2 max-h-[400px] overflow-y-auto custom-scrollbar pr-2">
                            {service.subServices.map((subService: any, idx: number) => (
                              <div
                                key={idx}
                                className="bg-slate-50 border border-slate-200 rounded-lg p-2.5 sm:p-3 hover:bg-slate-100 transition-colors"
                              >
                                <div className="flex gap-2.5 sm:gap-3">
                                  <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-lg overflow-hidden bg-slate-100 border border-slate-200 flex-shrink-0">
                                    {subService.imageUrl ? (
                                      <img
                                        src={subService.imageUrl}
                                        alt={subService.name}
                                        className="w-full h-full object-cover"
                                        onError={(e) => {
                                          (e.target as HTMLImageElement).src = 'https://via.placeholder.com/100x100?text=No+Image';
                                        }}
                                      />
                                    ) : (
                                      <div className="w-full h-full flex items-center justify-center bg-slate-200 text-slate-400">
                                        <Sparkles size={12} className="sm:w-4 sm:h-4" />
                                      </div>
                                    )}
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <h5 className="font-black text-slate-900 text-xs sm:text-sm mb-1 line-clamp-1">
                                      {subService.name}
                                    </h5>
                                    <p className="text-[10px] sm:text-xs text-slate-600 mb-1.5 line-clamp-2">
                                      {subService.description}
                                    </p>
                                    <div className="flex items-center justify-between gap-2">
                                      <p className="text-sm sm:text-base font-black text-slate-900">₹{subService.price || 0}</p>
                                      {subService.issuesResolved && subService.issuesResolved.length > 0 && (
                                        <span className="px-1.5 sm:px-2 py-0.5 bg-indigo-100 text-indigo-700 rounded text-[8px] sm:text-[9px] font-bold whitespace-nowrap">
                                          {subService.issuesResolved.length} issue{subService.issuesResolved.length !== 1 ? 's' : ''}
                                        </span>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      ) : (
                        <div className="text-center py-4">
                          <p className="text-xs text-slate-400 italic">No sub-services added yet</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="text-center py-16 bg-white border border-slate-100 rounded-xl">
              <Sparkles size={48} className="mx-auto text-slate-300 mb-4" />
              <p className="text-slate-500 font-medium text-lg mb-2">No services found</p>
              <p className="text-slate-400 text-sm">Create your first service to get started</p>
            </div>
          )}
        </div>
      )}

      {/* Pagination */}
      {filteredServices.length > 0 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          itemsPerPage={itemsPerPage}
          totalItems={filteredServices.length}
        />
      )}

      {filteredServices.length === 0 && (
        <div className="text-center py-12 bg-white border border-slate-100 rounded-xl">
          <p className="text-slate-500 font-medium">No services found</p>
        </div>
      )}
    </div>
  );
};

export default ServicesPage;
