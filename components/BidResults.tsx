
import React, { useState, useMemo, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { BidAnalysisResult, TakeoffPolygon, MarketProfile, Point } from '../types';
import { GoogleGenAI } from "@google/genai";
import { editTakeoff } from '../services/geminiService';

interface BidResultsProps {
  result: BidAnalysisResult;
  onNewEstimate: () => void;
  fileName: string;
  file: File;
  marketProfile: MarketProfile;
}

export const BidResults: React.FC<BidResultsProps> = ({ result: initialResult, onNewEstimate, fileName, file, marketProfile }) => {
  const isPdf = file.type === 'application/pdf';
  const [activeTab, setActiveTab] = useState<'visual' | 'cost' | 'proposal' | 'sales'>(isPdf ? 'cost' : 'visual');
  const [selectedPolygon, setSelectedPolygon] = useState<TakeoffPolygon | null>(null);
  const [currentResult, setCurrentResult] = useState<BidAnalysisResult>(initialResult);
  
  // AI Edit State
  const [isEditing, setIsEditing] = useState(false);
  const [editCommand, setEditCommand] = useState('');
  const [showEditBar, setShowEditBar] = useState(false);

  const polygons = useMemo(() => currentResult?.visualTakeoff?.polygons || [], [currentResult]);
  const [visibleScopes, setVisibleScopes] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (polygons.length > 0 && visibleScopes.size === 0) {
      setVisibleScopes(new Set(polygons.map(p => p.scopeCode)));
    }
  }, [polygons]);

  const [salesPitch, setSalesPitch] = useState<string | null>(null);
  const [isGeneratingPitch, setIsGeneratingPitch] = useState(false);

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(val);
  };

  const getTotalEstimate = () => {
    const worksheet = currentResult?.costWorksheet || [];
    return worksheet.reduce((acc, div) => acc + (div.items || []).reduce((sum, item) => sum + item.total, 0), 0);
  };

  const handleEditTakeoff = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editCommand.trim()) return;
    
    setIsEditing(true);
    try {
      const updated = await editTakeoff(currentResult, editCommand, marketProfile);
      setCurrentResult(updated);
      setEditCommand('');
      setShowEditBar(false);
      setSalesPitch(null); 
      setSelectedPolygon(null);
    } catch (err) {
      alert("Failed to refine takeoff. Please try a different command.");
    } finally {
      setIsEditing(false);
    }
  };

  const handleGeneratePitch = async () => {
    if (salesPitch) {
      setActiveTab('sales');
      return;
    }
    setIsGeneratingPitch(true);
    setActiveTab('sales');
    const positioningGoal = {
      'Competitive': 'Focus on cost-efficiency, speed, and standard commercial quality.',
      'Standard': 'Focus on balanced quality, reliability, and professional standard practices.',
      'Premium': 'Focus on risk mitigation, extreme precision, high-touch communication, and superior longevity.'
    }[marketProfile.positioning];

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Based on this bid analysis for a ${marketProfile.projectType} project in ${marketProfile.marketRegion}. Strategy: ${positioningGoal}. Total: ${formatCurrency(getTotalEstimate())}. Bid: \n${currentResult.markdown}`,
      });
      setSalesPitch(response.text || "Failed to generate pitch.");
    } catch (e) {
      setSalesPitch("Error generating sales strategy.");
    } finally {
      setIsGeneratingPitch(false);
    }
  };

  const filteredPolygons = useMemo(() => {
    return polygons.filter(p => visibleScopes.has(p.scopeCode));
  }, [polygons, visibleScopes]);

  const toggleScopeVisibility = (code: string) => {
    setVisibleScopes(prev => {
      const next = new Set(prev);
      if (next.has(code)) next.delete(code);
      else next.add(code);
      return next;
    });
  };

  const scrollToCostLine = (polygonId: string) => {
    setActiveTab('cost');
    setTimeout(() => {
      const el = document.getElementById(`cost-line-${polygonId}`);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        el.classList.add('bg-blue-600/30');
        setTimeout(() => el.classList.remove('bg-blue-600/30'), 3000);
      }
    }, 100);
  };

  const calculateCentroid = (points: Point[]) => {
    if (!points.length) return { x: 500, y: 500 };
    const sumX = points.reduce((sum, p) => sum + p.x, 0);
    const sumY = points.reduce((sum, p) => sum + p.y, 0);
    return { x: sumX / points.length, y: sumY / points.length };
  };

  const centroid = useMemo(() => {
    if (!selectedPolygon) return null;
    return calculateCentroid(selectedPolygon.points);
  }, [selectedPolygon]);

  const worksheet = currentResult?.costWorksheet || [];

  return (
    <div className="flex flex-col h-full bg-slate-950 border border-white/10 rounded-3xl overflow-hidden shadow-2xl relative">
      {/* AI EDITING OVERLAY */}
      {isEditing && (
        <div className="absolute inset-0 z-[100] glass flex flex-col items-center justify-center animate-in fade-in duration-300">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-6"></div>
          <p className="text-[10px] font-black text-white uppercase tracking-[0.3em] animate-pulse">AI Recalculating Takeoff Parameters...</p>
        </div>
      )}

      {/* Navigation Tabs */}
      <div className="flex justify-center bg-slate-900/80 backdrop-blur-md shrink-0 border-b border-white/5 print:hidden">
        <div className="flex p-2 gap-1 overflow-x-auto no-scrollbar">
          {[
            { id: 'visual', label: 'Visual Takeoff', icon: '📐', disabled: isPdf },
            { id: 'cost', label: 'Cost Matrix', icon: '📊', disabled: false },
            { id: 'proposal', label: 'Bid Package', icon: '📝', disabled: false },
            { id: 'sales', label: 'Sales Pitch', icon: '🎯', disabled: false }
          ].map((tab) => (
            <button 
              key={tab.id}
              disabled={tab.disabled}
              onClick={() => tab.id === 'sales' ? handleGeneratePitch() : setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all
                ${tab.disabled ? 'opacity-20 cursor-not-allowed' : 'hover:bg-white/5'}
                ${activeTab === tab.id ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20' : 'text-slate-500'}`}
            >
              <span>{tab.icon}</span>
              <span className="hidden sm:inline">{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 relative overflow-hidden flex flex-col md:flex-row">
        {activeTab === 'visual' && !isPdf && (
          <>
            {/* Sidebar for Layers - Fully Responsive Stacking */}
            <div className="w-full md:w-64 bg-slate-900/50 border-b md:border-b-0 md:border-r border-white/5 p-4 md:p-6 shrink-0 flex flex-col max-h-[40vh] md:max-h-full">
              <div className="flex items-center justify-between mb-4 md:mb-6 shrink-0">
                <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Trade Layers</h4>
              </div>
              
              <div className="flex-1 overflow-y-auto space-y-2 pr-2 custom-scrollbar">
                {Array.from(new Set(polygons.map(p => p.scopeCode))).sort().map(code => (
                  <label key={code} className="flex items-center gap-3 cursor-pointer group p-2 hover:bg-white/5 rounded-lg transition-colors border border-transparent hover:border-white/5">
                    <input 
                      type="checkbox" 
                      checked={visibleScopes.has(code)}
                      onChange={() => toggleScopeVisibility(code)}
                      className="w-4 h-4 rounded bg-slate-800 border-slate-700 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-[10px] font-bold text-slate-400 group-hover:text-white uppercase truncate flex-1">{code}</span>
                  </label>
                ))}
              </div>

              {/* AI EDIT TRIGGER BUTTON */}
              <div className="mt-4 md:mt-6 pt-4 md:pt-6 border-t border-white/5 shrink-0">
                <button 
                  onClick={() => setShowEditBar(!showEditBar)}
                  className={`w-full flex items-center justify-center gap-3 py-3 md:py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all active:scale-95
                    ${showEditBar 
                      ? 'bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20' 
                      : 'bg-blue-600 text-white shadow-xl shadow-blue-500/20 hover:bg-blue-500'}`}
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a2 2 0 00-1.96 1.414l-.477 2.387a2 2 0 00.547 1.96l1.414.477a2 2 0 001.96-1.414l.477-2.387a2 2 0 00-.547-1.022zM8.336 8.336a2 2 0 102.828 2.828 2 2 0 00-2.828-2.828z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M10.344 11.758l6.896 6.896M11.758 10.344l6.896 6.896" />
                  </svg>
                  {showEditBar ? 'Close' : 'Refine with AI'}
                </button>
              </div>
            </div>

            {/* Main Visualizer Area - Enhanced for Mobile Panning */}
            <div className="flex-1 relative bg-slate-950 flex flex-col items-center justify-center p-2 md:p-8 overflow-auto group custom-scrollbar select-none">
              {/* AI COMMAND BAR - Optimized for Small Screens */}
              {showEditBar && (
                <div className="absolute top-4 md:top-8 left-1/2 -translate-x-1/2 w-[95%] md:w-[90%] max-w-lg z-[60] animate-in slide-in-from-top-4 duration-300">
                  <form onSubmit={handleEditTakeoff} className="glass p-2 rounded-[1.5rem] md:rounded-[2rem] flex gap-2 border border-blue-500/40 shadow-[0_0_50px_rgba(37,99,235,0.2)] bg-slate-900/90 backdrop-blur-2xl">
                    <input 
                      autoFocus
                      type="text"
                      value={editCommand}
                      onChange={(e) => setEditCommand(e.target.value)}
                      placeholder="e.g. 'Add 10% waste'"
                      className="flex-1 bg-transparent border-none focus:ring-0 text-white text-sm placeholder:text-slate-600 px-3 py-1"
                    />
                    <button type="submit" className="bg-blue-600 text-white px-4 md:px-6 py-2 rounded-xl md:rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-500 transition-all shadow-lg shadow-blue-500/20 active:scale-95">
                      Apply
                    </button>
                  </form>
                </div>
              )}

              <div 
                className="relative inline-block bg-white shadow-[0_0_100px_rgba(0,0,0,0.5)] rounded-lg overflow-visible cursor-crosshair touch-none"
                onClick={() => setSelectedPolygon(null)}
              >
                <img 
                  src={currentResult?.visualTakeoff?.baseImage} 
                  alt="Architectural Sheet" 
                  className="max-w-none select-none h-auto w-auto"
                  style={{ maxHeight: 'calc(100vh - 200px)', display: 'block' }}
                />
                <svg viewBox="0 0 1000 1000" className="absolute inset-0 w-full h-full pointer-events-none" preserveAspectRatio="none">
                  {filteredPolygons.map((poly) => (
                    <polygon
                      key={poly.id}
                      points={poly.points.map(p => `${p.x},${p.y}`).join(' ')}
                      fill={poly.color || '#3b82f6'}
                      fillOpacity={selectedPolygon?.id === poly.id ? "0.6" : "0.3"}
                      stroke={poly.color || '#3b82f6'}
                      strokeWidth={selectedPolygon?.id === poly.id ? "6" : "2"}
                      strokeDasharray={selectedPolygon?.id === poly.id ? "10,5" : "none"}
                      className="pointer-events-auto cursor-pointer hover:fill-opacity-50 transition-all"
                      onClick={(e) => { e.stopPropagation(); setSelectedPolygon(poly); }}
                    />
                  ))}
                </svg>

                {/* FLOATING POLYGON OVERLAY - Responsive Positioning and Bounds Checking */}
                {selectedPolygon && centroid && (
                  <div 
                    className="absolute pointer-events-auto z-[70] animate-in zoom-in-95 fade-in duration-200"
                    style={{ 
                      left: `${(centroid.x / 1000) * 100}%`, 
                      top: `${(centroid.y / 1000) * 100}%`,
                      transform: 'translate(-50%, -105%)'
                    }}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="glass p-4 md:p-5 rounded-2xl md:rounded-3xl border border-blue-500/50 shadow-2xl w-[250px] md:w-72 ring-4 md:ring-8 ring-blue-500/5 bg-slate-900/95 backdrop-blur-xl">
                      <div className="flex justify-between items-start mb-3 md:mb-4">
                        <div className="bg-blue-600/20 px-2 py-0.5 md:px-3 md:py-1 rounded-full text-[8px] md:text-[9px] font-black text-blue-400 uppercase tracking-widest border border-blue-500/20">
                          {selectedPolygon.scopeCode}
                        </div>
                        <button 
                          onClick={() => setSelectedPolygon(null)} 
                          className="text-slate-500 hover:text-white transition-colors bg-white/5 p-1 rounded-full"
                        >
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" /></svg>
                        </button>
                      </div>
                      
                      <div className="mb-3 md:mb-4">
                        <h5 className="text-[10px] md:text-[11px] font-black text-white uppercase tracking-tight mb-1 md:mb-2 border-b border-white/5 pb-1 md:pb-2 truncate">{selectedPolygon.label}</h5>
                        <div className="flex items-baseline gap-2">
                          <span className="text-2xl md:text-3xl font-black text-white tracking-tighter">{selectedPolygon.qty}</span>
                          <span className="text-[9px] md:text-[10px] font-black text-blue-500 uppercase tracking-[0.2em]">{selectedPolygon.unit}</span>
                        </div>
                      </div>

                      <div className="bg-slate-950/50 rounded-xl md:rounded-2xl p-2 md:p-3 mb-3 md:mb-4 border border-white/5 max-h-24 overflow-y-auto custom-scrollbar">
                        <p className="text-[7px] md:text-[8px] font-black text-slate-500 uppercase tracking-[0.2em] mb-1">Logic</p>
                        <p className="text-[9px] md:text-[10px] text-slate-300 leading-relaxed font-medium">
                          {selectedPolygon.explanation}
                        </p>
                      </div>

                      <button 
                        onClick={() => scrollToCostLine(selectedPolygon.id)}
                        className="w-full py-2 md:py-3 bg-blue-600 hover:bg-blue-500 text-white text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] rounded-xl md:rounded-2xl transition-all shadow-lg shadow-blue-600/20 active:scale-95 flex items-center justify-center gap-2"
                      >
                        Ledger
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </>
        )}

        {/* COST TAB */}
        {activeTab === 'cost' && (
          <div className="flex-1 overflow-y-auto p-4 md:p-12 space-y-6 md:space-y-8 animate-in fade-in duration-500 custom-scrollbar">
            <div className="max-w-6xl mx-auto flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6 border-b border-white/10 pb-6 md:pb-10">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></span>
                  <p className="text-[10px] font-black text-blue-500 uppercase tracking-[0.2em]">Estimating Ledger</p>
                </div>
                <h2 className="text-3xl md:text-4xl font-black text-white uppercase tracking-tighter">CSI Cost Matrix</h2>
              </div>
              
              <div className="glass px-6 py-4 md:px-8 md:py-6 rounded-2xl md:rounded-[2rem] border border-blue-500/30 flex items-center gap-6 md:gap-10 bg-blue-600/5 w-full lg:w-auto">
                <div className="text-right w-full">
                  <p className="text-[9px] font-black text-blue-500 uppercase mb-1">Total Valuation</p>
                  <p className="text-3xl md:text-4xl font-black text-white leading-none tracking-tighter">{formatCurrency(getTotalEstimate())}</p>
                </div>
              </div>
            </div>

            <div className="max-w-6xl mx-auto space-y-8 md:space-y-12 pb-32">
              {worksheet.map((div) => (
                <div key={div.id} className="glass rounded-2xl md:rounded-[2.5rem] overflow-hidden border border-white/5 shadow-2xl">
                  <div className="bg-white/5 px-6 py-4 md:px-8 md:py-6 border-b border-white/5">
                    <h3 className="text-base md:text-lg font-black text-white uppercase tracking-tight flex items-center gap-3">
                      <span className="text-blue-500 font-mono text-xs md:text-sm bg-blue-500/10 px-2 py-0.5 md:px-3 md:py-1 rounded-full">DIV {div.id}</span>
                      {div.name}
                    </h3>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse min-w-[600px]">
                      <thead>
                        <tr className="bg-slate-900/50 text-[9px] font-black text-slate-500 uppercase tracking-widest border-b border-white/5">
                          <th className="p-4 md:p-6">Trade Scope</th>
                          <th className="p-4 md:p-6 text-center">Qty</th>
                          <th className="p-4 md:p-6 text-center">Unit</th>
                          <th className="p-4 md:p-6 text-right">Labor</th>
                          <th className="p-4 md:p-6 text-right">Material</th>
                          <th className="p-4 md:p-6 text-right bg-blue-600/5">Extended</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5">
                        {div.items.map((item) => (
                          <tr key={item.id} id={`cost-line-${item.id}`} className="hover:bg-white/5 transition-all group">
                            <td className="p-4 md:p-6">
                              <p className="text-xs font-black text-white uppercase">{item.scope}</p>
                              {!isPdf && polygons.some(p => p.id === item.id) && (
                                <button 
                                  onClick={() => { 
                                    setActiveTab('visual'); 
                                    const poly = polygons.find(p => p.id === item.id);
                                    if (poly) setSelectedPolygon(poly); 
                                  }}
                                  className="text-[9px] font-bold text-blue-500 hover:text-blue-400 uppercase mt-2 flex items-center gap-1 group/btn"
                                >
                                  View Visual
                                </button>
                              )}
                            </td>
                            <td className="p-4 md:p-6 text-center text-xs font-mono text-slate-400">{item.qty}</td>
                            <td className="p-4 md:p-6 text-center text-[10px] font-black text-slate-500 uppercase">{item.unit}</td>
                            <td className="p-4 md:p-6 text-right text-xs font-mono text-slate-300">{formatCurrency(item.laborCosts)}</td>
                            <td className="p-4 md:p-6 text-right text-xs font-mono text-slate-300">{formatCurrency(item.materialCosts)}</td>
                            <td className="p-4 md:p-6 text-right text-xs font-black text-white bg-blue-600/5">{formatCurrency(item.total)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* PROPOSAL TAB */}
        {activeTab === 'proposal' && (
          <div className="flex-1 overflow-y-auto p-4 md:p-12 bg-slate-950 custom-scrollbar">
            <div className="max-w-4xl mx-auto bg-white p-8 md:p-20 shadow-2xl text-slate-900 rounded-sm border-t-[12px] border-blue-900">
               <div className="prose prose-sm md:prose-slate max-w-none prose-headings:font-black prose-headings:uppercase prose-headings:tracking-tighter">
                 <ReactMarkdown remarkPlugins={[remarkGfm]}>{currentResult?.markdown || ""}</ReactMarkdown>
               </div>
            </div>
          </div>
        )}

        {/* SALES TAB */}
        {activeTab === 'sales' && (
          <div className="flex-1 overflow-y-auto p-4 md:p-12 bg-slate-950 custom-scrollbar">
            <div className="max-w-4xl mx-auto">
              {isGeneratingPitch ? (
                <div className="flex flex-col items-center justify-center py-20 md:py-40">
                  <div className="w-12 md:w-16 h-12 md:h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-6"></div>
                  <p className="text-[10px] font-black text-white uppercase tracking-[0.3em] animate-pulse">Analyzing Competition...</p>
                </div>
              ) : (
                <div className="glass p-8 md:p-12 rounded-[2rem] md:rounded-[4rem] border border-blue-500/20 shadow-2xl relative overflow-hidden bg-gradient-to-br from-slate-900 to-blue-950/20">
                  <div className="prose prose-sm md:prose-invert max-w-none prose-headings:font-black prose-headings:uppercase prose-headings:tracking-tighter prose-p:text-slate-300">
                    <ReactMarkdown>{salesPitch || "Consult the spatial oracle to build your narrative."}</ReactMarkdown>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      <div className="shrink-0 bg-slate-900 border-t border-white/5 px-6 md:px-8 py-4 flex justify-between items-center print:hidden">
        <button onClick={onNewEstimate} className="flex items-center gap-2 text-[10px] font-black text-slate-500 hover:text-white uppercase tracking-widest transition-colors">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
          New Estimate
        </button>
        <p className="text-[9px] md:text-[10px] font-black text-slate-600 uppercase tracking-widest hidden sm:block">PRIME BID PRO • SPATIAL AI V3.1</p>
      </div>
    </div>
  );
};
