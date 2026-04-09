
import React from 'react';

interface HeaderProps {
  activeView: 'ENGINE' | 'GROWTH';
  onViewChange: (view: 'ENGINE' | 'GROWTH') => void;
}

export const Header: React.FC<HeaderProps> = ({ activeView, onViewChange }) => {
  return (
    <header className="glass border-b border-white/10 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center gap-4 cursor-pointer" onClick={() => onViewChange('ENGINE')}>
            <div className="bg-blue-600 text-white p-2 rounded-lg shadow-lg shadow-blue-500/20">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <div>
              <h1 className="text-xl font-black text-white tracking-tight uppercase leading-none">Prime Bid Pro</h1>
              <p className="text-[10px] text-blue-400 font-bold uppercase tracking-[0.2em] mt-1">Industrial Estimating Engine</p>
            </div>
          </div>

          <div className="flex items-center gap-2 bg-slate-900 rounded-xl p-1 border border-white/5">
            <button 
              onClick={() => onViewChange('ENGINE')}
              className={`px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${activeView === 'ENGINE' ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20' : 'text-slate-500 hover:text-slate-300'}`}
            >
              Bid Engine
            </button>
            <button 
              onClick={() => onViewChange('GROWTH')}
              className={`px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${activeView === 'GROWTH' ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20' : 'text-slate-500 hover:text-slate-300'}`}
            >
              Growth Hub
            </button>
          </div>

          <div className="hidden md:flex flex-col items-end">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">System Status</span>
            <span className="text-xs font-semibold text-green-400 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
              Gemini 3 Pro Online
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};
