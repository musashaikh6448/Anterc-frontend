
import React from 'react';
import { Users, MapPin, Smile, ShieldCheck, Zap, Star } from 'lucide-react';

const AboutPage: React.FC = () => {
  const stats = [
    { label: 'Happy Clients', value: '5,000+', icon: <Users className="text-indigo-600" /> },
    { label: 'Cities Served', value: 'Maharashtra', icon: <MapPin className="text-emerald-600" /> },
    { label: 'Technicians', value: '25+', icon: <ShieldCheck className="text-indigo-600" /> },
    { label: 'Satisfaction', value: '100%', icon: <Smile className="text-emerald-600" /> }
  ];

  return (
    <div className="pb-24 sm:pb-32 w-full">
      <section className="bg-slate-50 py-16 sm:py-24 border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="max-w-3xl space-y-6">
            <span className="text-indigo-600 font-black text-xs uppercase tracking-[0.3em]">About Antarc Services</span>
            <h1 className="text-4xl sm:text-6xl lg:text-8xl font-black text-slate-900 tracking-tighter leading-[1]">Who We Are</h1>
            <p className="text-lg sm:text-2xl text-slate-500 font-medium leading-relaxed">
              Your most trusted partner for home appliance repairs and maintenance.
            </p>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16 sm:py-32">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 sm:gap-24 items-center">
          <div className="space-y-8">
            <div className="space-y-4">
              <h2 className="text-3xl font-black text-slate-900 tracking-tight">Our Mission</h2>
              <p className="text-slate-600 text-lg leading-relaxed">
                Founded with a vision, Antarc Services was born out of a simple need: reliable, transparent, and quick home appliance services. We understand that a malfunctioning AC or Fridge can disrupt your entire day, which is why we've built a team of background-verified experts available.
              </p>
              <p className="text-slate-600 text-lg leading-relaxed">
                Whether it's a routine service or a major breakdown, we use only 100% genuine spare parts and provide a transparent pricing structure before we start any work.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-6 bg-white border border-slate-100 rounded-3xl shadow-sm space-y-3">
                <Zap size={24} className="text-indigo-600" />
                <h4 className="font-black text-slate-900">Expert Team</h4>
                <p className="text-sm text-slate-500">Every technician undergoes training and verification.</p>
              </div>
              <div className="p-6 bg-white border border-slate-100 rounded-3xl shadow-sm space-y-3">
                <Star size={24} className="text-indigo-600" />
                <h4 className="font-black text-slate-900">Quality Assured</h4>
                <p className="text-sm text-slate-500">Standard 90-day warranty on labor.</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 sm:gap-6">
            {stats.map((stat, idx) => (
              <div key={idx} className="bg-white p-8 sm:p-10 border border-slate-100 rounded-[2.5rem] shadow-xl shadow-slate-200/50 text-center space-y-2">
                <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  {stat.icon}
                </div>
                <h3 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tighter">{stat.value}</h3>
                <p className="text-[10px] sm:text-xs font-black text-slate-400 uppercase tracking-widest">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;
