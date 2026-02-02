import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Search, Sparkles, Filter, X, ChevronDown, ChevronUp, GripVertical } from 'lucide-react';
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
  getAllCategoriesAdmin
} from '@/api/adminApi';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
  DragEndEvent
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';



// Sortable Sub Service Item
const SortableSubServiceItem = ({
  subService,
  index,
  isExpanded,
  toggleExpand,
  updateSubService,
  removeSubService,
  addIssueResolved,
  removeIssueResolved
}: any) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id: `sub-${index}` });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 1000 : 1,
    opacity: isDragging ? 0.5 : 1,
  };

  const issuesCount = subService.issuesResolved?.length || 0;

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="bg-slate-50 border border-slate-200 rounded-lg sm:rounded-xl overflow-hidden mb-3"
    >
      {/* Accordion Header */}
      <div className="flex items-center">
        <div
          {...attributes}
          {...listeners}
          className="p-3 sm:p-4 text-slate-400 cursor-move hover:text-indigo-600 border-r border-slate-200 bg-white"
        >
          <GripVertical size={20} />
        </div>

        <button
          type="button"
          onClick={() => toggleExpand(index)}
          className="flex-1 p-3 sm:p-4 flex items-center justify-between gap-3 hover:bg-slate-100 transition-colors text-left"
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
      </div>

      {/* Accordion Content */}
      <div
        className={`overflow-hidden transition-all duration-300 ease-in-out ${isExpanded ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'
          }`}
      >
        <div className="p-3 sm:p-4 pt-0 space-y-3 sm:space-y-4 border-t border-slate-200">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
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
                Offer Price (₹) <span className="text-rose-600">*</span>
              </label>
              <input
                type="number"
                required
                min="0"
                value={subService.price}
                onChange={(e) => updateSubService(index, 'price', e.target.value)}
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none text-sm"
                placeholder="Offer Price"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Actual Price (₹) <span className="text-slate-400 font-normal">(Optional)</span>
              </label>
              <input
                type="number"
                min="0"
                value={subService.actualPrice || ''}
                onChange={(e) => updateSubService(index, 'actualPrice', e.target.value)}
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none text-sm"
                placeholder="MRP"
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
              onChange={(base64: string) => updateSubService(index, 'imageUrl', base64)}
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
};

const ServicesPage: React.FC = () => {
  const [services, setServices] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]); // Dynamic Categories
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

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 250,
        tolerance: 5,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  useEffect(() => {
    fetchServices();
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const { data } = await getAllCategoriesAdmin();
      setCategories(data);
    } catch (error) {
      console.error('Failed to load categories', error);
      toast.error('Failed to load categories');
    }
  };

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

  const toggleService = (id: string) => {
    const newExpanded = new Set(expandedServices);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedServices(newExpanded);
  };

  const toggleSubService = (index: number) => {
    const newExpanded = new Set(expandedSubServices);
    if (newExpanded.has(index)) {
      newExpanded.delete(index);
    } else {
      newExpanded.add(index);
    }
    setExpandedSubServices(newExpanded);
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
          actualPrice: '',
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

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (active.id !== over?.id) {
      const oldIndex = parseInt(active.id.toString().replace('sub-', ''));
      const newIndex = parseInt(over?.id.toString().replace('sub-', '') || '0');

      const newSubServices = arrayMove(formData.subServices, oldIndex, newIndex);
      setFormData({ ...formData, subServices: newSubServices });
    }
  };

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
              {categories.map((cat) => (
                <option key={cat._id} value={cat.name}>
                  {cat.name}
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

            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <SortableContext
                items={formData.subServices.map((_, i) => `sub-${i}`)}
                strategy={verticalListSortingStrategy}
              >
                <div className="space-y-2 sm:space-y-3">
                  {formData.subServices.map((subService, index) => (
                    <SortableSubServiceItem
                      key={`sub-${index}`} // Re-render when index changes to keep it in sync or use unique ID if available
                      id={`sub-${index}`} // This is just a prop, not sortable ID
                      index={index}
                      subService={subService}
                      isExpanded={expandedSubServices.has(index)}
                      toggleExpand={toggleSubService}
                      updateSubService={updateSubService}
                      removeSubService={removeSubService}
                      addIssueResolved={addIssueResolved}
                      removeIssueResolved={removeIssueResolved}
                    />
                  ))}
                </div>
              </SortableContext>
            </DndContext>

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
              {categories.map((cat) => (
                <option key={cat._id} value={cat.name}>
                  {cat.name}
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
          <p className="text-3xl sm:text-4xl font-black text-slate-900">{categories.length}</p>
        </div>
        <div className="bg-white border border-slate-100 rounded-xl sm:rounded-2xl p-5 sm:p-6 hover:shadow-lg transition-all duration-300">
          <div className="w-10 h-10 bg-amber-50 rounded-xl flex items-center justify-center mb-3 text-amber-600">
            <Sparkles size={20} strokeWidth={2.5} />
          </div>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Avg Price</p>
          <p className="text-3xl sm:text-4xl font-black text-slate-900">₹{avgPrice}</p>
        </div>
      </div>

      {/* Services List - Grouped by Category */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : (
        <div className="space-y-8 sm:space-y-12">
          {categories.map((category) => {
            // Filter services for this category
            const categoryServices = services.filter(service =>
              service.category === category.name &&
              (searchTerm === '' ||
                service.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                service.description.toLowerCase().includes(searchTerm.toLowerCase()))
            );

            if (categoryServices.length === 0 && searchTerm !== '') return null; // Hide category if no matches during search

            return (
              <div key={category._id} className="space-y-4">
                {/* Category Header */}
                <div className="flex items-center gap-3 border-b border-slate-100 pb-2">
                  <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                    {category.name}
                  </h2>
                  <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600 text-xs font-bold">
                    {categoryServices.length}
                  </span>
                </div>

                {/* Services Grid/List */}
                <div className="space-y-2 sm:space-y-3">
                  {categoryServices.length > 0 ? (
                    categoryServices.map((service) => (
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
                                  <Sparkles size={16} />
                                </div>
                              )}
                            </div>

                            <div className="flex-1 min-w-0">
                              <h3 className="text-sm sm:text-base font-black text-slate-900 mb-1 line-clamp-1">
                                {service.title}
                              </h3>
                              <div className="flex items-center flex-wrap gap-2 text-xs text-slate-500">
                                <span className="flex items-center gap-1">
                                  <Sparkles size={12} className="text-indigo-500" />
                                  {service.subServices?.length || 0} Sub-services
                                </span>
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 flex-shrink-0">
                            <div
                              onClick={(e) => {
                                e.stopPropagation();
                                handleEdit(service);
                              }}
                              className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all cursor-pointer"
                              title="Edit Service"
                            >
                              <Edit size={18} />
                            </div>
                            <div
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteClick(service);
                              }}
                              className="p-2 text-rose-600 hover:bg-rose-50 rounded-lg transition-all cursor-pointer"
                              title="Delete Service"
                            >
                              <Trash2 size={18} />
                            </div>
                            <div className="p-2 text-slate-400">
                              {expandedServices.has(service._id) ? (
                                <ChevronUp size={20} />
                              ) : (
                                <ChevronDown size={20} />
                              )}
                            </div>
                          </div>
                        </button>

                        {/* Accordion Content */}
                        <div
                          className={`overflow-hidden transition-all duration-300 ease-in-out ${expandedServices.has(service._id) ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'
                            }`}
                        >
                          <div className="p-3 sm:p-4 pt-0 border-t border-slate-100 bg-slate-50/50">
                            <div className="mt-3 space-y-2">
                              <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Sub-Services</h4>
                              {service.subServices && service.subServices.length > 0 ? (
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                                  {service.subServices.map((sub: any, idx: number) => (
                                    <div key={idx} className="bg-white p-2 rounded-lg border border-slate-100 flex gap-3">
                                      {sub.imageUrl && (
                                        <div className="w-10 h-10 rounded-md bg-slate-100 overflow-hidden flex-shrink-0">
                                          <img src={sub.imageUrl} alt={sub.name} className="w-full h-full object-cover" />
                                        </div>
                                      )}
                                      <div className="min-w-0">
                                        <p className="text-xs font-bold text-slate-900 truncate">{sub.name}</p>
                                        <p className="text-[10px] text-indigo-600 font-bold">₹{sub.price}</p>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              ) : (
                                <p className="text-sm text-slate-400 italic">No sub-services defined.</p>
                              )}
                            </div>

                            <div className="mt-4 pt-3 border-t border-slate-200">
                              <p className="text-sm text-slate-600 leading-relaxed">
                                <span className="font-bold text-slate-900">Description: </span>
                                {service.description}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="p-8 text-center bg-slate-50 rounded-xl border border-dashed border-slate-200">
                      <p className="text-slate-400 font-medium text-sm">No services in this category yet.</p>
                      <button
                        onClick={() => {
                          setEditingService(null);
                          resetForm();
                          setFormData(prev => ({ ...prev, category: category.name }));
                          setShowForm(true);
                        }}
                        className="mt-2 text-indigo-600 text-xs font-bold hover:underline"
                      >
                        + Add Service
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}

          {/* Handle uncategorized services if any */}
          {(() => {
            const categorizedTitles = new Set(categories.map(c => c.name));
            const uncategorizedServices = services.filter(s => !categorizedTitles.has(s.category) && (searchTerm === '' || s.title.toLowerCase().includes(searchTerm.toLowerCase())));

            if (uncategorizedServices.length > 0) {
              return (
                <div className="space-y-4 pt-8 border-t-2 border-dashed border-slate-200">
                  <div className="flex items-center gap-3 pb-2">
                    <h2 className="text-xl sm:text-2xl font-black text-rose-600 tracking-tight">
                      Other / Uncategorized
                    </h2>
                    <span className="px-2.5 py-0.5 rounded-full bg-rose-100 text-rose-600 text-xs font-bold">
                      {uncategorizedServices.length}
                    </span>
                  </div>
                  <div className="space-y-2 sm:space-y-3">
                    <p className="text-slate-500 text-sm">These services have categories that no longer exist. Please edit them.</p>
                    {uncategorizedServices.map((service) => (
                      <div key={service._id} className="p-4 bg-rose-50 border border-rose-100 rounded-xl flex justify-between items-center">
                        <span className="font-bold text-slate-900">{service.title} <span className="text-rose-500 text-xs">({service.category})</span></span>
                        <div className="flex gap-2">
                          <button onClick={() => handleEdit(service)} className="text-indigo-600 font-bold text-xs hover:underline">Fix Category</button>
                          <button onClick={() => handleDeleteClick(service)} className="text-rose-600 font-bold text-xs hover:underline">Delete</button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )
            }
            return null;
          })()}
        </div>
      )}
    </div>
  );
};
export default ServicesPage;
