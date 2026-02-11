
import React, { useEffect } from 'react';
import { useEMSStore } from '../store';

export const SequenceLog: React.FC = () => {
  const units = useEMSStore(state => state.units);
  const commitSequence = useEMSStore(state => state.commitSequence);

  useEffect(() => {
    const handleCommit = () => commitSequence();
    window.addEventListener('commit-sequence', handleCommit);
    return () => window.removeEventListener('commit-sequence', handleCommit);
  }, [commitSequence]);

  const totalP = units.reduce((s, u) => s + u.activePowerMW, 0);
  const totalQ = units.reduce((s, u) => s + u.reactivePowerMVar, 0);

  const logText = `START AT\nTIME: ${new Date().toISOString().replace('T', ' ').split('.')[0]}\n\n` +
    units.map(u => `#${u.id.replace('_','')}: P=${u.activePowerMW.toFixed(0)}mW, Q=${u.reactivePowerMVar.toFixed(0)}Mvar, SOC=${u.socPercent.toFixed(0)}%`).join('\n') +
    `\n\n#TOTAL: P=${totalP.toFixed(2)}Mw, Q=${totalQ.toFixed(2)}Mvar`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(logText);
    alert('DISPATCH TEXT COPIED TO CLIPBOARD');
  };

  return (
    <div className="flex-1 flex flex-col border border-slate-800 bg-slate-900/20 rounded-xl overflow-hidden">
      <div className="px-6 py-4 border-b border-slate-800 bg-slate-900/40 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-8 h-8 bg-slate-800 rounded flex items-center justify-center">
            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" strokeWidth={2} /></svg>
          </div>
          <div className="flex flex-col">
            <h2 className="text-xs font-black uppercase tracking-widest text-slate-200">Sequence_Log</h2>
            <span className="text-[9px] font-bold text-slate-500 uppercase tracking-tight">Station_Live_Out</span>
          </div>
        </div>
        <button className="text-slate-600 hover:text-white transition-colors">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" strokeWidth={2} /></svg>
        </button>
      </div>

      <div className="flex-1 p-6 font-mono-industrial text-[11px] leading-relaxed text-slate-400 bg-slate-950/20 flex flex-col gap-1 overflow-y-auto">
        {logText.split('\n').map((line, i) => (
          <div key={i} className={line.startsWith('#') ? 'text-slate-200' : ''}>
            {line || <br />}
          </div>
        ))}
      </div>

      <div className="p-3 border-t border-slate-800 bg-slate-900/40">
        <button 
          onClick={copyToClipboard}
          className="w-full py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-[10px] font-black uppercase tracking-widest rounded flex items-center justify-center gap-2 shadow-lg shadow-indigo-500/10 active:scale-[0.98] transition-all"
        >
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" strokeWidth={2} /></svg>
          Copy Dispatch Text
        </button>
      </div>
    </div>
  );
};
