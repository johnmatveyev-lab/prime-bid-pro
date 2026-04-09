
import React, { useState, useEffect } from 'react';

const ANALYSIS_STEPS = [
  "Initializing Gemini 3 Pro Reasoning Engine",
  "Parsing Architectural Sheets & Legends",
  "Reading Finish Schedules & Symbols",
  "Filtering Selected Trade Scopes",
  "Calculating Quantities & Geometries",
  "Applying Waste Factors & Production Rates",
  "Building CSI Cost Matrix",
  "Generating Formal AIA Proposal",
  "Compiling Cost Worksheet",
  "Preparing Visual Takeoff Overlays",
  "Finalizing Competitive Analysis"
];

export const LoadingScreen = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const totalDuration = 12000; // 12 seconds
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 1;
      });
    }, totalDuration / 100);

    const stepInterval = setInterval(() => {
      setCurrentStep(prev => {
        if (prev >= ANALYSIS_STEPS.length - 1) {
          clearInterval(stepInterval);
          return prev;
        }
        return prev + 1;
      });
    }, totalDuration / ANALYSIS_STEPS.length);

    return () => {
      clearInterval(interval);
      clearInterval(stepInterval);
    };
  }, []);

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-8 bg-slate-950">
      <div className="max-w-xl w-full">
        <div className="flex flex-col items-center mb-12">
          <div className="relative w-24 h-24 mb-6">
            <div className="absolute inset-0 border-4 border-blue-600/20 rounded-full"></div>
            <div className="absolute inset-0 border-4 border-blue-600 rounded-full border-t-transparent animate-spin"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-xl font-black text-white">{Math.round(progress)}%</span>
            </div>
          </div>
          <h2 className="text-2xl font-black text-white uppercase tracking-tighter">AI Processing Engine</h2>
          <p className="text-blue-500 font-mono text-[10px] uppercase tracking-widest mt-2 animate-pulse">Computing Spatial Parameters</p>
        </div>

        <div className="w-full bg-slate-900 h-1.5 rounded-full overflow-hidden mb-10 border border-white/5">
          <div 
            className="h-full bg-blue-600 shadow-[0_0_20px_rgba(37,99,235,0.6)] transition-all duration-300"
            style={{ width: `${progress}%` }}
          ></div>
        </div>

        <div className="glass p-8 rounded-[2rem] border border-white/5 space-y-4">
          {ANALYSIS_STEPS.map((step, i) => (
            <div key={i} className={`flex items-center gap-4 transition-all duration-500 ${i <= currentStep ? 'opacity-100' : 'opacity-20'}`}>
              <div className={`w-5 h-5 rounded-md flex items-center justify-center border transition-all ${
                i < currentStep 
                  ? 'bg-green-500 border-green-500 shadow-lg shadow-green-500/20' 
                  : i === currentStep ? 'bg-blue-600 border-blue-600 animate-pulse shadow-lg shadow-blue-500/20' : 'border-slate-700'
              }`}>
                {i < currentStep && (
                  <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={4} d="M5 13l4 4L19 7" />
                  </svg>
                )}
                {i === currentStep && <div className="w-1.5 h-1.5 bg-white rounded-full"></div>}
              </div>
              <span className={`text-[11px] font-black uppercase tracking-wider ${i === currentStep ? 'text-blue-400' : 'text-slate-400'}`}>
                {step}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
