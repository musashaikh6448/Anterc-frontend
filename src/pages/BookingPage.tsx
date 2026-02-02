
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { CATEGORIES } from '../constants';
import { ChevronLeft, Calendar, Clock, MapPin, Truck, Smartphone, Info } from 'lucide-react';
import { BookingFormData } from '../types';

const BookingPage: React.FC = () => {
  const { categoryId, serviceId } = useParams<{ categoryId: string; serviceId: string }>();
  const navigate = useNavigate();

  const category = CATEGORIES.find(c => c.id === categoryId);
  const service = category?.services.find(s => s.id === serviceId);

  const [formData, setFormData] = useState<BookingFormData>({
    fullName: '',
    mobile: '',
    city: 'Mumbai',
    address: '',
    brand: '',
    model: '',
    issue: '',
    preferredDate: '',
    preferredTime: '10:00 AM - 12:00 PM',
    bookedFor: 'myself'
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  if (!service) return <div className="p-8 text-center">Service not found</div>;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      navigate('/success');
    }, 1500);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const dates = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i);
    return d.toISOString().split('T')[0];
  });

  const timeSlots = [
    "08:00 AM - 10:00 AM",
    "10:00 AM - 12:00 PM",
    "12:00 PM - 02:00 PM",
    "02:00 PM - 04:00 PM",
    "04:00 PM - 06:00 PM",
    "06:00 PM - 08:00 PM"
  ];

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex items-center gap-4 mb-8">
          <button onClick={() => navigate(-1)} className="p-2 bg-white rounded-full shadow-sm">
            <ChevronLeft size={20} />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Checkout</h1>
            <p className="text-sm text-slate-500">{service.name}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <form id="booking-form" onSubmit={handleSubmit} className="space-y-6">
              {/* Step 1: Contact Details */}
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                <div className="flex items-center gap-2 mb-6 border-b border-slate-50 pb-4">
                  <div className="p-2 bg-indigo-50 rounded-lg text-indigo-600">
                    <Smartphone size={20} />
                  </div>
                  <h3 className="font-bold text-slate-900">Contact Details</h3>
                </div>

                {/* Booked For Switch */}
                <div className="mb-6 bg-slate-50 p-1 rounded-xl flex">
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, bookedFor: 'myself' })}
                    className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${formData.bookedFor === 'myself'
                        ? 'bg-white text-indigo-600 shadow-sm'
                        : 'text-slate-500 hover:text-slate-700'
                      }`}
                  >
                    For Myself
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, bookedFor: 'others' })}
                    className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${formData.bookedFor === 'others'
                        ? 'bg-white text-indigo-600 shadow-sm'
                        : 'text-slate-500 hover:text-slate-700'
                      }`}
                  >
                    For Someone Else
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-500 uppercase">Full Name</label>
                    <input
                      required
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleChange}
                      placeholder={formData.bookedFor === 'myself' ? "Enter your name" : "Enter friend's name"}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none text-sm transition-all"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-500 uppercase">Mobile Number</label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm text-slate-500 border-r pr-2">+91</span>
                      <input
                        required
                        name="mobile"
                        value={formData.mobile}
                        onChange={handleChange}
                        pattern="[0-9]{10}"
                        placeholder="10-digit number"
                        className="w-full pl-16 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none text-sm transition-all"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Step 2: Address */}
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                <div className="flex items-center gap-2 mb-6 border-b border-slate-50 pb-4">
                  <div className="p-2 bg-indigo-50 rounded-lg text-indigo-600">
                    <MapPin size={20} />
                  </div>
                  <h3 className="font-bold text-slate-900">Service Address</h3>
                </div>

                <div className="space-y-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-500 uppercase">City</label>
                    <select
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none text-sm transition-all"
                    >
                      <option>Mumbai</option>
                      <option>Delhi</option>
                      <option>Bangalore</option>
                      <option>Pune</option>
                      <option>Hyderabad</option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-500 uppercase">Full Address</label>
                    <textarea
                      required
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      rows={3}
                      placeholder="House No., Street Name, Landmark..."
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none text-sm transition-all"
                    />
                  </div>
                </div>
              </div>

              {/* Step 3: Appliance Info */}
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                <div className="flex items-center gap-2 mb-6 border-b border-slate-50 pb-4">
                  <div className="p-2 bg-indigo-50 rounded-lg text-indigo-600">
                    <Info size={20} />
                  </div>
                  <h3 className="font-bold text-slate-900">Appliance Details</h3>
                </div>

                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-500 uppercase">Brand (Optional)</label>
                      <input
                        name="brand"
                        value={formData.brand}
                        onChange={handleChange}
                        placeholder="e.g. Samsung, LG"
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none text-sm transition-all"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-500 uppercase">Model (Optional)</label>
                      <input
                        name="model"
                        value={formData.model}
                        onChange={handleChange}
                        placeholder="e.g. Inverter V3"
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none text-sm transition-all"
                      />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-500 uppercase">Describe Issue (Optional)</label>
                    <textarea
                      name="issue"
                      value={formData.issue}
                      onChange={handleChange}
                      rows={2}
                      placeholder="Briefly describe the problem..."
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none text-sm transition-all"
                    />
                  </div>
                </div>
              </div>

              {/* Step 4: Schedule */}
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                <div className="flex items-center gap-2 mb-6 border-b border-slate-50 pb-4">
                  <div className="p-2 bg-indigo-50 rounded-lg text-indigo-600">
                    <Calendar size={20} />
                  </div>
                  <h3 className="font-bold text-slate-900">Preferred Schedule</h3>
                </div>

                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase">Select Date</label>
                    <div className="flex gap-2 overflow-x-auto pb-2 custom-scrollbar">
                      {dates.map((date) => {
                        const d = new Date(date);
                        const isSelected = formData.preferredDate === date;
                        return (
                          <button
                            key={date}
                            type="button"
                            onClick={() => setFormData({ ...formData, preferredDate: date })}
                            className={`flex flex-col items-center justify-center min-w-[70px] h-20 rounded-xl border transition-all ${isSelected ? 'bg-indigo-600 border-indigo-600 text-white' : 'bg-slate-50 border-slate-200 text-slate-700 hover:border-indigo-300'
                              }`}
                          >
                            <span className="text-[10px] uppercase font-bold opacity-75">{d.toLocaleDateString('en-US', { weekday: 'short' })}</span>
                            <span className="text-lg font-bold">{d.getDate()}</span>
                            <span className="text-[10px] uppercase font-medium opacity-75">{d.toLocaleDateString('en-US', { month: 'short' })}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase">Select Time Slot</label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {timeSlots.map(slot => (
                        <button
                          key={slot}
                          type="button"
                          onClick={() => setFormData({ ...formData, preferredTime: slot })}
                          className={`flex items-center gap-3 px-4 py-3 rounded-xl border text-sm font-medium transition-all ${formData.preferredTime === slot ? 'bg-indigo-50 border-indigo-500 text-indigo-700' : 'bg-slate-50 border-slate-200 text-slate-600 hover:border-indigo-300'
                            }`}
                        >
                          <Clock size={16} />
                          {slot}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </form>
          </div>

          {/* Bill Summary */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 sticky top-24">
              <h3 className="font-bold text-slate-900 mb-6">Order Summary</h3>

              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">{service.name}</span>
                  <span className="font-bold">₹{service.price}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Service Fee</span>
                  <span className="text-green-600 font-bold">FREE</span>
                </div>
                <div className="flex justify-between text-sm border-t border-dashed pt-4">
                  <span className="font-bold text-slate-900">Total Amount</span>
                  <span className="font-extrabold text-indigo-600 text-lg">₹{service.price}</span>
                </div>
              </div>

              <div className="bg-slate-50 rounded-xl p-4 flex gap-3 mb-6">
                <Truck size={20} className="text-indigo-600 shrink-0" />
                <p className="text-[10px] text-slate-500 leading-tight">
                  Trained professional will bring all necessary tools.
                  <span className="font-bold text-slate-700 block mt-1">Payment to be made after service.</span>
                </p>
              </div>

              <button
                form="booking-form"
                disabled={loading || !formData.preferredDate}
                className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 text-white font-bold rounded-xl transition-all shadow-lg shadow-indigo-200 flex items-center justify-center gap-2"
              >
                {loading ? 'Processing...' : 'Confirm Booking'}
              </button>

              {!formData.preferredDate && (
                <p className="text-[10px] text-red-500 text-center mt-2 font-medium uppercase">Please select a service date</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingPage;
