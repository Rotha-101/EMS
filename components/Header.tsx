
import React, { useState, useEffect } from 'react';
import { useEMSStore } from '../store';

export const Header: React.FC = () => {
  const [time, setTime] = useState(new Date());
  const { version, isAuth } = useEMSStore();

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <header className="px-6 py-4 flex items-center justify-between border-b border-slate-800">
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-3">
           <div className="w-10 h-10 border border-slate-700 flex items-center justify-center rounded">
             <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
             </svg>
           </div>
           <div className="flex flex-col">
             <h1 className="text-lg font-black tracking-tight leading-none uppercase">SWG Dispatch EMS</h1>
             <span className="text-[10px] font-bold text-slate-500 uppercase flex items-center gap-2">
               System_Core_{version} <span className="text-blue-500">● Station_Auth_Active</span>
             </span>
           </div>
        </div>
        
        <div className="flex gap-4">
           <div className="px-3 py-1 bg-emerald-500/10 border border-emerald-500/30 text-emerald-500 text-[10px] font-black rounded-full flex items-center gap-2">
             <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" /> GRID_NOMINAL
           </div>
           <div className="px-3 py-1 border border-slate-800 text-slate-500 text-[10px] font-black rounded-full flex items-center gap-2">
             <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071a9.9 9.9 0 0114.142 0M2.006 7.071a15.359 15.359 0 0121.988 0" strokeWidth={2} /></svg> Telemetry_Link
           </div>
        </div>
      </div>

      <div className="flex items-center gap-8">
        <div className="flex flex-col items-end uppercase">
          <span className="text-[10px] font-bold text-slate-500">{time.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'short', year: 'numeric' })}</span>
          <span className="text-[10px] text-slate-600 font-mono-industrial">Asia/Phnom_Penh (UTC+7)</span>
        </div>
        
        <div className="flex items-center gap-4 bg-slate-900 border border-slate-800 px-4 py-2 rounded-lg shadow-inner">
          <div className="text-slate-500">
             <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          </div>
          <span className="text-2xl font-black font-mono-industrial text-white tracking-widest">
            {time.toLocaleTimeString('en-GB', { hour12: false })}
          </span>
        </div>

        <div className="p-2 text-slate-500 hover:text-white transition-colors cursor-pointer">
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
        </div>
      </div>
    </header>
  );
};
