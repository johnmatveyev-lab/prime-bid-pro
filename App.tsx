
import React, { useState, useEffect } from 'react';
import { generateBid } from './services/geminiService';
import { FileUpload } from './components/FileUpload';
import { BidResults } from './components/BidResults';
import { Header } from './components/Header';
import { LoadingScreen } from './components/LoadingScreen';
import { AnalysisError } from './components/AnalysisError';
import { ScopeSelector } from './components/ScopeSelector';
import { GrowthHub } from './components/GrowthHub';
import { MarketProfileEditor } from './components/MarketProfileEditor';
import { HIERARCHICAL_SCOPES, BidFormat, BidAnalysisResult, Division, MarketProfile, DEFAULT_MARKET_PROFILE } from './types';

export default function App() {
  const [activeView, setActiveView] = useState<'ENGINE' | 'GROWTH'>('ENGINE');
  const [step, setStep] = useState<'UPLOAD' | 'SCOPES' | 'PROFILE' | 'LOADING' | 'RESULTS'>('UPLOAD');
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState<BidAnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  const [divisions, setDivisions] = useState<Division[]>(HIERARCHICAL_SCOPES);
  const [bidFormat, setBidFormat] = useState<BidFormat>('BOTH');

  // Persistence
  const [marketProfile, setMarketProfile] = useState<MarketProfile>(() => {
    const saved = localStorage.getItem('primebidpro_profile');
    return saved ? JSON.parse(saved) : DEFAULT_MARKET_PROFILE;
  });

  useEffect(() => {
    localStorage.setItem('primebidpro_profile', JSON.stringify(marketProfile));
  }, [marketProfile]);

  const handleFileSelect = (selectedFile: File) => {
    setFile(selectedFile);
    setStep('SCOPES');
    setError(null);
    setResult(null);
  };

  const handleGenerate = async () => {
    if (!file) return;
    
    const selectedSubItems = divisions.flatMap(d => d.trades).flatMap(t => t.subItems).filter(si => si.selected);
    
    if (selectedSubItems.length === 0) {
      alert("Please select at least one sub-item to analyze.");
      return;
    }

    setStep('LOADING');
    setIsProcessing(true);
    setError(null);

    try {
      const bidResult = await generateBid(file, selectedSubItems, bidFormat, marketProfile);
      setResult(bidResult);
      setStep('RESULTS');
    } catch (err: any) {
      console.error(err);
      setError(err.message || "The engine encountered an error while processing the documents.");
      setStep('UPLOAD');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReset = () => {
    setFile(null);
    setResult(null);
    setError(null);
    setStep('UPLOAD');
  };

  return (
    <div className="flex flex-col h-screen bg-slate-950 overflow-hidden">
      <Header activeView={activeView} onViewChange={setActiveView} />
      
      <main className="flex-1 overflow-y-auto">
        {activeView === 'GROWTH' ? (
          <GrowthHub />
        ) : (
          <div className="max-w-6xl mx-auto h-full px-6 py-8 md:px-12 md:py-16">
            
            {step === 'UPLOAD' && !error && (
              <div className="flex-1 flex flex-col items-center justify-center animate-in fade-in zoom-in duration-500">
                <div className="text-center mb-12 max-w-3xl">
                  <div className="inline-block bg-blue-600/10 border border-blue-500/20 rounded-full px-4 py-1.5 mb-6">
                     <p className="text-[10px] font-black uppercase text-blue-400 tracking-[0.25em]">AIA Certified Bid Engine v3.0</p>
                  </div>
                  <h1 className="text-5xl md:text-6xl font-black text-white mb-6 tracking-tight leading-[1.1]">
                    Visual Takeoffs <br/>
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-blue-600">Spatial Intelligence</span>
                  </h1>
                  <p className="text-lg text-slate-400 font-medium max-w-2xl mx-auto leading-relaxed">
                    Prime Bid Pro identifies architectural boundaries, computes exact material volumes, and generates professional AIA bid documentation instantly.
                  </p>
                </div>
                <FileUpload onFileSelect={handleFileSelect} />
              </div>
            )}

            {step === 'SCOPES' && file && (
               <div className="flex-1 flex flex-col items-center justify-center animate-in slide-in-from-bottom-8 duration-500">
                  <div className="glass p-10 rounded-[2.5rem] shadow-2xl max-w-2xl w-full border border-white/5 relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-600 to-blue-400"></div>
                    <div className="flex items-center justify-between mb-10">
                      <h3 className="text-xl font-black text-white uppercase tracking-tighter">Bid Configuration</h3>
                      <button onClick={handleReset} className="text-[10px] font-bold text-slate-500 hover:text-white transition-colors uppercase tracking-widest">Change Plan</button>
                    </div>

                    <ScopeSelector divisions={divisions} setDivisions={setDivisions} />
                    
                    <div className="flex items-center gap-3 mb-6 bg-slate-900/50 p-4 rounded-2xl border border-white/5">
                      <div className="bg-blue-600/20 p-2 rounded-lg text-blue-500">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                      </div>
                      <div className="flex-1">
                        <p className="text-[10px] font-black text-white uppercase tracking-tight">Active Profile: {marketProfile.marketRegion}</p>
                        <p className="text-[9px] text-slate-500 font-bold uppercase tracking-widest">{marketProfile.projectType} • {marketProfile.positioning}</p>
                      </div>
                      <button 
                        onClick={() => setStep('PROFILE')}
                        className="text-[9px] font-black text-blue-500 hover:text-blue-400 uppercase tracking-widest"
                      >Adjust</button>
                    </div>

                    <button 
                      onClick={() => setStep('PROFILE')}
                      className="w-full py-5 bg-blue-600 hover:bg-blue-500 text-white font-black uppercase tracking-[0.3em] text-[11px] rounded-[1.5rem] shadow-2xl shadow-blue-500/20 transition-all transform active:scale-95 flex items-center justify-center gap-4"
                    >
                      Next: Market Profile →
                    </button>
                  </div>
               </div>
            )}

            {step === 'PROFILE' && (
              <MarketProfileEditor 
                profile={marketProfile} 
                onChange={setMarketProfile} 
                onSave={handleGenerate} 
              />
            )}

            {step === 'LOADING' && <LoadingScreen />}
            {error && <AnalysisError message={error} onRetry={handleReset} />}
            {step === 'RESULTS' && result && file && (
              <div className="h-full animate-in fade-in duration-700">
                <BidResults result={result} onNewEstimate={handleReset} fileName={file.name} file={file} marketProfile={marketProfile} />
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
