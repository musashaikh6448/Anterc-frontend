import React, { useEffect } from 'react';
import { X, AlertTriangle, CheckCircle2, Info, AlertCircle } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  message: string;
  type?: 'confirm' | 'success' | 'error' | 'info';
  onConfirm?: () => void;
  confirmText?: string;
  cancelText?: string;
  children?: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  message,
  type = 'confirm',
  onConfirm,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  children,
}) => {
  useEffect(() => {
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

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <CheckCircle2 className="text-emerald-600" size={24} />;
      case 'error':
        return <AlertCircle className="text-rose-600" size={24} />;
      case 'info':
        return <Info className="text-indigo-600" size={24} />;
      default:
        return <AlertTriangle className="text-amber-600" size={24} />;
    }
  };

  const getIconBg = () => {
    switch (type) {
      case 'success':
        return 'bg-emerald-50';
      case 'error':
        return 'bg-rose-50';
      case 'info':
        return 'bg-indigo-50';
      default:
        return 'bg-amber-50';
    }
  };

  const getButtonColor = () => {
    switch (type) {
      case 'success':
        return 'bg-emerald-600 hover:bg-emerald-700';
      case 'error':
        return 'bg-rose-600 hover:bg-rose-700';
      case 'info':
        return 'bg-indigo-600 hover:bg-indigo-700';
      default:
        return 'bg-slate-900 hover:bg-indigo-600';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-2xl sm:rounded-[2.5rem] w-full max-w-md shadow-2xl transform transition-all duration-200 animate-fade-in">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-xl hover:bg-slate-100 transition-colors z-10"
        >
          <X size={20} className="text-slate-600" />
        </button>

        {/* Content */}
        <div className="p-6 sm:p-8">
          {/* Icon */}
          <div className={`w-14 h-14 ${getIconBg()} rounded-2xl flex items-center justify-center mb-6 mx-auto`}>
            {getIcon()}
          </div>

          {/* Title */}
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 text-center mb-3 tracking-tight">
            {title}
          </h2>

          {/* Message */}
          <p className="text-slate-600 text-center mb-6 font-medium leading-relaxed">
            {message}
          </p>

          {/* Children Content (for forms) */}
          {children && <div className="mb-6">{children}</div>}

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3">
            {onConfirm && (
              <button
                onClick={() => {
                  onConfirm();
                  if (type === 'confirm') {
                    onClose();
                  }
                }}
                className={`flex-1 px-6 py-3 ${getButtonColor()} text-white rounded-xl font-black transition-all shadow-lg`}
              >
                {confirmText}
              </button>
            )}
            <button
              onClick={onClose}
              className={`flex-1 px-6 py-3 ${
                onConfirm
                  ? 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  : getButtonColor() + ' text-white'
              } rounded-xl font-bold transition-all`}
            >
              {onConfirm ? cancelText : 'Close'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Modal;
