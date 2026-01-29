import React, { useEffect, useState } from 'react';
import BannerCarousel from '../components/BannerCarousel';
import CategoryCard from '../components/CategoryCard';
import { ShieldCheck, Clock, Phone, Award, Zap, MessageCircle } from 'lucide-react';
import { getAllServices } from '@/api/serviceApi';
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
  const getCategoryPriority = (categoryName: string): number => {
    const priorityOrder: Record<string, number> = {
      // High priority - Most commonly used appliances (AC comes first)
      'Air Conditioner': 1,
      'Washing Machine': 2,
      'Refrigerator': 3,
      'Microwave oven': 4,
      'Water Purifier': 5,

      // Medium priority - Frequently used appliances
      'Ceiling & Table Fan': 6,
      'Air Cooler': 7,
      'Water Cooler': 8,
      'Visi Cooler': 9,
      'Electric Induction': 10,

      // Low priority - Less frequently used appliances
      'CCTV Camera': 11,
      'Computer & Laptop': 12,
      'Home theatre/ Sound box': 13,
      'Inverter Batteries': 14,
      'Vacuum cleaner': 15,
      'Deep Freezer': 16,
      'Air Purifier': 17,
    };

    // Return priority if found, otherwise assign a very high number for new/unlisted categories
    return priorityOrder[categoryName] || 999;
  };

  const fetchServices = async () => {
    try {
      setLoading(true);
      const { data } = await getAllServices();

      // Transform services into categories
      const categoryMap = new Map<string, Category>();

      // Category name to ID mapping
      const categoryToId = (name: string): string => {
        const mapping: Record<string, string> = {
          'Air Conditioner': 'air-conditioner',
          'Ceiling & Table Fan': 'ceiling-table-fan',
          'Water Purifier': 'water-purifier',
          'Visi Cooler': 'visi-cooler',
          'Water Cooler': 'water-cooler',
          'Air Cooler': 'air-cooler',
          'CCTV Camera': 'cctv-camera',
          'Computer & Laptop': 'computer-laptop',
          'Microwave oven': 'microwave-oven',
          'Electric Induction': 'electric-induction',
          'Air Purifier': 'air-purifier',
          'Home theatre/ Sound box': 'home-theatre-sound-box',
          'Inverter Batteries': 'inverter-batteries',
          'Vacuum cleaner': 'vacuum-cleaner',
          'Washing Machine': 'washing-machine',
          'Deep Freezer': 'deep-freezer',
          'Refrigerator': 'refrigerator', // Added refrigerator mapping
        };
        return mapping[name] || name.toLowerCase().replace(/\s+/g, '-').replace(/[&/]/g, '-');
      };

      data.forEach((service: any) => {
        if (!categoryMap.has(service.category)) {
          categoryMap.set(service.category, {
            id: categoryToId(service.category),
            title: service.category,
            description: service.description,
            imageUrl: service.imageUrl,
            services: [],
          });
        }

        const category = categoryMap.get(service.category)!;
        // Transform sub-services to services
        const transformedServices = (service.subServices || []).map((subService: any, idx: number) => ({
          id: `${service._id}-${idx}`,
          name: subService.name,
          description: subService.description,
          price: subService.price,
          estimatedTime: '',
          imageUrl: subService.imageUrl,
          issuesResolved: subService.issuesResolved || [],
        }));

        category.services.push(...transformedServices);
      });

      // Convert Map to array and sort by priority
      const categoriesArray = Array.from(categoryMap.values());
      const sortedCategories = categoriesArray.sort((a, b) => {
        const priorityA = getCategoryPriority(a.title);
        const priorityB = getCategoryPriority(b.title);
        return priorityA - priorityB; // Lower number = higher priority
      });

      setCategories(sortedCategories);
    } catch (error) {
      console.error('Failed to load services:', error);
      // Fallback to empty array
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

      {/* Trust Badges */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-20 md:py-24">
        <div className="grid grid-cols-4 gap-1.5 sm:gap-8">
          {[
            { icon: <ShieldCheck />, title: "Certified Pro", sub: "Nanded Verified" },
            { icon: <Phone />, title: "Call Anytime", sub: "Instant Response" },
            { icon: <Award />, title: "Genuine Parts", sub: "90-Day Warranty" }
          ].map((item, idx) => (
            <div
              key={idx}
              className="flex flex-col items-center sm:items-start text-center sm:text-left gap-2 sm:gap-4 p-2 sm:p-8 bg-white border border-slate-100 rounded-2xl sm:rounded-[2rem] hover:shadow-xl transition-all group"
            >
              <div className="w-8 h-8 sm:w-14 sm:h-14 bg-slate-50 rounded-lg sm:rounded-2xl flex items-center justify-center text-slate-400 group-hover:bg-indigo-600 group-hover:text-white transition-all duration-500">
                <div className="sm:hidden">
                  {React.cloneElement(item.icon as React.ReactElement<any>, {
                    size: 14,
                    strokeWidth: 2.5
                  })}
                </div>
                <div className="hidden sm:block">
                  {React.cloneElement(item.icon as React.ReactElement<any>, {
                    size: 24,
                    strokeWidth: 2.5
                  })}
                </div>
              </div>
              <div className="space-y-0.5 sm:space-y-1 w-full">
                <h4 className="font-black text-slate-900 tracking-tight text-[9px] sm:text-base leading-tight truncate w-full">
                  {item.title}
                </h4>
                <p className="text-[7px] sm:text-[11px] text-slate-400 font-bold uppercase tracking-widest truncate w-full">
                  {item.sub}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Service Categories Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-12 sm:mb-20">
          <div className="space-y-4 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 bg-indigo-50 px-4 py-1.5 rounded-full border border-indigo-100">
              <Zap size={14} className="text-indigo-600 fill-indigo-600" />
              <span className="text-indigo-600 font-black text-[10px] uppercase tracking-widest">Premium Care</span>
            </div>
            <h2 className="text-4xl sm:text-5xl lg:text-7xl font-black text-slate-900 tracking-tighter leading-[1.05]">
              Expert repairs <br className="hidden sm:block" /> <span className="text-slate-400">made simple.</span>
            </h2>
          </div>
          <p className="text-slate-500 max-w-sm text-base sm:text-lg font-medium leading-relaxed text-center lg:text-left mx-auto lg:mx-0">
            Professional AC and appliance solutions delivered by expert technicians at your doorstep in Nanded.
          </p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-5 gap-y-10 sm:gap-x-10 sm:gap-y-16">
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
              Call us now or send a WhatsApp message for 24/7 doorstep service in Nanded.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center pt-6 sm:pt-10">
              <a
                href="tel:+917385650510"
                className="px-10 py-5 bg-white text-slate-900 font-black text-lg rounded-2xl transition-all shadow-2xl flex items-center justify-center gap-3"
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = theme?.colors?.primary || '#4f46e5';
                  e.currentTarget.style.color = 'white';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'white';
                  e.currentTarget.style.color = '';
                }}
              >
                <Phone size={22} strokeWidth={3} />
                Call Now
              </a>
              <a href="https://wa.me/917385650510" className="px-10 py-5 bg-green-500 text-white font-black text-lg rounded-2xl hover:bg-green-600 transition-all shadow-2xl flex items-center justify-center gap-3">
                <MessageCircle size={22} strokeWidth={3} />
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