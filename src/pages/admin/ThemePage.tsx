import React, { useState, useEffect } from 'react';
import { Palette, Upload, Image as ImageIcon, Save, Sparkles, X, Plus, Trash2, Edit, RotateCcw } from 'lucide-react';
import { toast } from 'sonner';
import { getAllThemes, updateTheme } from '@/api/adminApi';
import { getAllGalleryImagesAdmin, createGalleryImage, updateGalleryImage, deleteGalleryImage } from '@/api/adminApi';
import ImageUpload from '@/components/admin/ImageUpload';
import Modal from '@/components/admin/Modal';
import Pagination from '@/components/admin/Pagination';
import { useTheme } from '@/contexts/ThemeContext';

const ThemePage: React.FC = () => {
  const { refreshTheme } = useTheme();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [theme, setTheme] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<'logo' | 'colors' | 'banner' | 'gallery'>('logo');
  const [expandedColorSection, setExpandedColorSection] = useState<string>('brand');
  
  // Logo state
  const [logoData, setLogoData] = useState({
    imageUrl: '',
    text: '',
    subText: '',
  });

  // Colors state - Comprehensive color system
  const defaultColors = {
    // Brand Colors
    primary: '#4f46e5',
    secondary: '#6366f1',
    
    // Background Colors
    background: '#fcfdfe',
    backgroundSecondary: '#f8fafc',
    backgroundDark: '#0f172a',
    
    // Text Colors
    textPrimary: '#0f172a',
    textSecondary: '#64748b',
    textLight: '#ffffff',
    
    // Border Colors
    border: '#e2e8f0',
    borderLight: '#f1f5f9',
    
    // Accent Colors
    accent: '#6366f1',
    accentHover: '#4f46e5',
    
    // Status Colors
    success: '#10b981',
    error: '#ef4444',
    warning: '#f59e0b',
    info: '#3b82f6',
    
    // Button Colors
    buttonPrimary: '#4f46e5',
    buttonPrimaryHover: '#4338ca',
    buttonSecondary: '#6366f1',
    buttonSecondaryHover: '#4f46e5',
    
    // Link Colors
    link: '#4f46e5',
    linkHover: '#4338ca',
    
    // Dark/Black Colors (for buttons, headers, etc.)
    dark: '#0f172a',
    darkHover: '#1e293b',
  };

  const [colors, setColors] = useState(defaultColors);

  // Banner state
  const [bannerData, setBannerData] = useState({
    imageUrl: '',
    heading: '',
    description: '',
    tag: '',
  });

  // Gallery state
  const [galleryImages, setGalleryImages] = useState<any[]>([]);
  const [showGalleryModal, setShowGalleryModal] = useState(false);
  const [editingGallery, setEditingGallery] = useState<any>(null);
  const [galleryFormData, setGalleryFormData] = useState({
    imageUrl: '',
    title: '',
    description: '',
    order: 0,
  });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  useEffect(() => {
    fetchTheme();
    fetchGallery();
  }, []);

  const fetchTheme = async () => {
    try {
      const { data } = await getAllThemes();
      if (data.length > 0) {
        const activeTheme = data.find((t: any) => t.isActive) || data[0];
        setTheme(activeTheme);
        setLogoData(activeTheme.logo || { imageUrl: '', text: '', subText: '' });
        
        // Set colors with defaults for all color properties (including dark colors)
        const mergedColors = { ...defaultColors, ...(activeTheme.colors || {}) };
        // Ensure dark colors are set if missing
        if (!mergedColors.dark) mergedColors.dark = defaultColors.dark;
        if (!mergedColors.darkHover) mergedColors.darkHover = defaultColors.darkHover;
        setColors(mergedColors);
        setBannerData(activeTheme.banner || { imageUrl: '', heading: '', description: '', tag: '' });
      }
    } catch (error: any) {
      toast.error('Failed to load theme');
    } finally {
      setLoading(false);
    }
  };

  const fetchGallery = async () => {
    try {
      const { data } = await getAllGalleryImagesAdmin();
      setGalleryImages(data);
    } catch (error: any) {
      toast.error('Failed to load gallery');
    }
  };

  // Apply all colors to CSS variables
  const applyAllColors = (colorObj: typeof defaultColors) => {
    const root = document.documentElement;
    Object.entries(colorObj).forEach(([key, value]) => {
      const cssVar = `--theme-${key.replace(/([A-Z])/g, '-$1').toLowerCase()}`;
      root.style.setProperty(cssVar, value);
    });
  };

  const handleSaveTheme = async () => {
    setSaving(true);
    try {
      await updateTheme({
        logo: logoData,
        colors: colors,
        banner: bannerData,
      });
      toast.success('Theme updated successfully!');
      fetchTheme();
      // Refresh theme context to apply changes globally
      refreshTheme();
      // Ensure all colors are applied
      applyAllColors(colors);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to update theme');
    } finally {
      setSaving(false);
    }
  };

  useEffect(() => {
    // Apply colors to document when they change - immediate preview
    if (colors) {
      applyAllColors(colors);
    }
  }, [colors]);

  const handleColorChange = (key: keyof typeof defaultColors, value: string) => {
    const newColors = { ...colors, [key]: value };
    setColors(newColors);
    applyAllColors(newColors);
  };

  const handleResetColors = () => {
    setColors(defaultColors);
    applyAllColors(defaultColors);
    toast.success('All colors reset to default');
  };

  const handleResetLogo = () => {
    setLogoData({ imageUrl: '', text: '', subText: '' });
    toast.success('Logo reset to default');
  };

  const handleResetBanner = () => {
    setBannerData({ imageUrl: '', heading: '', description: '', tag: '' });
    toast.success('Banner reset to default');
  };

  const handleResetCompleteTheme = async () => {
    if (!window.confirm('Are you sure you want to reset the entire theme to default? This will reset logo, banner, and all colors.')) {
      return;
    }

    setSaving(true);
    try {
      // Reset all to defaults
      const resetLogo = { imageUrl: '', text: '', subText: '' };
      const resetBanner = { imageUrl: '', heading: '', description: '', tag: '' };
      
      await updateTheme({
        logo: resetLogo,
        colors: defaultColors,
        banner: resetBanner,
      });
      
      // Update local state
      setLogoData(resetLogo);
      setBannerData(resetBanner);
      setColors(defaultColors);
      applyAllColors(defaultColors);
      
      toast.success('Complete theme reset to default!');
      fetchTheme();
      refreshTheme();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to reset theme');
    } finally {
      setSaving(false);
    }
  };

  // Color picker component
  const ColorPicker = ({ label, colorKey, description }: { label: string; colorKey: keyof typeof defaultColors; description?: string }) => (
    <div>
      <label className="block text-sm font-bold text-slate-700 mb-2">
        {label}
        {description && <span className="text-xs font-normal text-slate-400 ml-2">({description})</span>}
      </label>
      <div className="flex gap-3">
        <input
          type="color"
          value={colors[colorKey]}
          onChange={(e) => handleColorChange(colorKey, e.target.value)}
          className="w-20 h-12 rounded-lg border border-slate-200 cursor-pointer"
        />
        <input
          type="text"
          value={colors[colorKey]}
          onChange={(e) => handleColorChange(colorKey, e.target.value)}
          placeholder={defaultColors[colorKey]}
          className="flex-1 px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none font-mono text-sm"
        />
      </div>
      <div className="mt-2 p-3 rounded-lg border border-slate-200" style={{ backgroundColor: colors[colorKey] }}>
        <p className="text-xs font-bold" style={{ color: getContrastColor(colors[colorKey]) }}>
          Preview: {label}
        </p>
      </div>
    </div>
  );

  // Helper to get contrasting text color
  const getContrastColor = (hex: string) => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    const brightness = (r * 299 + g * 587 + b * 114) / 1000;
    return brightness > 128 ? '#000000' : '#ffffff';
  };

  // Color sections configuration
  const colorSections = [
    {
      id: 'brand',
      title: 'Brand Colors',
      description: 'Primary brand colors used throughout the website',
      colors: [
        { key: 'primary' as const, label: 'Primary Color', desc: 'Main brand color' },
        { key: 'secondary' as const, label: 'Secondary Color', desc: 'Secondary brand color' },
      ]
    },
    {
      id: 'background',
      title: 'Background Colors',
      description: 'Page and section background colors',
      colors: [
        { key: 'background' as const, label: 'Main Background', desc: 'Page background' },
        { key: 'backgroundSecondary' as const, label: 'Secondary Background', desc: 'Card/section background' },
        { key: 'backgroundDark' as const, label: 'Dark Background', desc: 'Dark sections background' },
      ]
    },
    {
      id: 'text',
      title: 'Text Colors',
      description: 'Text color scheme',
      colors: [
        { key: 'textPrimary' as const, label: 'Primary Text', desc: 'Main text color' },
        { key: 'textSecondary' as const, label: 'Secondary Text', desc: 'Muted text color' },
        { key: 'textLight' as const, label: 'Light Text', desc: 'Text on dark backgrounds' },
      ]
    },
    {
      id: 'border',
      title: 'Border Colors',
      description: 'Border and divider colors',
      colors: [
        { key: 'border' as const, label: 'Border', desc: 'Standard border color' },
        { key: 'borderLight' as const, label: 'Light Border', desc: 'Subtle border color' },
      ]
    },
    {
      id: 'accent',
      title: 'Accent Colors',
      description: 'Accent and highlight colors',
      colors: [
        { key: 'accent' as const, label: 'Accent', desc: 'Accent color' },
        { key: 'accentHover' as const, label: 'Accent Hover', desc: 'Accent hover state' },
      ]
    },
    {
      id: 'status',
      title: 'Status Colors',
      description: 'Success, error, warning, and info colors',
      colors: [
        { key: 'success' as const, label: 'Success', desc: 'Success messages' },
        { key: 'error' as const, label: 'Error', desc: 'Error messages' },
        { key: 'warning' as const, label: 'Warning', desc: 'Warning messages' },
        { key: 'info' as const, label: 'Info', desc: 'Info messages' },
      ]
    },
    {
      id: 'button',
      title: 'Button Colors',
      description: 'Button color scheme',
      colors: [
        { key: 'buttonPrimary' as const, label: 'Primary Button', desc: 'Main button color' },
        { key: 'buttonPrimaryHover' as const, label: 'Primary Hover', desc: 'Primary button hover' },
        { key: 'buttonSecondary' as const, label: 'Secondary Button', desc: 'Secondary button color' },
        { key: 'buttonSecondaryHover' as const, label: 'Secondary Hover', desc: 'Secondary button hover' },
      ]
    },
    {
      id: 'link',
      title: 'Link Colors',
      description: 'Link color scheme',
      colors: [
        { key: 'link' as const, label: 'Link', desc: 'Link color' },
        { key: 'linkHover' as const, label: 'Link Hover', desc: 'Link hover color' },
      ]
    },
  ];

  const handleGallerySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingGallery) {
        await updateGalleryImage(editingGallery._id, galleryFormData);
        toast.success('Gallery image updated');
      } else {
        await createGalleryImage(galleryFormData);
        toast.success('Gallery image added');
      }
      setShowGalleryModal(false);
      setEditingGallery(null);
      setGalleryFormData({ imageUrl: '', title: '', description: '', order: 0 });
      fetchGallery();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to save gallery image');
    }
  };

  const handleDeleteGallery = async (id: string) => {
    try {
      await deleteGalleryImage(id);
      toast.success('Gallery image deleted');
      fetchGallery();
    } catch (error: any) {
      toast.error('Failed to delete gallery image');
    }
  };

  const paginatedGallery = galleryImages.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Header */}
      <div className="space-y-3">
        <div className="inline-flex items-center gap-2 bg-indigo-50 px-4 py-1.5 rounded-full border border-indigo-100">
          <Palette size={14} className="text-indigo-600" />
          <span className="text-indigo-600 font-black text-[10px] uppercase tracking-widest">Theme Management</span>
        </div>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tighter leading-[1.05]">
          Website <span className="text-slate-400">Customization</span>
        </h1>
        <p className="text-slate-500 max-w-2xl text-sm sm:text-base font-medium leading-relaxed">
          Customize your website logo, colors, banner, and gallery images.
        </p>
      </div>

      {/* Tabs */}
      <div className="bg-white border border-slate-100 rounded-xl sm:rounded-2xl p-1">
        <div className="flex flex-wrap gap-1">
          {[
            { id: 'logo', label: 'Logo', icon: ImageIcon },
            { id: 'colors', label: 'Colors', icon: Palette },
            { id: 'banner', label: 'Banner', icon: Upload },
            { id: 'gallery', label: 'Gallery', icon: Sparkles },
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex-1 sm:flex-none px-4 py-2.5 rounded-lg font-bold text-sm transition-all flex items-center justify-center gap-2 ${
                  activeTab === tab.id
                    ? 'bg-slate-900 text-white'
                    : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                <Icon size={16} />
                <span className="hidden sm:inline">{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Logo Tab */}
      {activeTab === 'logo' && (
        <div className="bg-white border border-slate-100 rounded-xl sm:rounded-2xl p-5 sm:p-6 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-black text-slate-900 mb-2">Logo Settings</h2>
              <p className="text-sm text-slate-500">Upload a square logo image and add text/sub-text</p>
            </div>
            {(logoData.imageUrl || logoData.text || logoData.subText) && (
              <button
                onClick={handleResetLogo}
                className="px-4 py-2 bg-rose-50 text-rose-600 rounded-xl font-bold text-sm hover:bg-rose-100 transition-all flex items-center gap-2"
              >
                <Trash2 size={16} />
                Reset Logo
              </button>
            )}
          </div>

          <div>
            <ImageUpload
              value={logoData.imageUrl}
              onChange={(base64) => setLogoData({ ...logoData, imageUrl: base64 })}
              label="Logo Image (Square - 1:1 ratio recommended)"
              aspectRatio="square"
              maxSize={2}
              enforceSquare={true}
            />
            <p className="text-xs text-slate-400 mt-2">
              💡 Tip: Upload a square logo (e.g., 512x512px or 1024x1024px) for best results. The image will be automatically cropped to square if needed.
            </p>
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Logo Text</label>
            <input
              type="text"
              value={logoData.text}
              onChange={(e) => setLogoData({ ...logoData, text: e.target.value })}
              placeholder="e.g., Anterc"
              className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none font-medium"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Logo Sub-Text</label>
            <input
              type="text"
              value={logoData.subText}
              onChange={(e) => setLogoData({ ...logoData, subText: e.target.value })}
              placeholder="e.g., Premium Services"
              className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none font-medium"
            />
          </div>
        </div>
      )}

      {/* Colors Tab */}
      {activeTab === 'colors' && (
        <div className="space-y-6">
          <div className="bg-white border border-slate-100 rounded-xl sm:rounded-2xl p-5 sm:p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-xl font-black text-slate-900 mb-2">Complete Color System</h2>
                <p className="text-sm text-slate-500">Customize all colors used throughout your website</p>
              </div>
              <button
                onClick={handleResetColors}
                className="px-4 py-2 bg-slate-100 text-slate-700 rounded-xl font-bold text-sm hover:bg-slate-200 transition-all flex items-center gap-2"
              >
                <RotateCcw size={16} />
                Reset All
              </button>
            </div>
          </div>

          {/* Color Sections */}
          <div className="space-y-4">
            {colorSections.map((section) => (
              <div key={section.id} className="bg-white border border-slate-100 rounded-xl sm:rounded-2xl overflow-hidden">
                <button
                  onClick={() => setExpandedColorSection(expandedColorSection === section.id ? '' : section.id)}
                  className="w-full p-5 sm:p-6 flex items-center justify-between hover:bg-slate-50 transition-colors"
                >
                  <div className="text-left">
                    <h3 className="text-lg font-black text-slate-900 mb-1">{section.title}</h3>
                    <p className="text-sm text-slate-500">{section.description}</p>
                  </div>
                  <div className={`transform transition-transform ${expandedColorSection === section.id ? 'rotate-180' : ''}`}>
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                      <path d="M5 7.5L10 12.5L15 7.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                </button>
                
                {expandedColorSection === section.id && (
                  <div className="px-5 sm:px-6 pb-5 sm:pb-6 border-t border-slate-100">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-5">
                      {section.colors.map((color) => (
                        <ColorPicker
                          key={color.key}
                          label={color.label}
                          colorKey={color.key}
                          description={color.desc}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="bg-white border border-slate-100 rounded-xl sm:rounded-2xl p-5 sm:p-6">
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
              <p className="text-xs text-slate-600 font-medium">
              💡 <strong>Live Preview:</strong> All colors are applied immediately across the website. Click "Save Changes" to persist them.
            </p>
            </div>
          </div>
        </div>
      )}

      {/* Banner Tab */}
      {activeTab === 'banner' && (
        <div className="bg-white border border-slate-100 rounded-xl sm:rounded-2xl p-5 sm:p-6 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-black text-slate-900 mb-2">Banner Settings</h2>
              <p className="text-sm text-slate-500">Configure your homepage banner</p>
            </div>
            {(bannerData.imageUrl || bannerData.heading || bannerData.description || bannerData.tag) && (
              <button
                onClick={handleResetBanner}
                className="px-4 py-2 bg-rose-50 text-rose-600 rounded-xl font-bold text-sm hover:bg-rose-100 transition-all flex items-center gap-2"
              >
                <Trash2 size={16} />
                Reset Banner
              </button>
            )}
          </div>

          <div>
            <ImageUpload
              value={bannerData.imageUrl}
              onChange={(base64) => setBannerData({ ...bannerData, imageUrl: base64 })}
              label="Banner Image"
              aspectRatio="auto"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Banner Tag</label>
            <input
              type="text"
              value={bannerData.tag}
              onChange={(e) => setBannerData({ ...bannerData, tag: e.target.value })}
              placeholder="e.g., Premium Care"
              className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none font-medium"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Banner Heading</label>
            <input
              type="text"
              value={bannerData.heading}
              onChange={(e) => setBannerData({ ...bannerData, heading: e.target.value })}
              placeholder="e.g., Expert repairs made simple"
              className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none font-medium"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Banner Description</label>
            <textarea
              value={bannerData.description}
              onChange={(e) => setBannerData({ ...bannerData, description: e.target.value })}
              placeholder="Enter banner description"
              rows={3}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none font-medium resize-none"
            />
          </div>
        </div>
      )}

      {/* Gallery Tab */}
      {activeTab === 'gallery' && (
        <div className="space-y-6">
          <div className="bg-white border border-slate-100 rounded-xl sm:rounded-2xl p-5 sm:p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-xl font-black text-slate-900 mb-2">Gallery Images</h2>
                <p className="text-sm text-slate-500">Manage gallery images displayed on the website</p>
              </div>
              <button
                onClick={() => {
                  setEditingGallery(null);
                  setGalleryFormData({ imageUrl: '', title: '', description: '', order: 0 });
                  setShowGalleryModal(true);
                }}
                className="px-4 py-2.5 bg-slate-900 text-white rounded-xl font-black hover:bg-indigo-600 transition-all flex items-center gap-2 text-sm"
              >
                <Plus size={18} />
                <span className="hidden sm:inline">Add Image</span>
              </button>
            </div>
          </div>

          {/* Gallery Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
            {paginatedGallery.map((image) => (
              <div
                key={image._id}
                className="bg-white border border-slate-100 rounded-xl overflow-hidden hover:shadow-lg transition-all group"
              >
                <div className="aspect-square relative">
                  <img
                    src={image.imageUrl}
                    alt={image.title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://via.placeholder.com/400x400?text=No+Image';
                    }}
                  />
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    <button
                      onClick={() => {
                        setEditingGallery(image);
                        setGalleryFormData({
                          imageUrl: image.imageUrl,
                          title: image.title || '',
                          description: image.description || '',
                          order: image.order || 0,
                        });
                        setShowGalleryModal(true);
                      }}
                      className="p-2 bg-white rounded-lg text-indigo-600 hover:bg-indigo-50 transition-all"
                    >
                      <Edit size={16} />
                    </button>
                    <button
                      onClick={() => handleDeleteGallery(image._id)}
                      className="p-2 bg-white rounded-lg text-rose-600 hover:bg-rose-50 transition-all"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
                {image.title && (
                  <div className="p-2">
                    <p className="text-xs font-bold text-slate-900 line-clamp-1">{image.title}</p>
                  </div>
                )}
              </div>
            ))}
          </div>

          {galleryImages.length > itemsPerPage && (
            <Pagination
              currentPage={currentPage}
              totalPages={Math.ceil(galleryImages.length / itemsPerPage)}
              onPageChange={setCurrentPage}
              itemsPerPage={itemsPerPage}
              totalItems={galleryImages.length}
            />
          )}
        </div>
      )}

      {/* Save Button */}
      {activeTab !== 'gallery' && (
        <div className="bg-white border border-slate-100 rounded-xl sm:rounded-2xl p-5 sm:p-6">
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={handleSaveTheme}
              disabled={saving}
              className="flex-1 sm:flex-none px-8 py-3 bg-slate-900 text-white rounded-xl font-black hover:bg-indigo-600 disabled:bg-slate-300 transition-all flex items-center justify-center gap-2"
            >
              {saving ? (
                <>
                  <div className="w-5 h-5 border-4 border-white/20 border-t-white rounded-full animate-spin"></div>
                  Saving...
                </>
              ) : (
                <>
                  <Save size={18} />
                  Save Changes
                </>
              )}
            </button>
            <button
              onClick={handleResetCompleteTheme}
              disabled={saving}
              className="flex-1 sm:flex-none px-6 py-3 bg-rose-50 text-rose-600 rounded-xl font-black hover:bg-rose-100 disabled:bg-rose-50 disabled:opacity-50 transition-all flex items-center justify-center gap-2 border border-rose-200"
            >
              <RotateCcw size={18} />
              Reset Complete Theme
            </button>
          </div>
        </div>
      )}

      {/* Gallery Modal */}
      <Modal
        isOpen={showGalleryModal}
        onClose={() => {
          setShowGalleryModal(false);
          setEditingGallery(null);
          setGalleryFormData({ imageUrl: '', title: '', description: '', order: 0 });
        }}
        title={editingGallery ? 'Edit Gallery Image' : 'Add Gallery Image'}
      >
        <form onSubmit={handleGallerySubmit} className="space-y-4">
          <div>
            <ImageUpload
              value={galleryFormData.imageUrl}
              onChange={(base64) => setGalleryFormData({ ...galleryFormData, imageUrl: base64 })}
              label="Gallery Image"
              aspectRatio="auto"
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Title (Optional)</label>
            <input
              type="text"
              value={galleryFormData.title}
              onChange={(e) => setGalleryFormData({ ...galleryFormData, title: e.target.value })}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none font-medium"
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Description (Optional)</label>
            <textarea
              value={galleryFormData.description}
              onChange={(e) => setGalleryFormData({ ...galleryFormData, description: e.target.value })}
              rows={2}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none font-medium resize-none"
            />
          </div>
          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              className="flex-1 px-6 py-3 bg-slate-900 text-white rounded-xl font-black hover:bg-indigo-600 transition-all"
            >
              {editingGallery ? 'Update' : 'Add'} Image
            </button>
            <button
              type="button"
              onClick={() => {
                setShowGalleryModal(false);
                setEditingGallery(null);
                setGalleryFormData({ imageUrl: '', title: '', description: '', order: 0 });
              }}
              className="flex-1 px-6 py-3 bg-slate-100 text-slate-700 rounded-xl font-bold hover:bg-slate-200 transition-all"
            >
              Cancel
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default ThemePage;
