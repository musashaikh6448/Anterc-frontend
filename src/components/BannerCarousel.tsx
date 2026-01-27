
import React, { useState, useEffect } from 'react';
import { BANNERS } from '../constants';
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';
import ImageWithSkeleton from './ImageWithSkeleton';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';

const BannerCarousel: React.FC = () => {
  const [current, setCurrent] = useState(0);
  const navigate = useNavigate();
  const { theme } = useTheme();

  // Use theme banner if available, otherwise use default banners
  const banners = theme?.banner?.imageUrl
    ? [{
        id: 'theme-banner',
        image: theme.banner.imageUrl,
        title: theme.banner.heading || 'Expert Repairs Made Simple',
        subtitle: theme.banner.description || 'Professional AC and appliance solutions',
      }]
    : BANNERS;

  useEffect(() => {
    if (banners.length > 0) {
      setCurrent(0); // Reset to first banner when banners change
      const timer = setInterval(() => {
        setCurrent((prev) => (prev + 1) % banners.length);
      }, 6000);
      return () => clearInterval(timer);
    }
  }, [banners.length, theme?.banner?.imageUrl, theme?.banner?.heading, theme?.banner?.description]);

  const next = () => setCurrent((prev) => (prev + 1) % banners.length);
  const prev = () => setCurrent((prev) => (prev - 1 + banners.length) % banners.length);

  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  // Minimum swipe distance (in px)
  const minSwipeDistance = 50;

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null); // Reset
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => setTouchEnd(e.targetTouches[0].clientX);

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe) {
      next();
    }
    if (isRightSwipe) {
      prev();
    }
  };

  return (
    <div 
      className="relative overflow-hidden rounded-[2rem] sm:rounded-[3rem] h-[300px] sm:h-[450px] lg:h-[550px] shadow-2xl shadow-indigo-100/50 border border-slate-100 touch-pan-y"
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
    >
      <div 
        className="flex transition-transform duration-1000 cubic-bezier(0.4, 0, 0.2, 1) h-full"
        style={{ transform: `translateX(-${current * 100}%)` }}
      >
        {banners.map((banner) => (
          <div key={banner.id} className="min-w-full h-full relative">
            <ImageWithSkeleton 
              src={banner.image} 
              alt={banner.title}
              containerClassName="w-full h-full"
              className="w-full h-full object-cover brightness-[0.6] sm:brightness-[0.7]"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/20 to-transparent"></div>
            
            <div className="absolute inset-0 flex flex-col justify-end sm:justify-center p-6 sm:p-16 lg:px-24 text-white">
              <div className="space-y-3 sm:space-y-6 max-w-2xl text-center sm:text-left">
                {theme?.banner?.tag && (
                  <div 
                    className="inline-flex items-center gap-2 backdrop-blur-md border border-white/20 px-3 py-1 rounded-full mx-auto sm:mx-0"
                    style={{ 
                      backgroundColor: `${theme?.colors?.primary || '#4f46e5'}66`
                    }}
                  >
                    <span 
                      className="w-1.5 h-1.5 rounded-full animate-pulse"
                      style={{ backgroundColor: `${theme?.colors?.primary || '#4f46e5'}CC` }}
                    ></span>
                    <span className="text-[9px] sm:text-xs font-black uppercase tracking-[0.2em] text-white">
                      {theme.banner.tag}
                    </span>
                  </div>
                )}
                <h2 className="text-3xl sm:text-5xl lg:text-7xl font-black tracking-tighter leading-[1.1] sm:leading-[1.05]">
                  {banner.title}
                </h2>
                <p className="text-sm sm:text-lg lg:text-xl font-medium text-slate-200 leading-relaxed max-w-lg mx-auto sm:mx-0 line-clamp-2">
                  {banner.subtitle}
                </p>
                <div className="pt-4 sm:pt-6">
                  <button 
                    onClick={() => navigate('/contact')}
                    className="group w-full sm:w-auto flex items-center justify-center gap-3 px-8 py-4 bg-white text-slate-900 font-black rounded-2xl transition-all transform active:scale-95 shadow-2xl shadow-black/20"
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = theme?.colors?.primary || '#4f46e5';
                      e.currentTarget.style.color = 'white';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'white';
                      e.currentTarget.style.color = '';
                    }}
                  >
                    Request Service
                    <ArrowRight size={20} className="transition-transform group-hover:translate-x-1" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="absolute bottom-6 right-6 sm:bottom-10 sm:right-16 hidden xs:flex items-center gap-2 sm:gap-3">
        <button onClick={prev} className="w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center bg-white/10 backdrop-blur-md border border-white/20 rounded-xl sm:rounded-2xl text-white hover:bg-white hover:text-slate-900 transition-all">
          <ChevronLeft size={20} strokeWidth={2.5} />
        </button>
        <button onClick={next} className="w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center bg-white/10 backdrop-blur-md border border-white/20 rounded-xl sm:rounded-2xl text-white hover:bg-white hover:text-slate-900 transition-all">
          <ChevronRight size={20} strokeWidth={2.5} />
        </button>
      </div>

      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 sm:translate-x-0 sm:bottom-12 sm:left-16 flex gap-2">
        {banners.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrent(idx)}
            className={`transition-all duration-500 rounded-full h-1.5 ${current === idx ? 'bg-white w-8 sm:w-10' : 'bg-white/30 w-1.5'}`}
          />
        ))}
      </div>
    </div>
  );
};

export default BannerCarousel;
