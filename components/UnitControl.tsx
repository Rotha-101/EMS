
import React, { useState } from 'react';
import { useEMSStore } from '../store';
import { LIMITS } from '../constants';

export const UnitControl: React.FC = () => {
  const units = useEMSStore(state => state.dispatch.units);
  const updateUnitDispatch = useEMSStore(state => state.updateUnitDispatch);
  const addLog = useEMSStore(state => state.addLog);

  const [localValues, setLocalValues] = useState<{ [key: string]: { mw: string, mvar: string } }>(
    Object.fromEntries(units.map(u => [u.id, { mw: u.activePowerMW.toString(), mvar: u.reactivePowerMVar.toString() }]))
  );

  const handleApply = (id: string) => {
    const val = localValues[id];
    if (!val) return;
    const mw = parseFloat(val.mw);
    const mvar = parseFloat(val.mvar);

    if (isNaN(mw) || isNaN(mvar)) {
      alert("INVALID_INPUT_FORMAT");
      return;
    }

    if (mw > LIMITS.MAX_UNIT_ACTIVE_MW || mw < 0) {
      alert(`VALIDATION_ERROR: MW must be 0-${LIMITS.MAX_UNIT_ACTIVE_MW}`);
      return;
    }

    updateUnitDispatch(id, mw, mvar);
    addLog('MANUAL_DISPATCH', `Unit ${id} updated to ${mw}MW / ${mvar}MVar`);
  };

  return (
    <div className="flex-1 flex flex-col border border-slate-800 bg-slate-900/40 rounded overflow-hidden">
      <div className="px-4 py-3 bg-slate-800/50 border-b border-slate-800 flex justify-between items-center">
        <h2 className="text-xs font-bold uppercase tracking-widest text-slate-400">Unit Controls</h2>
        <span className="text-[10px] text-cyan-500 px-2 py-0.5 rounded border border-cyan-500/30">DISPATCH_MODE: MANUAL</span>
      </div>

      <div className="p-4 flex flex-col gap-4 overflow-y-auto">
        {units.map((unit) => (
          <div key={unit.id} className="p-3 border border-slate-800 rounded bg-slate-950/50 flex flex-col gap-3">
            <div className="flex justify-between items-center">
              <span className="text-xs font-bold text-slate-200">{unit.name}</span>
              <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                unit.status === 'ACTIVE' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-amber-500/10 text-amber-400'
              }`}>
                {unit.status}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-1">
                <label className="text-[9px] font-bold text-slate-500 uppercase">Set Active MW</label>
                <input 
                  type="number" 
                  step="0.1"
                  className="bg-slate-900 border border-slate-800 rounded px-2 py-1 text-sm font-mono-industrial focus:outline-none focus:border-cyan-500 transition-colors"
                  value={localValues[unit.id]?.mw || '0'}
                  onChange={(e) => setLocalValues(prev => ({ ...prev, [unit.id]: { ...prev[unit.id]!, mw: e.target.value } }))}
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-[9px] font-bold text-slate-500 uppercase">Set Reactive MVar</label>
                <input 
                  type="number" 
                  step="0.1"
                  className="bg-slate-900 border border-slate-800 rounded px-2 py-1 text-sm font-mono-industrial focus:outline-none focus:border-cyan-500 transition-colors"
                  value={localValues[unit.id]?.mvar || '0'}
                  onChange={(e) => setLocalValues(prev => ({ ...prev, [unit.id]: { ...prev[unit.id]!, mvar: e.target.value } }))}
                />
              </div>
            </div>

            <button 
              onClick={() => handleApply(unit.id)}
              className="w-full py-1.5 mt-1 bg-cyan-600 hover:bg-cyan-500 active:bg-cyan-700 text-slate-950 text-xs font-bold uppercase rounded shadow-lg transition-all"
            >
              EXECUTE DISPATCH
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
