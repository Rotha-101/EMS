
import React from 'react';
import { Alarm, AlarmSeverity } from '../types';
import { useEMSStore } from '../store';

export const AlarmBanner: React.FC<{ alarms: Alarm[] }> = ({ alarms }) => {
  const acknowledgeAlarm = useEMSStore(state => state.acknowledgeAlarm);

  return (
    <div className="flex flex-col gap-2 mb-4">
      {alarms.map(alarm => (
        <div 
          key={alarm.id} 
          className={`flex items-center justify-between px-4 py-2 rounded border animate-pulse ${
            alarm.severity === AlarmSeverity.CRITICAL 
              ? 'bg-rose-500/10 border-rose-500 text-rose-500' 
              : 'bg-amber-500/10 border-amber-500 text-amber-500'
          }`}
        >
          <div className="flex items-center gap-4">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <div className="flex flex-col">
              <span className="text-[10px] font-bold uppercase tracking-widest">{alarm.severity} ALARM</span>
              <span className="text-sm font-bold">{alarm.message}</span>
            </div>
          </div>
          <button 
            onClick={() => acknowledgeAlarm(alarm.id)}
            className="px-3 py-1 bg-current text-slate-950 font-bold text-[10px] uppercase rounded hover:opacity-80 transition-opacity"
          >
            ACKNOWLEDGE
          </button>
        </div>
      ))}
    </div>
  );
};
