
import React from 'react';

interface AnalysisErrorProps {
  message: string;
  onRetry: () => void;
}

export const AnalysisError: React.FC<AnalysisErrorProps> = ({ message, onRetry }) => {
  return (
    <div className="flex-1 flex flex-col items-center justify-center p-8 animate-in fade-in zoom-in duration-300">
      <div className="w-20 h-20 bg-red-500/10 text-red-500 rounded-3xl flex items-center justify-center mb-8 border border-red-500/20 shadow-2xl shadow-red-500/10">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      </div>
      <h2 className="text-2xl font-black text-white mb-3 uppercase tracking-tighter">Analysis Interrupted</h2>
      <p className="text-slate-400 mb-10 max-w-md text-center text-sm leading-relaxed font-medium">
        {message || "An unexpected error occurred while processing the architectural set. Please verify the file format and try again."}
      </p>
      <button 
        onClick={onRetry}
        className="px-10 py-4 bg-white text-slate-950 hover:bg-slate-200 font-black uppercase tracking-widest text-xs rounded-2xl transition-all transform active:scale-95 shadow-xl shadow-white/5"
      >
        Return to Dashboard
      </button>
    </div>
  );
};
