
import React, { useState, useEffect } from 'react';
import { getAllGalleryImages } from '@/api/galleryApi';
import ImageWithSkeleton from '../components/ImageWithSkeleton';

const GalleryPage: React.FC = () => {
  const [images, setImages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchGallery();
  }, []);

  const fetchGallery = async () => {
    try {
      setLoading(true);
      const { data } = await getAllGalleryImages();
      setImages(data);
    } catch (error) {
      console.error('Failed to load gallery:', error);
      setImages([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pb-24 sm:pb-32 w-full">
      <section className="bg-slate-50 py-16 sm:py-24 border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="max-w-3xl space-y-4">
            <span className="text-indigo-600 font-black text-xs uppercase tracking-[0.3em]">Our Work</span>
            <h1 className="text-4xl sm:text-6xl lg:text-8xl font-black text-slate-900 tracking-tighter leading-[1]">Project Gallery</h1>
            <p className="text-lg text-slate-500 font-medium">Real results from our verified technicians in Nanded.</p>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16 sm:py-32">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : images.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {images.map((image) => (
              <div key={image._id} className="group overflow-hidden rounded-[2.5rem] bg-slate-100 aspect-[4/5] shadow-lg border border-slate-100">
                <ImageWithSkeleton 
                  src={image.imageUrl} 
                  alt={image.title || `Gallery image ${image._id}`} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                {image.title && (
                  <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/60 to-transparent">
                    <p className="text-white font-bold text-sm">{image.title}</p>
                    {image.description && (
                      <p className="text-white/80 text-xs mt-1">{image.description}</p>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <p className="text-slate-500 font-medium">No gallery images available</p>
          </div>
        )}
      </section>
    </div>
  );
};

export default GalleryPage;
