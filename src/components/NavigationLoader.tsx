
import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const NavigationLoader: React.FC = () => {
  const [visible, setVisible] = useState(false);
  const [progress, setProgress] = useState(0);
  const location = useLocation();

  useEffect(() => {
    // Start loading state
    setVisible(true);
    setProgress(0);
    
    // Fast initial progress
    const timer1 = setTimeout(() => setProgress(30), 10);
    const timer2 = setTimeout(() => setProgress(60), 150);
    const timer3 = setTimeout(() => setProgress(90), 300);
    
    // Finalizing progress
    const timer4 = setTimeout(() => {
      setProgress(100);
      const timer5 = setTimeout(() => {
        setVisible(false);
        setProgress(0);
      }, 250);
      return () => clearTimeout(timer5);
    }, 450);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearTimeout(timer4);
    };
  }, [location.pathname]);

  if (!visible && progress === 0) return null;

  return (
    <div className={`fixed top-0 left-0 w-full z-[999] pointer-events-none transition-opacity duration-300 ${visible ? 'opacity-100' : 'opacity-0'}`}>
      {/* High-Contrast Sharp Progress Bar */}
      <div 
        className="h-[3px] bg-indigo-600 shadow-[0_1px_8px_rgba(79,70,229,0.3)] transition-all duration-300 ease-out"
        style={{ width: `${progress}%` }}
      />
      {/* Transparent overlay without blur */}
      <div className="fixed inset-0 bg-slate-900/[0.02]" />
    </div>
  );
};

export default NavigationLoader;
