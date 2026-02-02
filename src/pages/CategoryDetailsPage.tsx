
import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ChevronLeft, ArrowRight, Star, HelpCircle, BadgeCheck, ChevronDown, CheckCircle2 } from 'lucide-react';
import ImageWithSkeleton from '../components/ImageWithSkeleton';
import { getServicesByCategory, getAllCategories } from '@/api/serviceApi';

// ... (keep component start)

// Helper function to generate slug from name (consistent with HomePage)
const generateSlug = (name: string): string => {
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
    'Home theatre/ Sound box': 'home-theatre-sound-box',
    'Inverter Batteries': 'inverter-batteries',
    'Vacuum cleaner': 'vacuum-cleaner',
    'Washing Machine': 'washing-machine',
    'Deep Freezer': 'deep-freezer',
    'Refrigerator': 'refrigerator',
  };
  return mapping[name] || name.toLowerCase().replace(/\s+/g, '-').replace(/[&/]/g, '-');
};

const CategoryDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [category, setCategory] = useState<any>(null);
  const [services, setServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedServiceId, setExpandedServiceId] = useState<string | null>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    if (id) {
      fetchCategoryServices();
    }
  }, [id]);

  const fetchCategoryServices = async () => {
    if (!id) return;

    try {
      setLoading(true);

      // 1. Fetch all categories to find the matching one by ID (slug)
      let matchedCategoryName = '';
      let matchedCategoryDetails: any = null;

      try {
        const { data: allCategories } = await getAllCategories();
        const matched = allCategories.find((cat: any) =>
          cat._id === id || generateSlug(cat.name) === id
        );
        if (matched) {
          matchedCategoryName = matched.name;
          matchedCategoryDetails = matched; // contains description, imageUrl from DB
        }
      } catch (err) {
        console.error("Failed to fetch dynamic categories", err);
      }

      // 2. Fallback to legacy slug parsing if not found in DB
      if (!matchedCategoryName) {
        const categoryNameMap: Record<string, string> = {
          'air-conditioner': 'Air Conditioner',
          'ceiling-table-fan': 'Ceiling & Table Fan',
          'water-purifier': 'Water Purifier',
          'visi-cooler': 'Visi Cooler',
          'water-cooler': 'Water Cooler',
          'air-cooler': 'Air Cooler',
          'cctv-camera': 'CCTV Camera',
          'computer-laptop': 'Computer & Laptop',
          'microwave-oven': 'Microwave oven',
          'electric-induction': 'Electric Induction',
          'air-purifier': 'Air Purifier',
          'home-theatre-sound-box': 'Home theatre/ Sound box',
          'inverter-batteries': 'Inverter Batteries',
          'vacuum-cleaner': 'Vacuum cleaner',
          'washing-machine': 'Washing Machine',
          'deep-freezer': 'Deep Freezer',
        };
        matchedCategoryName = categoryNameMap[id] ||
          id.split('-')
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
      }

      console.log(`Fetching services for: ${matchedCategoryName}`);

      const { data } = await getServicesByCategory(matchedCategoryName);

      if (data.length > 0) {
        // Use DB details if available, otherwise first service details
        const firstService = data[0];
        setCategory({
          id: id,
          title: matchedCategoryDetails?.name || firstService.category,
          description: matchedCategoryDetails?.description || firstService.description,
          imageUrl: matchedCategoryDetails?.imageUrl || firstService.imageUrl,
        });

        // Flatten sub-services from all services in this category
        const allSubServices: any[] = [];
        data.forEach((service: any) => {
          (service.subServices || []).forEach((subService: any, idx: number) => {
            allSubServices.push({
              id: `${service._id}-${idx}`, // Format: serviceId-subIndex
              name: subService.name,
              description: subService.description,
              price: subService.price,
              actualPrice: subService.actualPrice, // Add actualPrice mapping
              estimatedTime: '',
              imageUrl: subService.imageUrl,
              issuesResolved: subService.issuesResolved || [],
              mainServiceId: service._id, // Keep reference to main service
            });
          });
        });

        setServices(allSubServices);
      } else {
        // If no services, but we have category details (from DB), show them?
        // For now, if no services, we consider "Category not found" or empty.
        if (matchedCategoryDetails) {
          setCategory({
            id: id,
            title: matchedCategoryDetails.name,
            description: matchedCategoryDetails.description,
            imageUrl: matchedCategoryDetails.imageUrl
          });
        }
      }
    } catch (error) {
      console.error('Failed to load category services:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="pb-24 sm:pb-40 bg-white min-h-screen flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!category) {
    return (
      <div className="pb-24 sm:pb-40 bg-white min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-slate-500 mb-4">Category not found</p>
          <Link to="/" className="text-indigo-600 font-bold hover:underline">
            Go back to home
          </Link>
        </div>
      </div>
    );
  }

  const toggleExpand = (serviceId: string) => {
    setExpandedServiceId(expandedServiceId === serviceId ? null : serviceId);
  };

  return (
    <div className="pb-24 sm:pb-40 bg-white min-h-screen">
      <div className="bg-slate-50/50 border-b border-slate-100 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 py-12 sm:py-24 relative z-10">
          <Link to="/" className="inline-flex items-center gap-2 text-slate-400 hover:text-indigo-600 transition-all mb-8 sm:mb-12 font-black text-[10px] uppercase tracking-[0.3em]">
            <ChevronLeft size={16} strokeWidth={3} />
            Back to Categories
          </Link>

          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 sm:gap-12">
            <div className="max-w-3xl space-y-4 sm:space-y-6">

              <h1 className="text-4xl sm:text-6xl lg:text-8xl font-black text-slate-900 tracking-tighter leading-[1]">
                {category.title}
              </h1>
              <p className="text-base sm:text-xl lg:text-2xl text-slate-500 font-medium max-w-xl leading-relaxed">
                {category.description}
              </p>
            </div>


          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12 sm:py-32">
        <div className="flex items-center justify-between mb-8 sm:mb-16 px-1">
          <h2 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Services ({services.length})</h2>
          <Link to="/contact" className="flex items-center gap-2 text-indigo-600 font-black text-[10px] uppercase tracking-widest">
            Custom Quote <HelpCircle size={14} />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {services.length > 0 ? (
            services.map((service) => {
              const isExpanded = expandedServiceId === service.id;
              return (
                <div
                  key={service.id}
                  className={`group relative bg-white rounded-[2rem] sm:rounded-[2.5rem] p-4 sm:p-6 border transition-all duration-700 ${isExpanded ? 'border-indigo-200 shadow-2xl' : 'border-slate-100 hover:border-indigo-100'}`}
                >
                  <div className="flex flex-row gap-4 sm:gap-6 cursor-pointer items-stretch" onClick={() => toggleExpand(service.id)}>
                    <div className="w-28 sm:w-40 xl:w-48 rounded-[1.2rem] sm:rounded-[2rem] overflow-hidden shrink-0 shadow-lg self-stretch relative">
                      <ImageWithSkeleton
                        src={service.imageUrl}
                        alt={service.name}
                        className="w-full h-full object-cover absolute inset-0"
                        containerClassName="h-full w-full"
                      />
                    </div>
                    <div className="flex flex-col justify-between flex-1 py-1">
                      <div className="space-y-2">
                        <div className="flex items-start justify-between gap-2">
                          <h3 className="text-lg sm:text-2xl font-black text-slate-900 group-hover:text-indigo-600 transition-colors tracking-tighter leading-tight">
                            {service.name}
                          </h3>
                          <ChevronDown size={18} className={`transition-transform duration-500 shrink-0 mt-1 ${isExpanded ? 'rotate-180' : ''}`} />
                        </div>
                        <p className={`text-slate-500 text-xs sm:text-sm font-medium leading-relaxed transition-all duration-300 ${isExpanded ? 'line-clamp-none' : 'line-clamp-2 sm:line-clamp-none'}`}>
                          {service.description}
                        </p>
                      </div>

                      <div className="mt-4 sm:mt-8 flex items-center justify-between border-t border-slate-50 pt-4 sm:pt-6">
                        <div className="flex flex-col">
                          {service.actualPrice && (
                            <span className="text-xs text-slate-400 line-through decoration-rose-500/50 decoration-2 font-medium">₹{service.actualPrice}</span>
                          )}
                          {service.price && (
                            <span className="text-xl sm:text-2xl font-black text-slate-900">₹{service.price}</span>
                          )}
                        </div>

                        <Link
                          to={`/enquiry/${category.id}/${service.id}`}
                          onClick={(e) => {
                            e.stopPropagation();
                          }}
                          className="px-6 py-3 sm:px-8 sm:py-4 bg-slate-900 text-white font-black text-[10px] sm:text-xs rounded-2xl hover:bg-indigo-600 transition-all shadow-xl"
                        >
                          Request Service
                        </Link>
                      </div>
                    </div>
                  </div>

                  <div className={`overflow-hidden transition-all duration-700 ${isExpanded ? 'max-h-[500px] opacity-100 mt-8' : 'max-h-0 opacity-0'}`}>
                    <div className="bg-slate-50/50 rounded-[2rem] p-6 sm:p-8 space-y-6 border border-slate-100">
                      <div className="space-y-4">
                        <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">What we resolve</h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          {service.issuesResolved?.map((issue, i) => (
                            <div key={i} className="flex items-start gap-2">
                              <CheckCircle2 size={16} className="text-emerald-500 shrink-0" />
                              <span className="text-[13px] font-bold text-slate-600">{issue}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                      <Link to="/contact" className="w-full py-4 bg-indigo-50 text-indigo-600 font-black text-[12px] rounded-xl flex items-center justify-center gap-2">
                        Get Instant Callback <ArrowRight size={16} />
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="col-span-full text-center py-12">
              <p className="text-slate-500">No services available for this category.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CategoryDetailsPage;
