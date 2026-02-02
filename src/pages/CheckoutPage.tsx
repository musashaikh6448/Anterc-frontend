import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../AuthContext';
import { createEnquiry } from '@/api/customerApi';
import { toast } from 'sonner';
import { ArrowRight, ChevronLeft, MapPin, CheckCircle, User, Smartphone, Info, Map, ShieldCheck, BadgeCheck, Phone, CheckCircle2 } from 'lucide-react';
import { cities, CityData } from '@/data/indianCities';

const CheckoutPage: React.FC = () => {
    const { cartItems, totalPrice, totalActualPrice, totalSavings, clearCart, loading } = useCart();
    const navigate = useNavigate();
    const { user } = useAuth();
    const [submitting, setSubmitting] = useState(false);

    // Form state matching EnquiryPage
    const [formData, setFormData] = useState({
        fullName: user?.name || '',
        mobile: user?.phone || '',
        address: user?.address || '',
        landmark: '',
        city: user?.city || '',
        state: user?.state || '',
        pincode: user?.pincode || '',
        brand: '',
        issue: '', // This will map to message
        bookedFor: 'myself'
    });

    const [cityQuery, setCityQuery] = useState('');
    const [showCitySuggestions, setShowCitySuggestions] = useState(false);
    const [filteredCities, setFilteredCities] = useState<CityData[]>([]);

    useEffect(() => {
        window.scrollTo(0, 0);
        if (user) {
            setFormData(prev => ({
                ...prev,
                fullName: user.name || prev.fullName,
                mobile: user.phone || prev.mobile,
                address: user.address || prev.address,
                city: user.city || prev.city,
                state: user.state || prev.state,
                pincode: user.pincode || prev.pincode,
            }));
            if (user.city) setCityQuery(user.city);
        }
    }, [user]);

    // City Autocomplete Logic
    const handleCityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const query = e.target.value;
        setCityQuery(query);
        setFormData(prev => ({ ...prev, city: query }));

        if (query.length > 0) {
            const filtered = cities.filter(city =>
                city.city.toLowerCase().includes(query.toLowerCase())
            );
            setFilteredCities(filtered);
            setShowCitySuggestions(true);
        } else {
            setShowCitySuggestions(false);
        }
    };

    const selectCity = (cityData: CityData) => {
        setCityQuery(cityData.city);
        setFormData(prev => ({
            ...prev,
            city: cityData.city,
            state: cityData.state,
            pincode: cityData.pincode
        }));
        setShowCitySuggestions(false);
    };

    // Pincode Lookup Logic
    const handlePincodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const pincode = e.target.value;
        if (pincode && !/^\d*$/.test(pincode)) return; // Only numbers

        setFormData(prev => ({ ...prev, pincode }));

        if (pincode.length === 6) {
            const foundCity = cities.find(c => c.pincode === pincode);
            if (foundCity) {
                setFormData(prev => ({
                    ...prev,
                    city: foundCity.city,
                    state: foundCity.state,
                    // cityQuery: foundCity.city // This line was causing a type error, removed as cityQuery is updated by selectCity
                }));
                setCityQuery(foundCity.city);
                toast.success(`Location matched: ${foundCity.city}, ${foundCity.state}`);
            }
        }
    };

    // Close suggestions on outside click
    useEffect(() => {
        const handleClickOutside = () => setShowCitySuggestions(false);
        document.addEventListener('click', handleClickOutside);
        return () => document.removeEventListener('click', handleClickOutside);
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleCheckout = async () => {
        if (cartItems.length === 0) return;
        setSubmitting(true);

        try {
            await createEnquiry({
                items: cartItems,
                message: formData.issue, // Map issue to message
                address: formData.address,
                landmark: formData.landmark,
                city: formData.city,
                state: formData.state,
                pincode: formData.pincode,
                bookedFor: formData.bookedFor,
                brand: formData.brand,
                // Add contact details if backend supports them directly or rely on user profile
                // Assuming backend uses logged-in user, but if you want to override:
                // Note: Standard createEnquiry might not take name/phone override unless backend is updated.
                // However, for 'bookedFor' logic, typically we just store the enquiry. 
            });

            toast.success('Enquiry Submitted Successfully!');
            await clearCart();
            navigate('/success');
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Failed to submit enquiry');
        } finally {
            setSubmitting(false);
        }
    };

    if (cartItems.length === 0) {
        navigate('/cart');
        return null;
    }

    return (
        <div className="min-h-screen bg-slate-50 pt-24 pb-32">
            <div className="max-w-7xl mx-auto px-4 lg:px-8">
                <button
                    onClick={() => navigate('/cart')}
                    className="flex items-center gap-2 text-slate-500 hover:text-slate-900 font-bold mb-8 transition-colors"
                >
                    <ChevronLeft size={20} /> Back to Cart
                </button>

                <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
                    {/* Left Side: Full Enquiry Form */}
                    <div className="flex-1">
                        <div className="bg-white rounded-[2.5rem] p-6 sm:p-10 shadow-xl shadow-slate-200/40 border border-slate-100 relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-50/50 rounded-full blur-[80px] -mr-32 -mt-32"></div>

                            <div className="relative z-10 mb-10">
                                <h1 className="text-3xl font-black text-slate-900 mb-2 tracking-tight">Checkout Details</h1>
                                <p className="text-slate-500 font-medium">Please confirm your contact and service location details.</p>
                            </div>

                            <form className="relative z-10 space-y-8">
                                <div className="space-y-8">
                                    {/* Booked For Switch */}
                                    <div className="bg-slate-50 p-1.5 rounded-2xl flex w-full">
                                        <button
                                            type="button"
                                            onClick={() => setFormData({ ...formData, bookedFor: 'myself' })}
                                            className={`flex-1 py-3 text-sm font-bold rounded-xl transition-all ${formData.bookedFor === 'myself'
                                                ? 'bg-white text-indigo-600 shadow-sm'
                                                : 'text-slate-500 hover:text-slate-700'}`}
                                        >
                                            For Myself
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setFormData({ ...formData, bookedFor: 'others' })}
                                            className={`flex-1 py-3 text-sm font-bold rounded-xl transition-all ${formData.bookedFor === 'others'
                                                ? 'bg-white text-indigo-600 shadow-sm'
                                                : 'text-slate-500 hover:text-slate-700'}`}
                                        >
                                            For Someone Else
                                        </button>
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6">
                                        <div className="space-y-2">
                                            <label className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                                <User size={14} /> Name
                                            </label>
                                            <input
                                                name="fullName"
                                                value={formData.fullName}
                                                onChange={handleChange}
                                                placeholder="Full Name"
                                                className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-xl focus:bg-white focus:ring-4 focus:ring-indigo-100/50 focus:border-indigo-500 focus:outline-none text-sm font-bold transition-all"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                                <Smartphone size={14} /> Mobile
                                            </label>
                                            <input
                                                name="mobile"
                                                value={formData.mobile}
                                                onChange={handleChange}
                                                maxLength={10}
                                                placeholder="10 digit number"
                                                className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-xl focus:bg-white focus:ring-4 focus:ring-indigo-100/50 focus:border-indigo-500 focus:outline-none text-sm font-bold transition-all"
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6">
                                        <div className="space-y-2">
                                            <label className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                                <MapPin size={14} /> Address
                                            </label>
                                            <input
                                                name="address"
                                                value={formData.address}
                                                onChange={handleChange}
                                                placeholder="House No, Street, Layout"
                                                className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-xl focus:bg-white focus:ring-4 focus:ring-indigo-100/50 focus:border-indigo-500 focus:outline-none text-sm font-bold transition-all"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                                <MapPin size={14} /> Landmark
                                            </label>
                                            <input
                                                name="landmark"
                                                value={formData.landmark}
                                                onChange={handleChange}
                                                placeholder="Near..."
                                                className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-xl focus:bg-white focus:ring-4 focus:ring-indigo-100/50 focus:border-indigo-500 focus:outline-none text-sm font-bold transition-all"
                                            />
                                        </div>

                                        <div className="space-y-2 relative" onClick={(e) => e.stopPropagation()}>
                                            <label className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                                <Map size={14} /> City
                                            </label>
                                            <div className="relative">
                                                <input
                                                    name="city"
                                                    value={cityQuery}
                                                    onChange={handleCityChange}
                                                    onFocus={() => { if (cityQuery.length > 0) setShowCitySuggestions(true); }}
                                                    placeholder="Start typing city..."
                                                    className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-xl focus:bg-white focus:ring-4 focus:ring-indigo-100/50 focus:border-indigo-500 focus:outline-none text-sm font-bold transition-all"
                                                    autoComplete="off"
                                                />
                                                {showCitySuggestions && filteredCities.length > 0 && (
                                                    <div className="absolute z-50 left-0 right-0 top-full mt-2 max-h-60 overflow-y-auto bg-white border border-slate-100 rounded-xl shadow-xl">
                                                        {filteredCities.map((city, index) => (
                                                            <button
                                                                key={`${city.city}-${index}`}
                                                                type="button"
                                                                onClick={() => selectCity(city)}
                                                                className="w-full text-left px-5 py-3 hover:bg-indigo-50 transition-colors text-sm font-medium text-slate-700 hover:text-indigo-700 flex justify-between items-center"
                                                            >
                                                                <span>{city.city}</span>
                                                                <span className="text-xs text-slate-400">{city.state}</span>
                                                            </button>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <label className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                                State
                                            </label>
                                            <input
                                                name="state"
                                                value={formData.state}
                                                onChange={handleChange}
                                                placeholder="State"
                                                className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-xl focus:bg-white focus:ring-4 focus:ring-indigo-100/50 focus:border-indigo-500 focus:outline-none text-sm font-bold transition-all"
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <label className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                                Pincode
                                            </label>
                                            <input
                                                name="pincode"
                                                value={formData.pincode}
                                                onChange={handlePincodeChange}
                                                maxLength={6}
                                                placeholder="Pincode"
                                                className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-xl focus:bg-white focus:ring-4 focus:ring-indigo-100/50 focus:border-indigo-500 focus:outline-none text-sm font-bold transition-all"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                            <Info size={14} /> Additional Details
                                        </label>
                                        <input
                                            name="brand"
                                            value={formData.brand}
                                            onChange={handleChange}
                                            placeholder="Appliance Brand (Optional)"
                                            className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-xl focus:bg-white focus:ring-4 focus:ring-indigo-100/50 focus:border-indigo-500 focus:outline-none text-sm font-bold transition-all mb-4"
                                        />
                                        <textarea
                                            name="issue"
                                            value={formData.issue}
                                            onChange={handleChange}
                                            rows={2}
                                            placeholder="Any specific instructions for all items..."
                                            className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:bg-white focus:ring-4 focus:ring-indigo-100/50 focus:border-indigo-500 focus:outline-none text-sm font-bold transition-all resize-none"
                                        />
                                    </div>
                                </div>
                            </form>
                            <div className="mt-10 flex items-center justify-center gap-6 opacity-60 border-t border-slate-50 pt-6">
                                <div className="flex items-center gap-2 text-[9px] font-bold text-slate-400 uppercase tracking-widest">
                                    <ShieldCheck size={16} /> Data Secure
                                </div>
                                <div className="flex items-center gap-2 text-[9px] font-bold text-slate-400 uppercase tracking-widest">
                                    <BadgeCheck size={16} /> Verified Pros
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Side: Order Summary */}
                    <div className="lg:w-[400px] shrink-0 space-y-6">
                        <div className="bg-white p-6 sm:p-8 rounded-[2rem] shadow-xl shadow-indigo-100/50 border border-slate-100 sticky top-24">
                            <h3 className="text-xl font-black text-slate-900 mb-6">Order Summary</h3>

                            {/* Mini Items List */}
                            <div className="space-y-4 mb-6 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                                {cartItems.map(item => (
                                    <div key={item.subServiceId} className="flex gap-4 items-start">
                                        <div className="w-12 h-12 bg-slate-100 rounded-lg overflow-hidden shrink-0">
                                            {item.imageUrl && <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />}
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-sm font-bold text-slate-900 line-clamp-2">{item.name}</p>
                                            <p className="text-xs text-slate-500">{item.category}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-sm font-bold text-slate-900">₹{item.price}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="h-px bg-slate-100 my-6"></div>

                            <div className="space-y-3 mb-8">
                                <div className="flex justify-between text-slate-500 font-medium text-sm">
                                    <span>Subtotal</span>
                                    <span>₹{(totalActualPrice || totalPrice).toLocaleString('en-IN')}</span>
                                </div>
                                {totalSavings > 0 && (
                                    <div className="flex justify-between text-emerald-600 font-bold text-sm">
                                        <span>Savings</span>
                                        <span>-₹{totalSavings.toLocaleString('en-IN')}</span>
                                    </div>
                                )}
                                <div className="h-px bg-slate-100 my-2"></div>
                                <div className="flex justify-between items-end">
                                    <span className="text-slate-900 font-bold text-lg">Total Payable</span>
                                    <span className="text-3xl font-black text-slate-900">₹{totalPrice.toLocaleString('en-IN')}</span>
                                </div>
                            </div>

                            <button
                                onClick={handleCheckout}
                                disabled={submitting || !formData.fullName || !formData.mobile || !formData.address || !formData.city || !formData.pincode}
                                className="w-full py-4 bg-slate-900 text-white font-black text-lg rounded-2xl hover:bg-slate-800 disabled:bg-slate-200 disabled:text-slate-400 disabled:cursor-not-allowed transition-all shadow-lg active:scale-[0.98] flex items-center justify-center gap-3"
                            >
                                {submitting ? (
                                    <span className="flex items-center gap-2 text-base">
                                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                        Processing...
                                    </span>
                                ) : (
                                    <>
                                        Confirm Booking <CheckCircle size={20} />
                                    </>
                                )}
                            </button>
                            {(!formData.fullName || !formData.mobile || !formData.address || !formData.city || !formData.pincode) && (
                                <p className="text-xs text-center text-rose-500 font-bold mt-3 bg-rose-50 py-2 rounded-lg">
                                    Fill all required fields to continue
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CheckoutPage;
