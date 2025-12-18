import React from 'react';
import { PenLine } from 'lucide-react';

export const Header: React.FC = () => {
  return (
    <header className="bg-[#00205b] text-white shadow-md h-16 relative overflow-hidden">
      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center justify-between relative z-10">
        
        {/* Logo Section */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 font-bold text-2xl tracking-tight select-none">
            <div className="bg-white text-[#00205b] p-1.5 rounded-lg shadow-sm">
              <PenLine className="w-5 h-5" />
            </div>
            <div className="flex items-baseline">
              <span className="text-white">Ria</span>
              <span className="text-[#ffcc00]">-Pen</span>
            </div>
          </div>
          
          <div className="hidden sm:flex items-center gap-1.5 ml-3 border-l border-white/20 pl-3">
            <span className="text-xs font-medium text-blue-200 tracking-wide">AI Reflection Tool</span>
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-4">
           <span className="text-xs font-medium text-white/80 hidden sm:block bg-white/10 px-3 py-1 rounded-full">
             Ver. 2.0
           </span>
        </div>
      </div>
      
      {/* Bottom accent line */}
      <div className="absolute bottom-0 left-0 w-full h-[3px] bg-gradient-to-r from-[#00205b] via-[#ffcc00] to-[#00205b] opacity-50"></div>
    </header>
  );
};