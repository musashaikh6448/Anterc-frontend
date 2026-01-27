
import React from 'react';
import { TERMS_SECTIONS } from '../constants';

const TermsPage: React.FC = () => {
  return (
    <div className="pb-24 sm:pb-32 w-full">
      <section className="bg-slate-50 py-16 sm:py-24 border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="max-w-3xl space-y-4">
            <span className="text-indigo-600 font-black text-xs uppercase tracking-[0.3em]">Legal</span>
            <h1 className="text-4xl sm:text-6xl lg:text-8xl font-black text-slate-900 tracking-tighter leading-[1]">Terms & Conditions</h1>
            <p className="text-lg text-slate-500 font-medium">Please read these carefully before using Antarc Services.</p>
          </div>
        </div>
      </section>

      <section className="max-w-4xl mx-auto px-4 sm:px-6 py-16 sm:py-32">
        <div className="space-y-12">
          {TERMS_SECTIONS.map((section) => (
            <div key={section.id} className="space-y-4">
              <div className="flex items-center gap-4">
                <span className="w-10 h-10 bg-indigo-600 text-white flex items-center justify-center rounded-xl font-black">{section.id}</span>
                <h2 className="text-2xl font-black text-slate-900 tracking-tight">{section.title}</h2>
              </div>
              <p className="text-slate-600 leading-relaxed text-lg pl-14">
                {section.content}
              </p>
            </div>
          ))}
          
          <div className="pt-12 border-t border-slate-100">
            <p className="text-slate-400 text-sm italic">Last updated: May 2024</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default TermsPage;
