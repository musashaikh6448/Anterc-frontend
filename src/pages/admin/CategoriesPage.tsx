import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Search, Sparkles, Filter, Move, GripVertical } from 'lucide-react';
import { toast } from 'sonner';
import Modal from '@/components/admin/Modal';
import AdminFormModal from '@/components/admin/AdminFormModal';
import ImageUpload from '@/components/admin/ImageUpload';
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
import {
    getAllCategoriesAdmin,
    createCategory,
    updateCategory,
    deleteCategory,
    reorderCategories
} from '@/api/adminApi';

// Sortable Item Component
const SortableItem = ({ category, onEdit, onDelete }: any) => {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging
    } = useSortable({ id: category._id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        zIndex: isDragging ? 1000 : 1,
        opacity: isDragging ? 0.5 : 1,
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            className="bg-white border border-slate-100 rounded-lg sm:rounded-xl p-3 sm:p-4 flex items-center gap-4 hover:shadow-md transition-shadow group mb-2"
        >
            <div
                {...attributes}
                {...listeners}
                className="cursor-move text-slate-400 hover:text-indigo-600 p-2"
            >
                <GripVertical size={20} />
            </div>

            <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-lg overflow-hidden bg-slate-50 border border-slate-100 flex-shrink-0">
                {category.imageUrl ? (
                    <img
                        src={category.imageUrl}
                        alt={category.name}
                        className="w-full h-full object-cover"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center bg-slate-100 text-slate-400">
                        <Sparkles size={16} />
                    </div>
                )}
            </div>

            <div className="flex-1 min-w-0">
                <h3 className="text-sm sm:text-base font-black text-slate-900 mb-0.5 line-clamp-1">
                    {category.name}
                </h3>
                <p className="text-xs text-slate-500 line-clamp-1 hidden sm:block">
                    {category.description}
                </p>
            </div>

            <div className="flex items-center gap-2">
                <button
                    onClick={() => onEdit(category)}
                    className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all"
                >
                    <Edit size={16} />
                </button>
                <button
                    onClick={() => onDelete(category)}
                    className="p-2 text-rose-600 hover:bg-rose-50 rounded-lg transition-all"
                >
                    <Trash2 size={16} />
                </button>
            </div>
        </div>
    );
};

const CategoriesPage: React.FC = () => {
    const [categories, setCategories] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [editingCategory, setEditingCategory] = useState<any>(null);
    const [deletingCategory, setDeletingCategory] = useState<any>(null);
    const [submitting, setSubmitting] = useState(false);

    const [formData, setFormData] = useState({
        name: '',
        description: '',
        imageUrl: '',
    });

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
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            setLoading(true);
            const { data } = await getAllCategoriesAdmin();
            setCategories(data);
        } catch (error) {
            console.error(error);
            toast.error('Failed to load categories');
        } finally {
            setLoading(false);
        }
    };

    const handleDragEnd = async (event: DragEndEvent) => {
        const { active, over } = event;

        if (active.id !== over?.id) {
            setCategories((items: any[]) => {
                const oldIndex = items.findIndex((item) => item._id === active.id);
                const newIndex = items.findIndex((item) => item._id === over?.id);
                const newItems = arrayMove(items, oldIndex, newIndex);

                // Save new order to backend
                const orderedIds = newItems.map(item => item._id);
                reorderCategories(orderedIds).catch(err => {
                    toast.error('Failed to save order');
                    // Revert changes if needed (not implemented here for simplicity)
                });

                return newItems;
            });
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.name) {
            toast.error('Please fill all required fields');
            return;
        }

        setSubmitting(true);
        try {
            if (editingCategory) {
                await updateCategory(editingCategory._id, formData);
                toast.success('Category updated successfully');
            } else {
                await createCategory(formData);
                toast.success('Category created successfully');
            }
            setShowForm(false);
            resetForm();
            fetchCategories();
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Failed to save category');
        } finally {
            setSubmitting(false);
        }
    };

    const resetForm = () => {
        setFormData({ name: '', description: '', imageUrl: '' });
        setEditingCategory(null);
    };

    const handleEdit = (category: any) => {
        setEditingCategory(category);
        setFormData({
            name: category.name,
            description: category.description || '',
            imageUrl: category.imageUrl || '',
        });
        setShowForm(true);
    };

    const handleDeleteConfirm = async () => {
        if (!deletingCategory) return;
        try {
            await deleteCategory(deletingCategory._id);
            toast.success('Category deleted successfully');
            setShowDeleteModal(false);
            setDeletingCategory(null);
            fetchCategories();
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Failed to delete category');
        }
    };

    return (
        <div className="space-y-6 sm:space-y-8">
            {/* Header */}
            <div className="space-y-3">
                <div className="inline-flex items-center gap-2 bg-indigo-50 px-4 py-1.5 rounded-full border border-indigo-100">
                    <Sparkles size={14} className="text-indigo-600" />
                    <span className="text-indigo-600 font-black text-[10px] uppercase tracking-widest">
                        Category Management
                    </span>
                </div>
                <div className="flex items-start justify-between">
                    <div>
                        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tighter leading-[1.05]">
                            Service <span className="text-slate-400">Categories</span>
                        </h1>
                        <p className="text-slate-500 max-w-2xl text-sm sm:text-base font-medium leading-relaxed mt-3">
                            Create and reorder service categories displayed on the home page.
                        </p>
                    </div>
                    <button
                        onClick={() => {
                            resetForm();
                            setShowForm(true);
                        }}
                        className="px-5 py-2.5 bg-slate-900 text-white rounded-xl font-black hover:bg-indigo-600 transition-all shadow-lg flex items-center gap-2 whitespace-nowrap text-sm"
                    >
                        <Plus size={18} />
                        <span className="hidden sm:inline">Add Category</span>
                    </button>
                </div>
            </div>

            {/* List with Drag & Drop */}
            {loading ? (
                <div className="flex items-center justify-center py-20">
                    <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
                </div>
            ) : (
                <DndContext
                    sensors={sensors}
                    collisionDetection={closestCenter}
                    onDragEnd={handleDragEnd}
                >
                    <SortableContext
                        items={categories.map(c => c._id)}
                        strategy={verticalListSortingStrategy}
                    >
                        <div className="space-y-2">
                            {categories.map((category) => (
                                <SortableItem
                                    key={category._id}
                                    category={category}
                                    onEdit={handleEdit}
                                    onDelete={(cat: any) => {
                                        setDeletingCategory(cat);
                                        setShowDeleteModal(true);
                                    }}
                                />
                            ))}
                        </div>
                        {categories.length === 0 && (
                            <div className="text-center py-12 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                                <p className="text-slate-500 font-medium">No categories found. Create one to get started.</p>
                            </div>
                        )}
                    </SortableContext>
                </DndContext>
            )}

            {/* Form Modal */}
            <AdminFormModal
                isOpen={showForm}
                onClose={() => {
                    setShowForm(false);
                    resetForm();
                }}
                title={editingCategory ? 'Edit Category' : 'Create Category'}
            >
                <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
                    <div>
                        <label className="block text-xs sm:text-sm font-bold text-slate-700 mb-2">
                            Name <span className="text-rose-600">*</span>
                        </label>
                        <input
                            required
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            placeholder="e.g. Air Conditioner"
                            className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-slate-50 border border-slate-100 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all text-sm sm:text-base font-medium"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={submitting}
                        className="w-full px-6 py-3 bg-slate-900 text-white rounded-xl font-black hover:bg-indigo-600 disabled:bg-slate-300 transition-all flex items-center justify-center gap-2"
                    >
                        {submitting ? 'Saving...' : (editingCategory ? 'Update Category' : 'Create Category')}
                    </button>
                </form>
            </AdminFormModal>

            {/* Delete Modal */}
            <Modal
                isOpen={showDeleteModal}
                onClose={() => setShowDeleteModal(false)}
                title="Delete Category"
                message={`Are you sure? This might affect existing services linked to "${deletingCategory?.name}".`}
                type="confirm"
                onConfirm={handleDeleteConfirm}
                confirmText="Delete"
                cancelText="Cancel"
            />
        </div>
    );
};

export default CategoriesPage;
