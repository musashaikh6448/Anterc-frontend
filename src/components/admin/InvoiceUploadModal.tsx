import React, { useState } from 'react';
import { X, Upload, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';
import DocumentUpload from './DocumentUpload';
import { uploadInvoice } from '@/api/adminApi';

interface InvoiceUploadModalProps {
    isOpen: boolean;
    onClose: () => void;
    enquiryId: string;
    onSuccess: () => void;
}

const InvoiceUploadModal: React.FC<InvoiceUploadModalProps> = ({
    isOpen,
    onClose,
    enquiryId,
    onSuccess,
}) => {
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [submitting, setSubmitting] = useState(false);

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!selectedFile) {
            toast.error('Please Select an invoice file');
            return;
        }

        setSubmitting(true);
        try {
            const formData = new FormData();
            formData.append('invoice', selectedFile);

            await uploadInvoice(enquiryId, formData);

            toast.success('Invoice uploaded successfully');
            onSuccess();
            onClose();
            setSelectedFile(null);
        } catch (error: any) {
            console.error('Upload error:', error);
            toast.error(error.response?.data?.message || 'Failed to upload invoice');
        } finally {
            setSubmitting(false);
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
            <div className="relative bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden animate-fade-in">
                {/* Header */}
                <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
                    <h2 className="text-lg font-black text-slate-900">
                        Upload Invoice
                    </h2>
                    <button
                        onClick={onClose}
                        className="p-2 rounded-xl hover:bg-slate-200 transition-colors text-slate-500 hover:text-slate-700"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Content */}
                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    <DocumentUpload
                        value={""} // Value is only for initial preview which we don't have
                        onChange={setSelectedFile}
                        label="Select Invoice Document"
                        maxSize={5}
                    />

                    <button
                        type="submit"
                        disabled={submitting || !selectedFile}
                        className="w-full py-3 bg-slate-900 hover:bg-indigo-600 disabled:bg-slate-300 disabled:cursor-not-allowed text-white font-black text-base rounded-xl transition-all shadow-lg active:scale-[0.98] flex items-center justify-center gap-2"
                    >
                        {submitting ? (
                            <>
                                <div className="w-5 h-5 border-4 border-white/20 border-t-white rounded-full animate-spin"></div>
                                Uploading...
                            </>
                        ) : (
                            <>
                                <Upload size={20} className="stroke-[3]" />
                                Upload Invoice
                            </>
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default InvoiceUploadModal;
