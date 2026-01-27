import React, { useRef, useState, useEffect } from 'react';
import { Upload, X, Image as ImageIcon } from 'lucide-react';

interface ImageUploadProps {
  value: string;
  onChange: (base64: string) => void;
  label?: string;
  aspectRatio?: 'square' | 'auto';
  maxSize?: number; // in MB
  enforceSquare?: boolean;
}

const ImageUpload: React.FC<ImageUploadProps> = ({
  value,
  onChange,
  label = 'Upload Image',
  aspectRatio = 'square',
  maxSize = 2,
  enforceSquare = false,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(value || null);

  useEffect(() => {
    setPreview(value || null);
  }, [value]);

  const createSquareImage = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const size = Math.max(img.width, img.height);
          canvas.width = size;
          canvas.height = size;
          const ctx = canvas.getContext('2d');
          
          if (!ctx) {
            reject(new Error('Could not get canvas context'));
            return;
          }

          // Fill with white background
          ctx.fillStyle = '#ffffff';
          ctx.fillRect(0, 0, size, size);

          // Center the image
          const x = (size - img.width) / 2;
          const y = (size - img.height) / 2;
          ctx.drawImage(img, x, y);

          const base64 = canvas.toDataURL('image/png', 0.9);
          resolve(base64);
        };
        img.onerror = reject;
        img.src = e.target?.result as string;
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }

    // Validate file size
    if (file.size > maxSize * 1024 * 1024) {
      alert(`Image size should be less than ${maxSize}MB`);
      return;
    }

    try {
      let base64String: string;
      
      if (enforceSquare && aspectRatio === 'square') {
        base64String = await createSquareImage(file);
      } else {
        const reader = new FileReader();
        base64String = await new Promise<string>((resolve, reject) => {
          reader.onloadend = () => resolve(reader.result as string);
          reader.onerror = reject;
          reader.readAsDataURL(file);
        });
      }
      
      setPreview(base64String);
      onChange(base64String);
    } catch (error) {
      alert('Failed to process image');
      console.error(error);
    }
  };

  const handleRemove = () => {
    setPreview(null);
    onChange('');
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
        {preview ? (
          <div className="relative group">
            <div className={`${aspectRatio === 'square' ? 'aspect-square max-w-xs' : 'aspect-video'} w-full rounded-xl overflow-hidden border-2 border-slate-200 bg-slate-50 shadow-sm`}>
              <img
                src={preview}
                alt="Preview"
                className="w-full h-full object-contain"
              />
            </div>
            <button
              type="button"
              onClick={handleRemove}
              className="absolute top-2 right-2 p-2 bg-rose-600 text-white rounded-lg hover:bg-rose-700 transition-all shadow-lg"
              title="Remove image"
            >
              <X size={16} />
            </button>
            {aspectRatio === 'square' && (
              <div className="absolute bottom-2 left-2 px-2 py-1 bg-black/60 text-white text-xs font-bold rounded backdrop-blur-sm">
                Square Preview
              </div>
            )}
          </div>
        ) : (
          <div
            onClick={() => fileInputRef.current?.click()}
            className={`${aspectRatio === 'square' ? 'aspect-square max-w-xs' : 'aspect-video'} w-full border-2 border-dashed border-slate-300 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:border-indigo-500 hover:bg-indigo-50/50 transition-all group bg-slate-50`}
          >
            <div className="p-4 bg-slate-100 rounded-xl mb-3 group-hover:bg-indigo-100 transition-all">
              <ImageIcon className="text-slate-400 group-hover:text-indigo-600" size={32} />
            </div>
            <p className="text-sm font-bold text-slate-600 group-hover:text-indigo-600">
              Click to upload
            </p>
            <p className="text-xs text-slate-400 mt-1 text-center px-4">
              {aspectRatio === 'square' 
                ? `Square image recommended (1:1 ratio)\nMax ${maxSize}MB` 
                : `Image (Max ${maxSize}MB)`}
            </p>
          </div>
        )}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          className="hidden"
        />
      </div>
    </div>
  );
};

export default ImageUpload;
