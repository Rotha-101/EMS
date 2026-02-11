
import React from 'react';
import { useEMSStore } from '../store';

export const DataTable: React.FC = () => {
  const units = useEMSStore(state => state.dispatch.units);

  return (
    <div className="flex-1 border border-slate-800 bg-slate-900/40 rounded flex flex-col overflow-hidden">
      <div className="px-4 py-3 bg-slate-800/50 border-b border-slate-800 flex justify-between items-center">
        <h2 className="text-xs font-bold uppercase tracking-widest text-slate-400">Plant Telemetry</h2>
        <div className="flex gap-4">
           <button className="text-[10px] text-slate-400 hover:text-white uppercase">EXPORT_CSV</button>
           <button className="text-[10px] text-slate-400 hover:text-white uppercase">RESCAN_NODES</button>
        </div>
      </div>
      
      <div className="flex-1 overflow-auto">
        <table className="w-full text-left border-collapse text-xs">
          <thead className="sticky top-0 bg-slate-900 z-10">
            <tr className="border-b border-slate-800">
              <th className="px-4 py-3 font-bold uppercase text-slate-500 tracking-wider">Unit ID</th>
              <th className="px-4 py-3 font-bold uppercase text-slate-500 tracking-wider">Name</th>
              <th className="px-4 py-3 font-bold uppercase text-slate-500 tracking-wider">Status</th>
              <th className="px-4 py-3 font-bold uppercase text-slate-500 tracking-wider text-right">Active MW</th>
              <th className="px-4 py-3 font-bold uppercase text-slate-500 tracking-wider text-right">Reactive MVar</th>
              <th className="px-4 py-3 font-bold uppercase text-slate-500 tracking-wider text-right">SOC %</th>
              <th className="px-4 py-3 font-bold uppercase text-slate-500 tracking-wider text-right">Last Sync</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/50 font-mono-industrial">
            {units.map((unit) => (
              <tr key={unit.id} className="hover:bg-slate-800/30 transition-colors">
                <td className="px-4 py-3 text-cyan-500 font-bold">{unit.id}</td>
                <td className="px-4 py-3 text-slate-300">{unit.name}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${unit.status === 'ACTIVE' ? 'bg-emerald-500 animate-pulse' : 'bg-slate-600'}`} />
                    <span className={unit.status === 'ACTIVE' ? 'text-emerald-400' : 'text-slate-500'}>{unit.status}</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-right font-bold text-slate-50">{unit.activePowerMW.toFixed(2)}</td>
                <td className="px-4 py-3 text-right text-slate-400">{unit.reactivePowerMVar.toFixed(2)}</td>
                <td className="px-4 py-3 text-right">
                  <span className={unit.socPercent < 20 ? 'text-amber-500 font-bold' : 'text-emerald-500'}>
                    {unit.socPercent.toFixed(1)}%
                  </span>
                </td>
                <td className="px-4 py-3 text-right text-slate-600 text-[10px] uppercase">
                  {new Date(unit.lastUpdated).toLocaleTimeString([], { hour12: false })}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
