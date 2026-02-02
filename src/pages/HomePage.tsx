import React, { useEffect, useState } from 'react';
import BannerCarousel from '../components/BannerCarousel';
import CategoryCard from '../components/CategoryCard';
import { ShieldCheck, Clock, Phone, Award, Zap, MessageCircle } from 'lucide-react';
import { getAllServices, getAllCategories } from '@/api/serviceApi';
import { Category } from '../types';
import { useTheme } from '../contexts/ThemeContext';

const HomePage: React.FC = () => {
  const { theme } = useTheme();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchServices();
  }, []);

  // Define priority order for categories (most used to least used)
  const fetchServices = async () => {
    try {
      setLoading(true);
      const [{ data: servicesData }, { data: categoriesData }] = await Promise.all([
        getAllServices(),
        getAllCategories()
      ]);

      // Group services by category name
      const serviceMap = new Map<string, any[]>();
      servicesData.forEach((service: any) => {
        if (!serviceMap.has(service.category)) {
          serviceMap.set(service.category, []);
        }
        serviceMap.get(service.category)!.push(service);
      });

      const finalCategories: Category[] = [];
      const processedCategoryNames = new Set<string>();

      // 1. Process DB Categories (Preserve DB Order)
      categoriesData.forEach((cat: any) => {
        const catServicesDocs = serviceMap.get(cat.name) || [];

        // Flatten all sub-services from all Service documents in this category
        const allSubServices = catServicesDocs.flatMap((service: any) =>
          (service.subServices || []).map((subService: any, idx: number) => ({
            id: `${service._id}-${idx}`,
            name: subService.name,
            description: subService.description,
            price: subService.price,
            estimatedTime: '',
            imageUrl: subService.imageUrl,
            issuesResolved: subService.issuesResolved || [],
          }))
        );

        // Determine Category Image: Use DB image, or fallback to first service image
        let catImage = cat.imageUrl;
        if (!catImage && catServicesDocs.length > 0) {
          const serviceWithImage = catServicesDocs.find((s: any) => s.imageUrl);
          if (serviceWithImage) {
            catImage = serviceWithImage.imageUrl;
          }
        }

        finalCategories.push({
          id: cat._id,
          title: cat.name,
          description: cat.description || 'Professional services',
          imageUrl: catImage || '', // Fallback to empty string if no image found at all
          services: allSubServices,
        });
        processedCategoryNames.add(cat.name);
      });

      // 2. Handle Orphaned Categories (Services with categories not in DB)
      // These will be appended at the end
      serviceMap.forEach((services, catName) => {
        if (!processedCategoryNames.has(catName)) {
          const allSubServices = services.flatMap((service: any) =>
            (service.subServices || []).map((subService: any, idx: number) => ({
              id: `${service._id}-${idx}`,
              name: subService.name,
              description: subService.description,
              price: subService.price,
              estimatedTime: '',
              imageUrl: subService.imageUrl,
              issuesResolved: subService.issuesResolved || [],
            }))
          );

          finalCategories.push({
            id: catName.toLowerCase().replace(/\s+/g, '-'),
            title: catName,
            description: services[0]?.description || 'Professional services',
            imageUrl: services[0]?.imageUrl || '',
            services: allSubServices,
          });
        }
      });

      setCategories(finalCategories);
    } catch (error) {
      console.error('Failed to load services:', error);
      setCategories([]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="pb-24 sm:pb-32 overflow-hidden w-full min-h-screen flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="pb-24 sm:pb-32 overflow-hidden w-full">
      {/* Hero Section */}
      <section className="pt-4 sm:pt-8 md:pt-12 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <BannerCarousel />
        </div>
      </section>


      {/* Service Categories Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-10">
          <div className="text-center lg:text-left">
            <div className="inline-flex items-center gap-2 bg-indigo-50 px-4 py-1.5 rounded-full border border-indigo-100">
              <Zap size={14} className="text-indigo-600 fill-indigo-600" />
              <span className="text-indigo-600 font-black text-[10px] uppercase tracking-widest">Premium Categories</span>
            </div>
           
          </div>
        </div>

        <div className="grid grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-x-5 gap-y-10 sm:gap-x-10 sm:gap-y-16">
          {categories.length > 0 ? (
            categories.map((category, idx) => (
              <div key={category.id} className="animate-fade-in flex justify-center">
                <div className="w-full max-w-[340px]">
                  <CategoryCard category={category} />
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <p className="text-slate-500">No services available at the moment.</p>
            </div>
          )}
        </div>
      </section>

      {/* Lead-Gen CTA Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16 sm:py-32">
        <div className="bg-slate-900 rounded-[2.5rem] sm:rounded-[4.5rem] p-8 sm:p-24 text-center relative overflow-hidden group">
          <div
            className="absolute top-0 right-0 w-64 h-64 sm:w-[600px] sm:h-[600px] rounded-full blur-[100px] transition-all duration-1000"
            style={{
              backgroundColor: `${theme?.colors?.primary || '#4f46e5'}1A`
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = `${theme?.colors?.primary || '#4f46e5'}33`;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = `${theme?.colors?.primary || '#4f46e5'}1A`;
            }}
          ></div>

          <div className="relative z-10 max-w-4xl mx-auto space-y-10">
            <h2 className="text-3xl sm:text-5xl lg:text-7xl font-black text-white tracking-tighter leading-tight">
              Facing an <span style={{ color: theme?.colors?.secondary || '#6366f1' }}>Emergency</span> Repair?
            </h2>
            <p className="text-slate-400 text-base sm:text-xl lg:text-2xl font-medium max-w-2xl mx-auto leading-relaxed">
              Call us now or send a WhatsApp message for doorstep service.
            </p>
            <div className="flex flex-row gap-3 sm:gap-6 justify-center pt-6 sm:pt-10">
              <a
                href="tel:+917385650510"
                className="px-6 py-3 sm:px-10 sm:py-5 bg-white text-slate-900 font-black text-sm sm:text-lg rounded-xl sm:rounded-2xl transition-all shadow-xl flex items-center justify-center gap-2 sm:gap-3"
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = theme?.colors?.primary || '#4f46e5';
                  e.currentTarget.style.color = 'white';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'white';
                  e.currentTarget.style.color = '';
                }}
              >
                <Phone size={18} className="sm:w-[22px] sm:h-[22px]" strokeWidth={3} />
                Call Now
              </a>
              <a href="https://wa.me/917385650510" className="px-6 py-3 sm:px-10 sm:py-5 bg-green-500 text-white font-black text-sm sm:text-lg rounded-xl sm:rounded-2xl hover:bg-green-600 transition-all shadow-xl flex items-center justify-center gap-2 sm:gap-3">
                <MessageCircle size={18} className="sm:w-[22px] sm:h-[22px]" strokeWidth={3} />
                WhatsApp
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;