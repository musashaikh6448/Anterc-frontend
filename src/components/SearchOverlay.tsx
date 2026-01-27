
import React, { useState, useEffect, useRef } from 'react';
import { Search, X, ArrowRight, Zap, TrendingUp, Sparkles, AlertCircle, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { searchServices } from '@/api/searchApi';
import { useTheme } from '@/contexts/ThemeContext';

interface SearchOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

const SearchOverlay: React.FC<SearchOverlayProps> = ({ isOpen, onClose }) => {
  const { theme } = useTheme();
  const [query, setQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [debounceTimer, setDebounceTimer] = useState<NodeJS.Timeout | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
      setQuery('');
      setSearchResults(null);
    }
  }, [isOpen]);

  useEffect(() => {
    // Clear previous timer
    if (debounceTimer) {
      clearTimeout(debounceTimer);
    }

    if (query.trim().length === 0) {
      setSearchResults(null);
      setLoading(false);
      return;
    }

    // Debounce search
    setLoading(true);
    const timer = setTimeout(async () => {
      try {
        const { data } = await searchServices(query);
        setSearchResults(data);
      } catch (error) {
        console.error('Search error:', error);
        setSearchResults({ services: [], categories: [], subServices: [] });
      } finally {
        setLoading(false);
      }
    }, 300);

    setDebounceTimer(timer);

    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [query]);

  const hasResults = searchResults && (
    (searchResults.services?.length > 0) ||
    (searchResults.categories?.length > 0) ||
    (searchResults.subServices?.length > 0)
  );

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex flex-col">
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-xl transition-opacity animate-in fade-in" onClick={onClose} />
      
      <div className="relative w-full max-w-3xl mx-auto mt-4 sm:mt-20 px-4 animate-in slide-in-from-top-8">
        <div className="bg-white rounded-[2.5rem] shadow-2xl overflow-hidden border border-slate-200">
          <div className="flex items-center gap-4 px-6 sm:px-8 py-6 border-b border-slate-100">
            <Search className="text-indigo-600" size={24} strokeWidth={3} />
            <input 
              ref={inputRef}
              type="text"
              placeholder="Search for AC service, TV repair..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="flex-1 bg-transparent border-none outline-none text-lg sm:text-xl font-bold text-slate-900"
            />
            <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-xl text-slate-400">
              <X size={24} />
            </button>
          </div>

          <div className="max-h-[70vh] overflow-y-auto p-6 sm:p-8 custom-scrollbar">
            {query.length === 0 ? (
              <div className="space-y-8">
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <TrendingUp size={16} style={{ color: theme?.colors?.primary || '#4f46e5' }} />
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Popular Searches</p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {['AC Deep Cleaning', 'AC Service Nanded', 'Washing Machine Repair', 'TV Repair'].map((item) => (
                      <button 
                        key={item}
                        onClick={() => setQuery(item)}
                        className="px-4 py-2 bg-slate-50 border border-slate-100 rounded-xl text-sm font-bold text-slate-600 transition-all"
                        style={{
                          '--hover-bg': theme?.colors?.primary ? `${theme.colors.primary}10` : '#eef2ff',
                          '--hover-text': theme?.colors?.primary || '#4f46e5'
                        } as React.CSSProperties}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = theme?.colors?.primary ? `${theme.colors.primary}10` : '#eef2ff';
                          e.currentTarget.style.color = theme?.colors?.primary || '#4f46e5';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = '';
                          e.currentTarget.style.color = '';
                        }}
                      >
                        {item}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            ) : loading ? (
              <div className="py-20 text-center">
                <Loader2 className="mx-auto mb-4 animate-spin" size={32} style={{ color: theme?.colors?.primary || '#4f46e5' }} />
                <p className="font-bold text-slate-900 text-lg">Searching...</p>
              </div>
            ) : (
              <div className="space-y-8">
                {/* Categories */}
                {searchResults?.categories && searchResults.categories.length > 0 && (
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 px-2">Categories</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {searchResults.categories.map((cat: any) => (
                        <Link 
                          key={cat.id} 
                          to={`/category/${cat.id}`} 
                          onClick={onClose} 
                          className="flex items-center gap-4 p-4 rounded-2xl hover:bg-slate-50 border border-transparent hover:border-slate-100 group transition-all"
                        >
                          {cat.imageUrl && (
                            <img src={cat.imageUrl} className="w-12 h-12 rounded-xl object-cover" alt={cat.title} />
                          )}
                          <div className="flex-1">
                            <p 
                              className="font-bold text-slate-900 transition-colors"
                              style={{ color: 'inherit' }}
                              onMouseEnter={(e) => {
                                e.currentTarget.style.color = theme?.colors?.primary || '#4f46e5';
                              }}
                              onMouseLeave={(e) => {
                                e.currentTarget.style.color = '';
                              }}
                            >
                              {cat.title}
                            </p>
                            <p className="text-[10px] text-slate-400 font-medium">Verified Pros</p>
                          </div>
                          <ArrowRight 
                            size={16} 
                            className="text-slate-200 transition-colors"
                            style={{ color: 'inherit' }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.color = theme?.colors?.primary || '#4f46e5';
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.color = '';
                            }}
                          />
                        </Link>
                      ))}
                    </div>
                  </div>
                )}

                {/* Sub-Services */}
                {searchResults?.subServices && searchResults.subServices.length > 0 && (
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 px-2">Services</p>
                    <div className="grid grid-cols-1 gap-2">
                      {searchResults.subServices.map((service: any) => (
                        <Link 
                          key={service.serviceId} 
                          to={`/enquiry/${service.categoryId}/${service.serviceId}`} 
                          onClick={onClose} 
                          className="flex items-center gap-4 p-4 rounded-2xl bg-white border border-slate-100 hover:border-slate-200 group transition-all"
                        >
                          <div 
                            className="w-10 h-10 rounded-xl flex items-center justify-center"
                            style={{ 
                              backgroundColor: theme?.colors?.primary ? `${theme.colors.primary}10` : '#eef2ff',
                              color: theme?.colors?.primary || '#4f46e5'
                            }}
                          >
                            <Zap size={20} />
                          </div>
                          <div className="flex-1">
                            <p 
                              className="font-bold text-slate-900 transition-colors"
                              onMouseEnter={(e) => {
                                e.currentTarget.style.color = theme?.colors?.primary || '#4f46e5';
                              }}
                              onMouseLeave={(e) => {
                                e.currentTarget.style.color = '';
                              }}
                            >
                              {service.subServiceName}
                            </p>
                            <p className="text-xs text-slate-400 font-medium line-clamp-1">
                              {service.serviceName} • {service.category}
                            </p>
                            {service.price && (
                              <p className="text-xs font-bold mt-1" style={{ color: theme?.colors?.primary || '#4f46e5' }}>
                                ₹{service.price}
                              </p>
                            )}
                          </div>
                          <ArrowRight 
                            size={16} 
                            className="text-slate-200 transition-colors"
                            onMouseEnter={(e) => {
                              e.currentTarget.style.color = theme?.colors?.primary || '#4f46e5';
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.color = '';
                            }}
                          />
                        </Link>
                      ))}
                    </div>
                  </div>
                )}

                {/* Services */}
                {searchResults?.services && searchResults.services.length > 0 && (
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 px-2">Service Categories</p>
                    <div className="grid grid-cols-1 gap-2">
                      {searchResults.services.map((service: any) => (
                        <Link 
                          key={service._id} 
                          to={`/category/${service.categoryId}`} 
                          onClick={onClose} 
                          className="flex items-center gap-4 p-4 rounded-2xl bg-white border border-slate-100 hover:border-slate-200 group transition-all"
                        >
                          {service.imageUrl && (
                            <img src={service.imageUrl} className="w-12 h-12 rounded-xl object-cover" alt={service.title} />
                          )}
                          <div className="flex-1">
                            <p 
                              className="font-bold text-slate-900 transition-colors"
                              onMouseEnter={(e) => {
                                e.currentTarget.style.color = theme?.colors?.primary || '#4f46e5';
                              }}
                              onMouseLeave={(e) => {
                                e.currentTarget.style.color = '';
                              }}
                            >
                              {service.title}
                            </p>
                            <p className="text-xs text-slate-400 font-medium line-clamp-1">{service.description}</p>
                          </div>
                          <ArrowRight 
                            size={16} 
                            className="text-slate-200 transition-colors"
                            onMouseEnter={(e) => {
                              e.currentTarget.style.color = theme?.colors?.primary || '#4f46e5';
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.color = '';
                            }}
                          />
                        </Link>
                      ))}
                    </div>
                  </div>
                )}

                {!hasResults && !loading && (
                  <div className="py-20 text-center">
                    <AlertCircle className="text-rose-400 mx-auto mb-4" size={32} />
                    <p className="font-bold text-slate-900 text-lg">No results for "{query}"</p>
                    <p className="text-sm text-slate-500 mt-2">Try searching with different keywords</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchOverlay;
