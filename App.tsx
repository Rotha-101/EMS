
import React, { useEffect } from 'react';
import { Header } from './components/Header';
import { UnitGrid } from './components/UnitGrid';
import { DispatchHistory } from './components/DispatchHistory';
import { SequenceLog } from './components/SequenceLog';
import { useEMSStore } from './store';

const App: React.FC = () => {
  const hydrate = useEMSStore(state => state.hydrate);

  useEffect(() => {
    // Initial data load from local SQLite
    hydrate();

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Enter') {
        window.dispatchEvent(new CustomEvent('commit-sequence'));
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [hydrate]);

  return (
    <div className="flex flex-col h-screen bg-slate-950 text-slate-50 font-sans overflow-hidden">
      <Header />
      
      <main className="flex-1 flex flex-col p-6 gap-6 overflow-hidden">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex gap-2">
              <span className="px-2 py-0.5 bg-blue-600 text-[10px] font-bold rounded flex items-center gap-1">
                <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" /> LIVE_CON
              </span>
              <span className="px-2 py-0.5 border border-slate-700 text-slate-400 text-[10px] font-bold rounded flex items-center gap-1">
                <div className="w-1.5 h-1.5 bg-emerald-600 rounded-full" /> SQL_ACTIVE
              </span>
            </div>
            <h2 className="text-2xl font-black tracking-tight uppercase text-slate-200">Grid_Dispatch_Center</h2>
          </div>
          
          <div className="flex bg-slate-900/50 border border-slate-800 rounded divide-x divide-slate-800">
            <div className="px-4 py-2 flex items-center gap-3">
              <div className="text-cyan-500">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
              </div>
              <div className="flex flex-col">
                <span className="text-[8px] text-slate-500 font-bold uppercase">Buffer</span>
                <span className="text-sm font-bold font-mono-industrial leading-none">1</span>
              </div>
            </div>
            <div className="px-4 py-2 flex items-center gap-3">
              <div className="text-purple-500">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79-8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" /></svg>
              </div>
              <div className="flex flex-col">
                <span className="text-[8px] text-slate-500 font-bold uppercase">Store</span>
                <span className="text-sm font-bold font-mono-industrial leading-none uppercase">SQLite_Local</span>
              </div>
            </div>
          </div>
        </div>

        <UnitGrid />

        <div className="flex items-center justify-between">
           <div className="flex items-center gap-2">
             <div className="w-2 h-2 bg-emerald-500 rounded-full" />
             <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest">Database_Sync_Nominal</span>
           </div>
           <button 
             onClick={() => window.dispatchEvent(new CustomEvent('commit-sequence'))}
             className="flex items-center gap-2 px-6 py-1.5 border border-slate-700 bg-slate-900 rounded text-[10px] font-bold text-slate-400 hover:text-white transition-colors"
           >
             <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M5 13l4 4L19 7" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" /></svg>
             COMMIT SEQUENCE <span className="opacity-50">[ENTER]</span>
           </button>
        </div>

        <div className="flex-1 grid grid-cols-12 gap-6 overflow-hidden">
          <section className="col-span-9 flex flex-col overflow-hidden">
            <DispatchHistory />
          </section>
          <section className="col-span-3 flex flex-col overflow-hidden">
            <SequenceLog />
          </section>
        </div>
      </main>

      <footer className="h-8 border-t border-slate-800 bg-slate-900 flex items-center px-4 justify-between text-[10px] font-mono-industrial uppercase tracking-wider text-slate-500">
        <div className="flex gap-6 items-center">
           <div className="flex items-center gap-2">
             <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
             <span>SQLite_Authenticated</span>
           </div>
           <div className="flex items-center gap-2">
             <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h2" strokeWidth={2} /></svg>
             <span>Archive: Active</span>
           </div>
        </div>
        <div className="text-blue-500 font-bold">SQL_SYNC_OK</div>
      </footer>
    </div>
  );
};

export default App;
