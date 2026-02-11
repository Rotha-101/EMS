
import React from 'react';
import { useEMSStore } from '../store';

export const KPIGrid: React.FC = () => {
  const dispatch = useEMSStore(state => state.dispatch);

  return (
    <div className="grid grid-cols-5 gap-4">
      <KPICard 
        label="TOTAL ACTIVE POWER" 
        value={dispatch.totalActiveMW.toFixed(2)} 
        unit="MW" 
        status="normal"
        trend="+1.2%"
      />
      <KPICard 
        label="TOTAL REACTIVE POWER" 
        value={dispatch.totalReactiveMVar.toFixed(2)} 
        unit="MVar" 
        status="normal"
      />
      <KPICard 
        label="AVERAGE SOC" 
        value={dispatch.avgSOC.toFixed(1)} 
        unit="%" 
        status={dispatch.avgSOC < 20 ? 'warning' : 'normal'}
        progress={dispatch.avgSOC}
      />
      <KPICard 
        label="SYSTEM HEALTH" 
        value={dispatch.systemHealth.toString()} 
        unit="%" 
        status="normal"
      />
      <KPICard 
        label="ACTIVE ALARMS" 
        value={dispatch.alarms.filter(a => !a.acknowledged).length.toString()} 
        unit="FLT" 
        status={dispatch.alarms.filter(a => !a.acknowledged).length > 0 ? 'critical' : 'normal'}
      />
    </div>
  );
};

interface KPICardProps {
  label: string;
  value: string;
  unit: string;
  status: 'normal' | 'warning' | 'critical';
  trend?: string;
  progress?: number;
}

const KPICard: React.FC<KPICardProps> = ({ label, value, unit, status, trend, progress }) => {
  const statusColors = {
    normal: 'text-cyan-400 border-cyan-500/20 bg-cyan-500/5',
    warning: 'text-amber-400 border-amber-500/20 bg-amber-500/5',
    critical: 'text-rose-500 border-rose-500/20 bg-rose-500/5',
  };

  return (
    <div className={`p-4 border rounded relative overflow-hidden flex flex-col justify-between h-28 ${statusColors[status]}`}>
      <div className="text-[10px] font-bold tracking-widest uppercase opacity-80">{label}</div>
      <div className="flex items-baseline gap-2">
        <div className="text-3xl font-mono-industrial font-bold leading-none">{value}</div>
        <div className="text-xs font-semibold opacity-60 uppercase">{unit}</div>
      </div>
      
      {trend && (
        <div className="absolute top-2 right-2 text-[10px] font-mono font-bold bg-slate-950/50 px-1 rounded">
          {trend}
        </div>
      )}

      {progress !== undefined && (
        <div className="w-full h-1 bg-slate-800 mt-2 rounded-full overflow-hidden">
          <div 
            className={`h-full transition-all duration-1000 ${status === 'warning' ? 'bg-amber-500' : 'bg-cyan-500'}`} 
            style={{ width: `${progress}%` }} 
          />
        </div>
      )}
    </div>
  );
};
