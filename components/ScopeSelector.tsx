
import React from 'react';
import { Division } from '../types';

interface ScopeSelectorProps {
  divisions: Division[];
  setDivisions: React.Dispatch<React.SetStateAction<Division[]>>;
}

export const ScopeSelector: React.FC<ScopeSelectorProps> = ({ divisions, setDivisions }) => {
  const toggleDivision = (divId: string) => {
    setDivisions(prev => prev.map(d => 
      d.id === divId ? { ...d, isOpen: !d.isOpen } : d
    ));
  };

  const toggleTrade = (divId: string, tradeId: string) => {
    setDivisions(prev => prev.map(d => {
      if (d.id !== divId) return d;
      return {
        ...d,
        trades: d.trades.map(t => {
          if (t.id !== tradeId) return t;
          const newSelected = !t.selected;
          return {
            ...t,
            selected: newSelected,
            subItems: t.subItems.map(si => ({ ...si, selected: newSelected }))
          };
        })
      };
    }));
  };

  const setTradeSelection = (divId: string, tradeId: string, val: boolean) => {
    setDivisions(prev => prev.map(d => {
      if (d.id !== divId) return d;
      return {
        ...d,
        trades: d.trades.map(t => {
          if (t.id !== tradeId) return t;
          return {
            ...t,
            selected: val,
            subItems: t.subItems.map(si => ({ ...si, selected: val }))
          };
        })
      };
    }));
  };

  const toggleSubItem = (divId: string, tradeId: string, itemCode: string) => {
    setDivisions(prev => prev.map(d => {
      if (d.id !== divId) return d;
      return {
        ...d,
        trades: d.trades.map(t => {
          if (t.id !== tradeId) return t;
          return {
            ...t,
            subItems: t.subItems.map(si => 
              si.code === itemCode ? { ...si, selected: !si.selected } : si
            )
          };
        })
      };
    }));
  };

  const selectAllInDiv = (divId: string, val: boolean) => {
    setDivisions(prev => prev.map(d => {
      if (d.id !== divId) return d;
      return {
        ...d,
        trades: d.trades.map(t => ({
          ...t,
          selected: val,
          subItems: t.subItems.map(si => ({ ...si, selected: val }))
        }))
      };
    }));
  };

  const selectAllGlobally = (val: boolean) => {
    setDivisions(prev => prev.map(d => ({
      ...d,
      trades: d.trades.map(t => ({
        ...t,
        selected: val,
        subItems: t.subItems.map(si => ({ ...si, selected: val }))
      }))
    })));
  };

  return (
    <div className="w-full space-y-3 mb-8">
      <div className="flex items-center justify-between mb-4">
        <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
          Hierarchical Trade Selection
        </h4>
        <div className="flex gap-4">
          <button 
            onClick={() => selectAllGlobally(true)}
            className="text-[9px] font-black text-blue-500 hover:text-blue-400 uppercase tracking-widest border border-blue-500/20 px-3 py-1 rounded-lg transition-all"
          >
            All Divisions
          </button>
          <button 
            onClick={() => selectAllGlobally(false)}
            className="text-[9px] font-black text-slate-500 hover:text-slate-300 uppercase tracking-widest border border-white/5 px-3 py-1 rounded-lg transition-all"
          >
            Clear All
          </button>
        </div>
      </div>
      
      <div className="max-h-[400px] overflow-y-auto pr-2 space-y-3 custom-scrollbar">
        {divisions.map((div) => (
          <div key={div.id} className="glass rounded-2xl overflow-hidden border border-white/5">
            <div 
              className="flex items-center justify-between p-4 cursor-pointer hover:bg-white/5 transition-colors"
              onClick={() => toggleDivision(div.id)}
            >
              <div className="flex items-center gap-3">
                <span className="font-mono text-[10px] font-bold text-blue-500 bg-blue-500/10 px-2 py-0.5 rounded">DIV {div.id}</span>
                <span className="text-xs font-black text-white uppercase tracking-tight">{div.title}</span>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex gap-2">
                  <button 
                    onClick={(e) => { e.stopPropagation(); selectAllInDiv(div.id, true); }}
                    className="text-[9px] font-bold text-blue-400 hover:underline uppercase"
                  >All</button>
                  <button 
                    onClick={(e) => { e.stopPropagation(); selectAllInDiv(div.id, false); }}
                    className="text-[9px] font-bold text-slate-500 hover:underline uppercase"
                  >None</button>
                </div>
                <svg className={`w-4 h-4 text-slate-500 transition-transform ${div.isOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>

            {div.isOpen && (
              <div className="p-4 bg-slate-900/40 border-t border-white/5 space-y-6">
                {div.trades.map((trade) => (
                  <div key={trade.id} className="space-y-3">
                    <div className="flex items-center justify-between group/trade">
                      <label className="flex items-center gap-3 cursor-pointer group">
                        <input 
                          type="checkbox" 
                          checked={trade.selected}
                          onChange={() => toggleTrade(div.id, trade.id)}
                          className="w-4 h-4 rounded bg-slate-800 border-slate-700 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="text-xs font-black text-white uppercase group-hover:text-blue-400 transition-colors">
                          {trade.id} {trade.title}
                        </span>
                      </label>
                      <div className="flex gap-2 items-center">
                        <button 
                          onClick={() => setTradeSelection(div.id, trade.id, true)}
                          className="text-[8px] font-black text-blue-500 hover:text-blue-400 uppercase tracking-widest border border-blue-500/20 px-2 py-0.5 rounded bg-blue-500/5 transition-colors"
                        >Select All</button>
                        <button 
                          onClick={() => setTradeSelection(div.id, trade.id, false)}
                          className="text-[8px] font-black text-slate-500 hover:text-slate-300 uppercase tracking-widest border border-white/5 px-2 py-0.5 rounded bg-white/5 transition-colors"
                        >Deselect All</button>
                      </div>
                    </div>
                    
                    <div className="pl-7 grid grid-cols-1 gap-4">
                      {trade.subItems.map((item) => (
                        <label key={item.code} className="flex items-start gap-4 cursor-pointer group py-2 px-3 hover:bg-white/5 rounded-xl transition-all border border-transparent hover:border-white/5">
                          <input 
                            type="checkbox" 
                            checked={item.selected}
                            onChange={() => toggleSubItem(div.id, trade.id, item.code)}
                            className="mt-1 w-4 h-4 rounded bg-slate-800 border-slate-700 text-blue-400 focus:ring-blue-500"
                          />
                          <div className="flex flex-col gap-1">
                            <span className="text-[10px] font-black text-slate-200 group-hover:text-white uppercase tracking-tight">
                              {item.code} {item.title}
                            </span>
                            <p className="text-[10px] font-medium text-slate-500 group-hover:text-slate-400 leading-relaxed italic">
                              {item.description}
                            </p>
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
