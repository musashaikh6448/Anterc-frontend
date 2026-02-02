import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { Trash2, ChevronLeft, ShoppingCart, ArrowRight } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '../AuthContext'; // Fix import path to match project structure

const CartPage: React.FC = () => {
    const { cartItems, removeFromCart, updateQuantity, totalPrice, totalActualPrice, totalSavings, loading } = useCart();
    const navigate = useNavigate();
    const { user } = useAuth();

    console.log('CartPage Render:', { loading, items: cartItems.length, user: user?.name });

    const handleProceed = () => {
        if (!user) {
            navigate('/auth'); // Or whatever login flow you prefer
            return;
        }
        navigate('/checkout');
    };

    if (loading && cartItems.length === 0) {
        return (
            <div className="min-h-screen bg-slate-50 pt-24 flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-slate-500 font-medium">Loading your cart...</p>
                </div>
            </div>
        );
    }

    if (cartItems.length === 0) {
        return (
            <div className="min-h-screen bg-slate-50 pt-24 pb-12 px-4 flex flex-col items-center justify-center">
                <div className="w-24 h-24 bg-indigo-50 rounded-full flex items-center justify-center mb-6">
                    <ShoppingCart size={40} className="text-indigo-600" />
                </div>
                <h2 className="text-2xl font-black text-slate-900 mb-2">Your cart is empty</h2>
                <p className="text-slate-500 mb-8">Looks like you haven't added any services yet.</p>
                <button
                    onClick={() => navigate('/')}
                    className="px-8 py-3 bg-slate-900 text-white font-bold rounded-xl hover:bg-indigo-600 transition-all"
                >
                    Browse Services
                </button>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 pt-24 pb-32">
            <div className="max-w-7xl mx-auto px-4 lg:px-8">
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-2 text-slate-500 hover:text-slate-900 font-bold mb-8 transition-colors"
                >
                    <ChevronLeft size={20} /> Back
                </button>

                <h1 className="text-3xl sm:text-4xl font-black text-slate-900 mb-8 tracking-tight">Your Cart <span className="text-slate-400 text-2xl ml-2 font-bold">({cartItems.length} Items)</span></h1>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
                    {/* Cart Items List */}
                    <div className="lg:col-span-2 space-y-6">
                        {cartItems.map((item) => {
                            const savings = item.actualPrice ? item.actualPrice - item.price : 0;
                            const savingsPercent = item.actualPrice ? Math.round((savings / item.actualPrice) * 100) : 0;

                            return (
                                <div key={item.subServiceId} className="bg-white p-3 sm:p-5 rounded-2xl shadow-sm border border-slate-100 transition-all hover:shadow-md">
                                    <div className="flex gap-3 sm:gap-6">
                                        <div className="w-20 h-20 sm:w-24 sm:h-24 md:w-32 md:h-32 bg-slate-100 rounded-xl overflow-hidden shrink-0 relative group">
                                            {item.imageUrl ? (
                                                <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-slate-300">
                                                    <ShoppingCart size={24} className="sm:w-8 sm:h-8" />
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex-1 flex flex-col justify-between py-1 min-w-0">
                                            <div>
                                                <div className="flex justify-between items-start mb-2 gap-2">
                                                    <div className="flex-1 min-w-0">
                                                        <p className="text-[10px] sm:text-xs font-black text-indigo-600 uppercase tracking-widest mb-1">{item.category}</p>
                                                        <h3 className="text-sm sm:text-lg font-bold text-slate-900 leading-tight line-clamp-2">{item.name}</h3>
                                                    </div>
                                                    <button
                                                        onClick={() => removeFromCart(item.subServiceId)}
                                                        className="text-slate-400 hover:text-rose-500 hover:bg-rose-50 p-1.5 sm:p-2 rounded-xl transition-all shrink-0"
                                                        title="Remove Item"
                                                    >
                                                        <Trash2 size={18} className="sm:w-5 sm:h-5" />
                                                    </button>
                                                </div>
                                            </div>

                                            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 mt-3 sm:mt-4">
                                                <div className="flex flex-wrap items-baseline gap-2">
                                                    <span className="text-lg sm:text-2xl font-black text-slate-900">₹{(item.price * item.quantity).toLocaleString('en-IN')}</span>
                                                    {item.actualPrice && item.actualPrice > item.price && (
                                                        <>
                                                            <span className="text-xs sm:text-sm text-slate-400 line-through font-medium">₹{(item.actualPrice * item.quantity).toLocaleString('en-IN')}</span>
                                                            <span className="text-[10px] sm:text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-lg">
                                                                {savingsPercent}% OFF
                                                            </span>
                                                        </>
                                                    )}
                                                </div>

                                                {/* Quantity Controls */}
                                                <div className="flex items-center gap-2 sm:gap-3 bg-slate-50 rounded-xl px-2 sm:px-3 py-1.5 sm:py-2 border border-slate-200 self-start sm:self-auto">
                                                    <button
                                                        onClick={() => {
                                                            const newQty = item.quantity - 1;
                                                            if (newQty >= 1) {
                                                                updateQuantity(item.subServiceId, newQty);
                                                            }
                                                        }}
                                                        disabled={item.quantity <= 1}
                                                        className="w-6 h-6 sm:w-7 sm:h-7 flex items-center justify-center bg-white rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-900 hover:text-white disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:text-slate-700 transition-all font-bold text-sm"
                                                        title="Decrease quantity"
                                                    >
                                                        -
                                                    </button>
                                                    <span className="text-sm font-black text-slate-900 min-w-[1.5rem] sm:min-w-[2rem] text-center">{item.quantity}</span>
                                                    <button
                                                        onClick={() => updateQuantity(item.subServiceId, item.quantity + 1)}
                                                        className="w-6 h-6 sm:w-7 sm:h-7 flex items-center justify-center bg-white rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-900 hover:text-white transition-all font-bold text-sm"
                                                        title="Increase quantity"
                                                    >
                                                        +
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )
                        })}
                    </div>

                    {/* Summary & Checkout */}
                    <div className="space-y-6">
                        <div className="bg-white p-6 sm:p-8 rounded-[2rem] shadow-xl shadow-indigo-100/50 border border-slate-100 sticky top-24">
                            <h3 className="text-xl font-black text-slate-900 mb-6 flex items-center gap-2">
                                Billing Details
                            </h3>

                            <div className="space-y-4 mb-8">
                                <div className="flex justify-between text-slate-500 font-medium">
                                    <span>Item Total</span>
                                    <span>₹{(totalActualPrice || totalPrice).toLocaleString('en-IN')}</span>
                                </div>
                                {totalSavings > 0 && (
                                    <div className="flex justify-between text-emerald-600 font-bold">
                                        <span>Total Savings</span>
                                        <span>-₹{totalSavings.toLocaleString('en-IN')}</span>
                                    </div>
                                )}
                                <div className="h-px bg-slate-100 my-4"></div>
                                <div className="flex justify-between items-end">
                                    <span className="text-slate-900 font-bold text-lg">To Pay</span>
                                    <span className="text-3xl font-black text-slate-900">₹{totalPrice.toLocaleString('en-IN')}</span>
                                </div>
                                <p className="text-xs text-slate-400 mt-2 text-right">Taxes & fees included</p>
                            </div>

                            <button
                                onClick={handleProceed}
                                className="w-full py-4 bg-slate-900 text-white font-black text-lg rounded-2xl hover:bg-indigo-600 transition-all shadow-xl shadow-indigo-200 hover:shadow-indigo-600/20 active:scale-[0.98] flex items-center justify-center gap-3"
                            >
                                Proceed to Checkout <ArrowRight size={20} className="animate-pulse" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CartPage;
