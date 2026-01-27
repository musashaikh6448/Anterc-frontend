
import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle, Phone, ArrowLeft, Heart } from 'lucide-react';

const SuccessPage: React.FC = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-[85vh] bg-white flex flex-col items-center justify-center p-6 sm:p-8">
      <div className="max-w-xl w-full text-center space-y-10 sm:space-y-12 animate-fade-in">
        
        {/* Animated Icon Section */}
        <div className="relative inline-block">
          <div className="absolute inset-0 bg-indigo-100 rounded-full blur-3xl opacity-60 scale-150 animate-pulse"></div>
          <div className="relative z-10 inline-flex items-center justify-center w-24 h-24 sm:w-32 sm:h-32 bg-indigo-600 rounded-[2.5rem] sm:rounded-[3rem] text-white shadow-[0_20px_50px_-10px_rgba(79,70,229,0.4)] animate-bounce-slow">
            <CheckCircle size={48} className="sm:w-[56px] sm:h-[56px]" strokeWidth={2.5} />
          </div>
        </div>
        
        {/* Success Message */}
        <div className="space-y-4 sm:space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-green-50 rounded-full border border-green-100 text-[10px] font-black text-green-600 uppercase tracking-widest mx-auto">
             Request Received
          </div>
          <h1 className="text-4xl sm:text-6xl font-black text-slate-900 tracking-tighter leading-tight">
            You're all set!
          </h1>
          <p className="text-slate-500 text-lg sm:text-xl font-medium max-w-md mx-auto leading-relaxed">
            Our expert will call you on your mobile in the next <span className="text-indigo-600 font-extrabold underline decoration-indigo-200 underline-offset-4">30 minutes</span> to confirm details.
          </p>
        </div>
        
        {/* Actions Container */}
        <div className="bg-slate-50/50 rounded-[2.5rem] sm:rounded-[3rem] p-8 sm:p-12 border border-slate-100 space-y-8">
          <div className="flex flex-col sm:flex-row gap-4">
            <Link 
              to="/" 
              className="flex-1 flex items-center justify-center gap-3 py-4 sm:py-5 bg-slate-900 text-white font-black text-base rounded-2xl transition-all shadow-xl hover:bg-indigo-600 active:scale-[0.98] btn-hover-effect"
            >
              <ArrowLeft size={18} strokeWidth={3} />
              Home
            </Link>
            <button className="flex-1 flex items-center justify-center gap-3 py-4 sm:py-5 bg-white border-2 border-slate-200 text-slate-900 font-black text-base rounded-2xl hover:border-indigo-600 hover:text-indigo-600 transition-all active:scale-[0.98]">
              <Phone size={20} strokeWidth={3} />
              Help
            </button>
          </div>
          
          <div className="flex items-center justify-center gap-2 text-slate-400 font-bold text-[10px] sm:text-xs uppercase tracking-widest border-t border-slate-200/50 pt-8 leading-none">
            <Heart size={14} className="text-rose-500" fill="currentColor" />
            Thank you for choosing ElectroCare
          </div>
        </div>
        
        {/* Reference ID */}
        <div className="space-y-2">
          <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.2em]">Enquiry Reference</p>
          <div className="inline-block px-4 py-2 bg-slate-100 rounded-xl">
             <p className="text-base sm:text-lg font-black text-slate-900 tracking-tight">#EC-78290-REQ</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SuccessPage;
