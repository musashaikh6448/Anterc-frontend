import React from 'react';
import { X } from 'lucide-react';

interface AdminFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

const AdminFormModal: React.FC<AdminFormModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
}) => {
  React.useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-xl sm:rounded-2xl w-full max-w-2xl sm:max-w-3xl shadow-2xl transform transition-all duration-200 animate-fade-in max-h-[95vh] sm:max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-slate-100 p-4 sm:p-6 flex items-center justify-between z-10 flex-shrink-0">
          <h2 className="text-lg sm:text-2xl font-black text-slate-900 tracking-tight pr-2">
            {title}
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-xl hover:bg-slate-100 transition-colors flex-shrink-0"
          >
            <X size={20} className="text-slate-600" />
          </button>
        </div>

        {/* Content - Scrollable */}
        <div className="flex-1 overflow-y-auto custom-scrollbar p-4 sm:p-6 lg:p-8">
          {children}
        </div>
      </div>
    </div>
  );
};

export default AdminFormModal;
