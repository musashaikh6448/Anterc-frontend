import React, { useRef, useState, useEffect } from 'react';
import { Upload, X, FileText, Image as ImageIcon } from 'lucide-react';

interface DocumentUploadProps {
    value: string; // URL for preview
    onChange: (file: File | null) => void;
    label?: string;
    maxSize?: number; // in MB
}

const DocumentUpload: React.FC<DocumentUploadProps> = ({
    value,
    onChange,
    label = 'Upload Invoice',
    maxSize = 5,
}) => {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [preview, setPreview] = useState<string | null>(value || null);
    const [fileType, setFileType] = useState<'image' | 'pdf' | null>(null);
    const [fileName, setFileName] = useState<string>('');

    useEffect(() => {
        setPreview(value || null);
        if (value) {
            if (value.startsWith('data:application/pdf') || value.toLowerCase().endsWith('.pdf')) {
                setFileType('pdf');
            } else {
                setFileType('image');
            }
        } else {
            setFileType(null);
        }
    }, [value]);

    const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Validate file type
        if (!file.type.startsWith('image/') && file.type !== 'application/pdf') {
            alert('Please select an image or PDF file');
            return;
        }

        // Validate file size
        if (file.size > maxSize * 1024 * 1024) {
            alert(`File size should be less than ${maxSize}MB`);
            return;
        }

        setFileName(file.name);

        try {
            const reader = new FileReader();
            const base64String = await new Promise<string>((resolve, reject) => {
                reader.onloadend = () => resolve(reader.result as string);
                reader.onerror = reject;
                reader.readAsDataURL(file);
            });

            setPreview(base64String);
            setFileType(file.type === 'application/pdf' ? 'pdf' : 'image');
            onChange(file);
        } catch (error) {
            alert('Failed to process file');
            console.error(error);
        }
    };

    const handleRemove = () => {
        setPreview(null);
        setFileType(null);
        setFileName('');
        onChange(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    return (
        <div className="space-y-3">
            {label && (
                <label className="block text-sm font-bold text-slate-700 mb-2">{label}</label>
            )}
            <div className="relative">
                {preview && fileType ? (
                    <div className="relative group">
                        <div className="w-full h-48 rounded-xl overflow-hidden border-2 border-slate-200 bg-slate-50 shadow-sm flex items-center justify-center">
                            {fileType === 'image' ? (
                                <img
                                    src={preview}
                                    alt="Invoice Preview"
                                    className="w-full h-full object-contain"
                                />
                            ) : (
                                <div className="flex flex-col items-center justify-center p-4 text-center">
                                    <FileText size={48} className="text-rose-500 mb-2" />
                                    <p className="text-sm font-bold text-slate-700 max-w-[200px] truncate">
                                        {fileName || 'PDF Document'}
                                    </p>
                                    <p className="text-xs text-slate-400 mt-1">PDF File</p>
                                </div>
                            )}
                        </div>
                        <button
                            type="button"
                            onClick={handleRemove}
                            className="absolute top-2 right-2 p-2 bg-rose-600 text-white rounded-lg hover:bg-rose-700 transition-all shadow-lg"
                            title="Remove document"
                        >
                            <X size={16} />
                        </button>
                    </div>
                ) : (
                    <div
                        onClick={() => fileInputRef.current?.click()}
                        className="w-full h-48 border-2 border-dashed border-slate-300 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:border-indigo-500 hover:bg-indigo-50/50 transition-all group bg-slate-50"
                    >
                        <div className="p-4 bg-slate-100 rounded-xl mb-3 group-hover:bg-indigo-100 transition-all">
                            <Upload className="text-slate-400 group-hover:text-indigo-600" size={32} />
                        </div>
                        <p className="text-sm font-bold text-slate-600 group-hover:text-indigo-600">
                            Click to upload Invoice
                        </p>
                        <p className="text-xs text-slate-400 mt-1 text-center px-4">
                            PDF or Image (Max {maxSize}MB)
                        </p>
                    </div>
                )}
                <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*,application/pdf"
                    onChange={handleFileSelect}
                    className="hidden"
                />
            </div>
        </div>
    );
};

export default DocumentUpload;
