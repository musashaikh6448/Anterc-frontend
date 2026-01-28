
import React, { useState, useEffect } from 'react';
import { Search, Menu, X, User, LogOut, ClipboardList, ChevronDown } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import SearchOverlay from './SearchOverlay';
import { useAuth } from '../AuthContext';
import { useTheme } from '../contexts/ThemeContext';

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const { user, logout } = useAuth();
  const { theme } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    setIsMenuOpen(false);
    setIsSearchOpen(false);
    setIsProfileOpen(false);
  }, [location]);

  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [isMenuOpen]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const navLinks = [
    { label: 'Home', path: '/' },
    { label: 'Gallery', path: '/gallery' },
    { label: 'About Us', path: '/about' },
    { label: 'Contact Us', path: '/contact' }
  ];

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-2xl border-b py-2 border-slate-100/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex justify-between items-center h-16 sm:h-24">
            {/* Logo Section */}
            <Link to="/" className="flex items-center gap-2 sm:gap-3 group">
              {theme?.logo?.imageUrl ? (
                <div className="w-[60px] rounded-xl sm:rounded-[1.25rem] overflow-hidden flex items-center justify-center transition-all duration-500 group-hover:shadow-xl">
                  <img
                    src={theme.logo.imageUrl}
                    alt={theme.logo.text || 'Logo'}
                    className="w-full h-full object-contain"
                  />
                </div>
              ) : (
                <div 
                  className="bg-slate-900 w-9  sm:w-12 h-12 rounded-xl sm:rounded-[1.25rem] flex items-center justify-center transition-all duration-500 group-hover:shadow-xl"
                  style={{ 
                    backgroundColor: theme?.colors?.primary || '#4f46e5',
                    boxShadow: '0 0 0 0 rgba(0,0,0,0)'
                  }}
                  onMouseEnter={(e) => {
                    const primary = theme?.colors?.primary || '#4f46e5';
                    e.currentTarget.style.backgroundColor = primary;
                    e.currentTarget.style.boxShadow = `0 20px 25px -5px ${primary}40, 0 10px 10px -5px ${primary}20`;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = theme?.colors?.primary || '#4f46e5';
                    e.currentTarget.style.boxShadow = '0 0 0 0 rgba(0,0,0,0)';
                  }}
                >
                  <span className="text-white font-black text-xl sm:text-2xl tracking-tighter">
                    {theme?.logo?.text?.[0] || 'A'}
                  </span>
                </div>
              )}
              <div className="flex flex-col -space-y-0.5 sm:-space-y-1">
                <span className="text-slate-900 font-black text-base sm:text-xl tracking-tight leading-tight">
                  {theme?.logo?.text || 'Antarc Services'}
                </span>
                <span 
                  className="font-extrabold uppercase tracking-[0.2em] text-[7px] sm:text-[9px]"
                  style={{ color: theme?.colors?.primary || '#6366f1' }}
                >
                  {theme?.logo?.subText || 'Nanded'}
                </span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-8">
              {navLinks.map(link => (
                <Link 
                  key={link.path} 
                  to={link.path} 
                  className={`text-sm font-black uppercase tracking-widest transition-colors ${location.pathname === link.path ? '' : 'text-slate-500'}`}
                  style={location.pathname === link.path ? { color: theme?.colors?.primary || '#4f46e5' } : {}}
                  onMouseEnter={(e) => {
                    if (location.pathname !== link.path) {
                      e.currentTarget.style.color = theme?.colors?.primary || '#4f46e5';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (location.pathname !== link.path) {
                      e.currentTarget.style.color = '';
                    }
                  }}
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            {/* Actions Section */}
            <div className="flex items-center gap-1 sm:gap-4">
              <button 
                onClick={() => setIsSearchOpen(true)}
                className="p-2.5 sm:p-3.5 text-slate-500 rounded-xl transition-all active:scale-90"
                onMouseEnter={(e) => {
                  const primary = theme?.colors?.primary || '#4f46e5';
                  e.currentTarget.style.backgroundColor = `${primary}10`;
                  e.currentTarget.style.color = primary;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '';
                  e.currentTarget.style.color = '';
                }}
              >
                <Search size={20} className="sm:w-[22px] sm:h-[22px]" strokeWidth={2.5} />
              </button>

              {user ? (
                <div className="relative">
                  <button 
                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                    className="flex items-center gap-2 px-3 py-2 bg-slate-50 rounded-xl border border-slate-100 transition-all"
                    onMouseEnter={(e) => {
                      const primary = theme?.colors?.primary || '#4f46e5';
                      e.currentTarget.style.borderColor = `${primary}40`;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = '';
                    }}
                  >
                    <div 
                      className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-xs font-black uppercase"
                      style={{ backgroundColor: theme?.colors?.primary || '#4f46e5' }}
                    >
                      {user.name.charAt(0)}
                    </div>
                    <span className="hidden sm:block text-sm font-bold text-slate-700">{user.name.split(' ')[0]}</span>
                    <ChevronDown size={14} className={`text-slate-400 transition-transform ${isProfileOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {isProfileOpen && (
                    <div className="absolute top-full right-0 mt-2 w-56 bg-white rounded-2xl shadow-2xl border border-slate-100 p-2 animate-in slide-in-from-top-2">
                      <Link 
                        to="/my-enquiries" 
                        className="flex items-center gap-3 px-4 py-3 text-sm font-bold text-slate-700 rounded-xl transition-colors"
                        onMouseEnter={(e) => {
                          const primary = theme?.colors?.primary || '#4f46e5';
                          e.currentTarget.style.backgroundColor = `${primary}10`;
                          e.currentTarget.style.color = primary;
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = '';
                          e.currentTarget.style.color = '';
                        }}
                      >
                        <ClipboardList size={18} />
                        My Enquiries
                      </Link>
                      <button 
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-3 text-sm font-bold text-rose-600 hover:bg-rose-50 rounded-xl transition-colors"
                      >
                        <LogOut size={18} />
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <Link 
                  to="/auth"
                  className="hidden sm:flex items-center gap-2 px-6 py-3 text-white rounded-xl text-sm font-black uppercase tracking-widest transition-all shadow-lg"
                  style={{ 
                    backgroundColor: theme?.colors?.dark || '#0f172a',
                    boxShadow: `0 10px 15px -3px ${theme?.colors?.primary || '#4f46e5'}20, 0 4px 6px -2px ${theme?.colors?.primary || '#4f46e5'}10`
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = theme?.colors?.darkHover || theme?.colors?.primary || '#1e293b';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = theme?.colors?.dark || '#0f172a';
                  }}
                >
                  <User size={16} strokeWidth={3} />
                  Login
                </Link>
              )}

              <button 
                onClick={() => setIsMenuOpen(true)}
                className="lg:hidden p-2.5 sm:p-3.5 text-slate-500 hover:bg-slate-50 rounded-xl transition-all"
              >
                <Menu size={20} className="sm:w-[22px] sm:h-[22px]" strokeWidth={2.5} />
              </button>
            </div>
          </div>
        </div>
      </header>

      <SearchOverlay isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />

      {/* Mobile Menu */}
      <div 
        className={`fixed inset-0 z-[60] bg-slate-950/40 backdrop-blur-sm transition-opacity duration-500 lg:hidden ${
          isMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setIsMenuOpen(false)}
      />

      <div 
        className={`fixed inset-y-0 right-0 z-[70] w-full max-w-[280px] bg-white shadow-2xl transform transition-all duration-500 lg:hidden ${
          isMenuOpen ? 'translate-x-0 visible' : 'translate-x-full pointer-events-none invisible delay-500'
        }`}
      >
        <div className="flex flex-col h-full bg-slate-50/30">
          <div className="flex items-center justify-between p-6 border-b border-slate-100">
            <Link to="/" onClick={() => setIsMenuOpen(false)} className="flex items-center gap-2">
              <div 
                className="w-8 h-8 rounded-lg flex items-center justify-center"
                style={{ backgroundColor: theme?.colors?.dark || '#0f172a' }}
              >
                <span className="text-white font-black text-lg">
                  {theme?.logo?.text?.[0] || 'A'}
                </span>
              </div>
              <span className="font-black text-slate-900 tracking-tight text-lg">
                {theme?.logo?.text || 'Antarc Services'}
              </span>
            </Link>
            <button onClick={() => setIsMenuOpen(false)} className="p-2 text-slate-400 hover:bg-slate-50 rounded-xl">
              <X size={24} />
            </button>
          </div>

          <div className="flex-1 p-6 space-y-4">
            {user && (
               <div className="pb-6 mb-6 border-b border-slate-100">
                  <div className="flex items-center gap-3 mb-4">
                    <div 
                      className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-black"
                      style={{ backgroundColor: theme?.colors?.primary || '#4f46e5' }}
                    >
                      {user.name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-black text-slate-900 leading-none">{user.name}</p>
                      <p className="text-xs text-slate-400 font-bold mt-1">+91 {user.mobile}</p>
                    </div>
                  </div>
                  <Link 
                    to="/my-enquiries" 
                    onClick={() => setIsMenuOpen(false)}
                    className="flex items-center gap-3 py-3 font-black text-sm uppercase tracking-widest"
                    style={{ color: theme?.colors?.primary || '#4f46e5' }}
                  >
                    <ClipboardList size={18} />
                    My Enquiries
                  </Link>
               </div>
            )}
            
            {navLinks.map(link => (
              <Link 
                key={link.path} 
                to={link.path} 
                onClick={() => setIsMenuOpen(false)}
                className={`block py-3 font-black text-lg tracking-tight ${location.pathname === link.path ? '' : 'text-slate-900'}`}
                style={location.pathname === link.path ? { color: theme?.colors?.primary || '#4f46e5' } : {}}
              >
                {link.label}
              </Link>
            ))}

            {!user ? (
               <Link 
                to="/auth" 
                onClick={() => setIsMenuOpen(false)}
                className="mt-6 flex items-center justify-center gap-3 py-4 text-white font-black rounded-xl"
                style={{ backgroundColor: theme?.colors?.primary || '#4f46e5' }}
              >
                <User size={18} strokeWidth={3} />
                Login / Sign Up
              </Link>
            ) : (
              <button 
                onClick={() => {
                  handleLogout();
                  setIsMenuOpen(false);
                }}
                className="mt-6 flex items-center justify-center gap-3 py-4 bg-slate-100 text-rose-600 font-black rounded-xl w-full"
              >
                <LogOut size={18} strokeWidth={3} />
                Logout
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Header;
