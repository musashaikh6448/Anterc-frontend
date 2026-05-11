import React, { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { useTheme } from '../contexts/ThemeContext';
import { useNavigate, useLocation } from 'react-router-dom';
import { X } from 'lucide-react';

const CartStickyFooter: React.FC = () => {
  const { cartItems, totalPrice, totalActualPrice } = useCart();
  const { theme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const [isVisible, setIsVisible] = useState(true);

  // Re-show footer if cart items change
  useEffect(() => {
    if (cartItems.length > 0) {
      setIsVisible(true);
    }
  }, [cartItems.length]);

  if (cartItems.length === 0 || !isVisible) return null;

  // Don't show on cart, checkout, or admin pages
  if (
    location.pathname === '/cart' || 
    location.pathname === '/checkout' || 
    location.pathname.startsWith('/admin')
  ) {
    return null;
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[60] bg-white border-t border-slate-200 shadow-[0_-10px_40px_-15px_rgba(0,0,0,0.1)] p-4 animate-in slide-in-from-bottom-4 duration-300">
      <div className="flex justify-between items-center max-w-7xl mx-auto px-2 sm:px-6">
        <div className="flex flex-col">
          <div className="flex items-baseline gap-2">
            <span className="text-xl font-black text-slate-900">₹{totalPrice.toLocaleString()}</span>
            {totalActualPrice > totalPrice && (
              <span className="text-sm font-bold text-slate-400 line-through">₹{totalActualPrice.toLocaleString()}</span>
            )}
          </div>
          <span className="text-xs font-bold text-slate-500">{cartItems.length} item{cartItems.length > 1 ? 's' : ''} added</span>
        </div>
        
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/cart')}
            className="px-6 py-3 rounded-xl text-white text-sm font-black uppercase tracking-widest transition-all shadow-lg active:scale-95"
            style={{
              backgroundColor: theme?.colors?.primary || '#8b5cf6', // Matching the purple from image
              boxShadow: `0 10px 15px -3px ${theme?.colors?.primary || '#8b5cf6'}40`
            }}
          >
            View Cart
          </button>
          <button 
            onClick={() => setIsVisible(false)}
            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors flex-shrink-0"
            aria-label="Close cart summary"
          >
            <X size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default CartStickyFooter;
