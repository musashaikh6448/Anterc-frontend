
import React, { useState } from 'react';
import { MapPin, Phone, Mail, Send } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ContactPage: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      navigate('/success');
    }, 1500);
  };

  return (
    <div className="pb-24 sm:pb-32 w-full">
      <section className="bg-slate-50 py-16 sm:py-24 border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="max-w-3xl space-y-4">
            <span className="text-indigo-600 font-black text-xs uppercase tracking-[0.3em]">Get In Touch</span>
            <h1 className="text-4xl sm:text-6xl lg:text-8xl font-black text-slate-900 tracking-tighter leading-[1]">Contact Us</h1>
            <p className="text-lg text-slate-500 font-medium">We're here to help you 24/7 with any appliance issues in Nanded.</p>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16 sm:py-32">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-16 lg:gap-24">
          <div className="space-y-12">
            <div className="space-y-8">
              <div className="flex gap-6 items-start">
                <div className="w-14 h-14 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600 shrink-0">
                  <MapPin size={28} />
                </div>
                <div className="space-y-1">
                  <h4 className="font-black text-slate-900">Office Address</h4>
                  <p className="text-slate-500 font-medium">Shivaji Nagar, Nanded,<br />Maharashtra 431602</p>
                </div>
              </div>
              <div className="flex gap-6 items-start">
                <div className="w-14 h-14 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600 shrink-0">
                  <Phone size={28} />
                </div>
                <div className="space-y-1">
                  <h4 className="font-black text-slate-900">Phone</h4>
                  <p className="text-slate-500 font-medium">+91 98765 43210</p>
                  <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">Available 24/7</p>
                </div>
              </div>
              <div className="flex gap-6 items-start">
                <div className="w-14 h-14 bg-slate-100 rounded-2xl flex items-center justify-center text-slate-600 shrink-0">
                  <Mail size={28} />
                </div>
                <div className="space-y-1">
                  <h4 className="font-black text-slate-900">Email</h4>
                  <p className="text-slate-500 font-medium">help@antarcservices.in</p>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-2">
            <div className="bg-white rounded-[2.5rem] p-8 sm:p-12 border border-slate-100 shadow-2xl">
              <h2 className="text-3xl font-black text-slate-900 tracking-tight mb-8">Send an Enquiry</h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Full Name</label>
                    <input required className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:bg-white focus:ring-4 focus:ring-indigo-100 outline-none transition-all font-bold" placeholder="Your name" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Mobile Number</label>
                    <input required type="tel" className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:bg-white focus:ring-4 focus:ring-indigo-100 outline-none transition-all font-bold" placeholder="+91 00000 00000" />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Subject</label>
                  <input required className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:bg-white focus:ring-4 focus:ring-indigo-100 outline-none transition-all font-bold" placeholder="How can we help?" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Message</label>
                  <textarea required rows={4} className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:bg-white focus:ring-4 focus:ring-indigo-100 outline-none transition-all font-bold resize-none" placeholder="Details of your appliance issue..."></textarea>
                </div>
                <button type="submit" disabled={loading} className="w-full py-5 bg-slate-900 hover:bg-indigo-600 text-white font-black rounded-2xl transition-all shadow-xl flex items-center justify-center gap-3">
                  {loading ? 'Sending...' : 'Send Enquiry'}
                  <Send size={20} />
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ContactPage;
