
import React, { useState, useEffect, useRef } from 'react';
import { useEMSStore } from '../store';

export const UnitGrid: React.FC = () => {
  const units = useEMSStore(state => state.units);
  const updateStagedValue = useEMSStore(state => state.updateStagedValue);

  return (
    <div className="grid grid-cols-3 gap-6">
      {units.map((unit, idx) => (
        <div key={unit.id} className="bg-slate-900/30 border border-slate-800 rounded-xl p-5 flex flex-col gap-6 group hover:border-slate-700 transition-all duration-300 shadow-lg">
          <div className="flex justify-between items-start">
            <div className="flex items-center gap-4">
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-slate-950 ${idx === 0 ? 'bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.3)]' : idx === 1 ? 'bg-indigo-500 shadow-[0_0_15px_rgba(99,102,241,0.3)]' : 'bg-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.3)]'}`}>
                {idx + 1}
              </div>
              <div className="flex flex-col">
                <h3 className="text-sm font-black uppercase tracking-tight text-slate-200">{unit.name}</h3>
                <span className="text-[10px] font-bold text-slate-500 tracking-tighter">STATUS: {unit.status}</span>
              </div>
            </div>
            <div className="flex flex-col items-end">
               <span className="text-[8px] font-bold text-slate-600 uppercase tracking-widest">Telemetry_Link</span>
               <div className={`w-2 h-2 rounded-full mt-1 ${idx === 0 ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.6)]' : idx === 1 ? 'bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.6)]' : 'bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.6)]'}`} />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2">
            <SmoothInputBlock 
              label="Active (MW)" 
              value={unit.activePowerMW} 
              onCommit={(v) => updateStagedValue(unit.id, 'activePowerMW', v)} 
            />
            <SmoothInputBlock 
              label="Reac (MVar)" 
              value={unit.reactivePowerMVar} 
              onCommit={(v) => updateStagedValue(unit.id, 'reactivePowerMVar', v)} 
            />
            <SmoothInputBlock 
              label="SOC (%)" 
              value={unit.socPercent} 
              onCommit={(v) => updateStagedValue(unit.id, 'socPercent', v)} 
            />
          </div>

          <div className="flex flex-col gap-2">
            <div className="flex justify-between text-[8px] font-black text-slate-500 uppercase">
              <span>P_Load_Current</span>
              <span className="text-slate-300">{unit.pLoad.toFixed(1)} <span className="opacity-40 px-1">|</span> Q_Load {unit.qLoad.toFixed(1)}</span>
            </div>
            <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
               <div 
                 className="h-full bg-indigo-500/80 transition-all duration-1000 ease-out" 
                 style={{ width: `${Math.min(100, (unit.pLoad / 50) * 100)}%` }} 
               />
            </div>
            <div className="flex justify-between text-[8px] font-black text-slate-500 uppercase">
              <span>Battery_Level</span>
              <span className="text-slate-300 font-mono-industrial">{unit.battLvl.toFixed(1)}%</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

interface SmoothInputProps {
  label: string;
  value: number;
  onCommit: (v: number) => void;
}

const SmoothInputBlock: React.FC<SmoothInputProps> = ({ label, value, onCommit }) => {
  const [localValue, setLocalValue] = useState<string>(value.toString());
  const inputRef = useRef<HTMLInputElement>(null);

  // Keep local value in sync with external value if it changes from outside
  useEffect(() => {
    if (document.activeElement !== inputRef.current) {
      setLocalValue(value.toString());
    }
  }, [value]);

  const handleBlur = () => {
    const numericValue = parseFloat(localValue);
    if (!isNaN(numericValue)) {
      onCommit(numericValue);
      setLocalValue(numericValue.toString());
    } else {
      setLocalValue(value.toString()); // Revert on invalid
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      inputRef.current?.blur();
    }
    if (e.key === 'Escape') {
      setLocalValue(value.toString());
      inputRef.current?.blur();
    }
  };

  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    e.target.select();
  };

  return (
    <div className="flex flex-col gap-2">
      <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest text-center truncate">{label}</label>
      <div className="h-10 bg-slate-900 border border-slate-800 rounded-lg flex items-center justify-center group-hover:border-slate-700 focus-within:border-indigo-500 focus-within:ring-1 focus-within:ring-indigo-500/20 transition-all">
        <input 
          ref={inputRef}
          type="number"
          step="0.1"
          value={localValue}
          onChange={(e) => setLocalValue(e.target.value)}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          onFocus={handleFocus}
          className="w-full bg-transparent text-center font-mono-industrial font-bold text-slate-300 focus:outline-none focus:text-white [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
        />
      </div>
    </div>
  );
};
