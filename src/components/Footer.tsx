
import React from 'react';
import { Facebook, Instagram, Phone, MapPin, Mail, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-900 text-slate-300 py-16 sm:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-16">
          <div className="space-y-6 text-left">
            <Link to="/" className="flex items-center gap-3 justify-start">
              <div className="bg-indigo-600 w-10 h-10 rounded-xl flex items-center justify-center">
                <span className="text-white font-black text-xl">A</span>
              </div>
              <h3 className="text-white font-black text-xl tracking-tight">Antarc Services</h3>
            </Link>
            <p className="text-sm text-slate-400 leading-relaxed max-w-xs sm:mx-0">
              Nanded's top-rated doorstep service for AC and household appliances. Professional work, transparent pricing, 24/7 support.
            </p>
            <div className="flex justify-start gap-5">
              <Facebook size={18} className="hover:text-indigo-400 transition-colors cursor-pointer" />
              <Instagram size={18} className="hover:text-indigo-400 transition-colors cursor-pointer" />
            </div>
          </div>
          
          <div className="text-left">
            <h4 className="text-white font-black text-xs uppercase tracking-[0.2em] mb-8">Useful Links</h4>
            <ul className="space-y-4 text-sm font-bold">
              <li><Link to="/" className="hover:text-indigo-400 transition-colors">Home</Link></li>
              <li><Link to="/gallery" className="hover:text-indigo-400 transition-colors">Gallery</Link></li>
              <li><Link to="/about" className="hover:text-indigo-400 transition-colors">About Us</Link></li>
              <li><Link to="/contact" className="hover:text-indigo-400 transition-colors">Contact Us</Link></li>
            </ul>
          </div>

          <div className="text-left">
            <h4 className="text-white font-black text-xs uppercase tracking-[0.2em] mb-8">Legal</h4>
            <ul className="space-y-4 text-sm font-bold">
              <li><Link to="/terms" className="hover:text-indigo-400 transition-colors">Terms & Conditions</Link></li>
              <li><Link to="/terms" className="hover:text-indigo-400 transition-colors">Privacy Policy</Link></li>
              <li>
                <Link to="/admin/login" className="flex items-center gap-2 justify-start hover:text-indigo-400 transition-colors">
                  <ShieldCheck size={14} /> Admin Login
                </Link>
              </li>
            </ul>
          </div>

          <div className="text-left">
            <h4 className="text-white font-black text-xs uppercase tracking-[0.2em] mb-8">Support</h4>
            <ul className="space-y-6 text-sm font-bold">
              <li className="flex flex-row items-center gap-3 justify-start">
                <Phone size={18} className="text-indigo-400" />
                <span>+91 98765 43210</span>
              </li>
              <li className="flex flex-row items-center gap-3 justify-start">
                <Mail size={18} className="text-indigo-400" />
                <span>help@antarcservices.in</span>
              </li>
              <li className="flex flex-row items-center gap-3 justify-start">
                <MapPin size={18} className="text-indigo-400" />
                <span className="text-left">Shivaji Nagar, Nanded</span>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-slate-800/60 mt-20 pt-10 text-center">
          <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
            © {new Date().getFullYear()} Antarc Services Nanded. Trusted Professional Service.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
