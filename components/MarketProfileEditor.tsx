
import React from 'react';
import { MarketProfile, LaborTier, Positioning, ProjectType, Complexity, ScheduleUrgency, RiskTolerance } from '../types';

interface MarketProfileEditorProps {
  profile: MarketProfile;
  onChange: (profile: MarketProfile) => void;
  onSave: () => void;
}

export const MarketProfileEditor: React.FC<MarketProfileEditorProps> = ({ profile, onChange, onSave }) => {
  const updateField = (field: keyof MarketProfile, value: any) => {
    onChange({ ...profile, [field]: value });
  };

  const laborTiers: LaborTier[] = ['Low', 'Average', 'High'];
  const positions: Positioning[] = ['Competitive', 'Standard', 'Premium'];
  const projectTypes: ProjectType[] = ['Multifamily', 'Retail', 'Office', 'Industrial', 'Hospitality', 'Healthcare', 'Education', 'Mixed-Use'];
  const complexities: Complexity[] = ['Low', 'Normal', 'High'];
  const urgencies: ScheduleUrgency[] = ['Normal', 'Accelerated'];
  const risks: RiskTolerance[] = ['Low', 'Normal', 'High'];

  return (
    <div className="w-full max-w-4xl mx-auto space-y-8 animate-in slide-in-from-bottom-8 duration-500">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-black text-white uppercase tracking-tighter">Market Profile</h2>
        <p className="text-slate-400 text-sm mt-2">Tailor pricing and assumptions to your market and project type.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Region */}
        <div className="glass p-6 rounded-2xl border border-white/5 space-y-3">
          <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Market Region</label>
          <input 
            type="text"
            value={profile.marketRegion}
            onChange={(e) => updateField('marketRegion', e.target.value)}
            placeholder="e.g., Charleston, SC"
            className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-blue-500 transition-colors"
          />
        </div>

        {/* Labor Tier */}
        <div className="glass p-6 rounded-2xl border border-white/5 space-y-3">
          <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Labor Market Tier</label>
          <div className="flex bg-slate-900 rounded-xl p-1 border border-white/10">
            {laborTiers.map(t => (
              <button 
                key={t}
                onClick={() => updateField('laborMarketTier', t)}
                className={`flex-1 py-2 text-[10px] font-black uppercase tracking-widest rounded-lg transition-all ${profile.laborMarketTier === t ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        {/* Positioning */}
        <div className="glass p-6 rounded-2xl border border-white/5 space-y-3">
          <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Positioning Strategy</label>
          <div className="flex bg-slate-900 rounded-xl p-1 border border-white/10">
            {positions.map(p => (
              <button 
                key={p}
                onClick={() => updateField('positioning', p)}
                className={`flex-1 py-2 text-[10px] font-black uppercase tracking-widest rounded-lg transition-all ${profile.positioning === p ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}
              >
                {p}
              </button>
            ))}
          </div>
        </div>

        {/* Project Type */}
        <div className="glass p-6 rounded-2xl border border-white/5 space-y-3">
          <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Project Type</label>
          <select 
            value={profile.projectType}
            onChange={(e) => updateField('projectType', e.target.value)}
            className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-blue-500 transition-colors"
          >
            {projectTypes.map(pt => <option key={pt} value={pt}>{pt}</option>)}
          </select>
        </div>

        {/* Complexity & Urgency */}
        <div className="glass p-6 rounded-2xl border border-white/5 space-y-3">
          <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Complexity</label>
          <div className="flex bg-slate-900 rounded-xl p-1 border border-white/10">
            {complexities.map(c => (
              <button 
                key={c}
                onClick={() => updateField('complexity', c)}
                className={`flex-1 py-2 text-[10px] font-black uppercase tracking-widest rounded-lg transition-all ${profile.complexity === c ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        <div className="glass p-6 rounded-2xl border border-white/5 space-y-3">
          <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Schedule Urgency</label>
          <div className="flex bg-slate-900 rounded-xl p-1 border border-white/10">
            {urgencies.map(u => (
              <button 
                key={u}
                onClick={() => updateField('scheduleUrgency', u)}
                className={`flex-1 py-2 text-[10px] font-black uppercase tracking-widest rounded-lg transition-all ${profile.scheduleUrgency === u ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}
              >
                {u}
              </button>
            ))}
          </div>
        </div>

        {/* Toggles */}
        <div className="glass p-6 rounded-2xl border border-white/5 flex items-center justify-between">
          <div className="space-y-1">
            <h4 className="text-xs font-black text-white uppercase tracking-tight">Union Labor</h4>
            <p className="text-[9px] text-slate-500 uppercase font-bold">Apply labor multiplier (1.15)</p>
          </div>
          <button 
            onClick={() => updateField('unionLabor', !profile.unionLabor)}
            className={`w-12 h-6 rounded-full p-1 transition-colors ${profile.unionLabor ? 'bg-blue-600' : 'bg-slate-800'}`}
          >
            <div className={`w-4 h-4 rounded-full bg-white transition-transform ${profile.unionLabor ? 'translate-x-6' : 'translate-x-0'}`}></div>
          </button>
        </div>

        <div className="glass p-6 rounded-2xl border border-white/5 flex items-center justify-between">
          <div className="space-y-1">
            <h4 className="text-xs font-black text-white uppercase tracking-tight">Prevailing Wage</h4>
            <p className="text-[9px] text-slate-500 uppercase font-bold">Mandatory minimums apply</p>
          </div>
          <button 
            onClick={() => updateField('prevailingWage', !profile.prevailingWage)}
            className={`w-12 h-6 rounded-full p-1 transition-colors ${profile.prevailingWage ? 'bg-blue-600' : 'bg-slate-800'}`}
          >
            <div className={`w-4 h-4 rounded-full bg-white transition-transform ${profile.prevailingWage ? 'translate-x-6' : 'translate-x-0'}`}></div>
          </button>
        </div>

        {/* Contingency */}
        <div className="glass p-6 rounded-2xl border border-white/5 md:col-span-2 space-y-6">
          <div className="flex justify-between items-center">
            <div className="space-y-1">
              <h4 className="text-xs font-black text-white uppercase tracking-tight">Include Contingency</h4>
              <p className="text-[9px] text-slate-500 uppercase font-bold">Add safety margin for unknowns</p>
            </div>
            <button 
              onClick={() => updateField('includeContingency', !profile.includeContingency)}
              className={`w-12 h-6 rounded-full p-1 transition-colors ${profile.includeContingency ? 'bg-blue-600' : 'bg-slate-800'}`}
            >
              <div className={`w-4 h-4 rounded-full bg-white transition-transform ${profile.includeContingency ? 'translate-x-6' : 'translate-x-0'}`}></div>
            </button>
          </div>
          
          {profile.includeContingency && (
            <div className="space-y-3 animate-in fade-in duration-300">
              <div className="flex justify-between">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Contingency %</label>
                <span className="text-[10px] font-black text-blue-500">{(profile.contingencyPct * 100).toFixed(0)}%</span>
              </div>
              <input 
                type="range"
                min="0.01"
                max="0.15"
                step="0.01"
                value={profile.contingencyPct}
                onChange={(e) => updateField('contingencyPct', parseFloat(e.target.value))}
                className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />
            </div>
          )}
        </div>
      </div>

      <button 
        onClick={onSave}
        className="w-full py-5 bg-blue-600 hover:bg-blue-500 text-white font-black uppercase tracking-[0.3em] text-[11px] rounded-[1.5rem] shadow-2xl shadow-blue-500/20 transition-all transform active:scale-95 flex items-center justify-center gap-4"
      >
        Save Profile & Continue
      </button>
    </div>
  );
};
