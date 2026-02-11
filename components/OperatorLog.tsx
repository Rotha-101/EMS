
import React, { useRef, useEffect } from 'react';
import { useEMSStore } from '../store';

export const OperatorLog: React.FC = () => {
  const logs = useEMSStore(state => state.logs);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = 0;
    }
  }, [logs]);

  return (
    <div className="flex-1 flex flex-col border border-slate-800 bg-slate-900/40 rounded overflow-hidden">
      <div className="px-4 py-3 bg-slate-800/50 border-b border-slate-800 flex justify-between items-center">
        <h2 className="text-xs font-bold uppercase tracking-widest text-slate-400">Activity Log</h2>
        <span className="text-[9px] text-slate-600">LIMIT: 100_ENTRIES</span>
      </div>

      <div 
        ref={scrollRef}
        className="flex-1 p-3 overflow-y-auto font-mono-industrial text-[11px] leading-relaxed"
      >
        {logs.map((log) => (
          <div key={log.id} className="mb-3 border-l border-slate-800 pl-3 py-1 hover:bg-slate-800/20 transition-colors">
            <div className="flex justify-between items-baseline mb-0.5">
              <span className="text-cyan-600 font-bold">[{new Date(log.timestamp).toLocaleTimeString([], { hour12: false })}]</span>
              <span className="text-slate-600 bg-slate-800/50 px-1 rounded uppercase">{log.operatorId}</span>
            </div>
            <div className="text-slate-400 uppercase font-bold tracking-tight mb-0.5">{log.action}</div>
            <div className="text-slate-500 break-words">{log.details}</div>
          </div>
        ))}
      </div>
      
      <div className="p-3 border-t border-slate-800 bg-slate-950/30">
        <textarea 
          placeholder="Enter custom operator note..." 
          className="w-full h-20 bg-slate-900 border border-slate-800 rounded p-2 text-[11px] text-slate-300 focus:outline-none focus:border-slate-700 resize-none"
        />
        <button className="w-full mt-2 py-1 bg-slate-800 hover:bg-slate-700 text-slate-400 text-[10px] font-bold uppercase rounded transition-colors">
          COMMIT_TO_LEDGER
        </button>
      </div>
    </div>
  );
};
