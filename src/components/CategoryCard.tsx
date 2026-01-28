import React from 'react';
import { Link } from 'react-router-dom';
import { Category } from '../types';
import { Plus, ArrowUpRight } from 'lucide-react';
import ImageWithSkeleton from './ImageWithSkeleton';

interface CategoryCardProps {
  category: Category;
}

const CategoryCard: React.FC<CategoryCardProps> = ({ category }) => {
  return (
    <Link 
      to={`/category/${category.id}`}
      className="group relative block w-full outline-none"
    >
      {/* Main Card Container */}
      <div className="relative overflow-hidden rounded-[2rem] sm:rounded-[2.5rem] aspect-square bg-white transition-all duration-700 ease-[cubic-bezier(0.23, 1, 0.32, 1)] group-hover:-translate-y-4 group-hover:shadow-[0_32px_64px_-16px_rgba(79,70,229,0.2)] border border-slate-100 group-active:scale-95 group-focus-visible:ring-4 group-focus-visible:ring-indigo-500/20">
        
        {/* Image Component */}
        <ImageWithSkeleton 
          src={category.imageUrl} 
          alt={category.title}
          containerClassName="w-full h-full"
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-1000 ease-out transform group-hover:scale-110"
        />
        
        {/* Hover Overlays */}
        {/* 1. Subtle Dark Gradient (Bottom) */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent opacity-40 group-hover:opacity-60 transition-opacity duration-500" />
        
        {/* 2. Indigo Tint on Hover */}
        <div className="absolute inset-0 bg-indigo-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

        {/* Dynamic Action Button (Top Right) */}
        <div className="absolute top-4 right-4 sm:top-5 sm:right-5">
          <div className="bg-white/95 backdrop-blur-md text-indigo-600 w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl flex items-center justify-center shadow-xl transform translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 cubic-bezier(0.19, 1, 0.22, 1)">
            <ArrowUpRight size={20} strokeWidth={3} className="transition-transform duration-500 group-hover:rotate-12" />
          </div>
        </div>

        {/* Content for Desktop Overlay (Hidden on Mobile for cleanliness) */}
        <div className="absolute bottom-6 left-6 right-6 hidden sm:block transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 delay-75">
          <p className="text-white/80 text-[10px] font-black uppercase tracking-[0.2em] mb-1">Explore</p>
          <h3 className="text-white font-black text-xl tracking-tight">
            {category.title}
          </h3>
        </div>
      </div>

      {/* Label section below card (Standard layout for Category grids) */}
      <div className="mt-4 sm:mt-6 text-center sm:text-left space-y-1 transition-transform duration-500 group-hover:translate-x-1">
        <h3 className="font-black text-slate-900 text-base sm:text-lg tracking-tight group-hover:text-indigo-600 transition-colors">
          {category.title}
        </h3>
        <div className="flex items-center justify-center sm:justify-start gap-2">
           <span className="w-1 h-1 rounded-full bg-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity"></span>
           <p className="text-[10px] sm:text-[11px] text-slate-400 font-bold uppercase tracking-widest group-hover:text-slate-500 transition-colors">
            {category.services.length} Premium Services
          </p>
        </div>
      </div>
    </Link>
  );
};

export default CategoryCard;