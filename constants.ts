
import { SWGUnit } from './types';

export const APP_VERSION = '3.0.4-LTS';
export const BUILD_DATE = '2024-05-20';

export const LIMITS = {
  MAX_PLANT_ACTIVE_MW: 150.0,
  MIN_PLANT_ACTIVE_MW: 0.0,
  MAX_UNIT_ACTIVE_MW: 50.0,
  MAX_UNIT_REACTIVE_MVAR: 25.0,
  SOC_WARNING_THRESHOLD: 20.0,
  SOC_CRITICAL_THRESHOLD: 10.0,
};

export const INITIAL_UNITS: SWGUnit[] = [
  {
    id: 'SWG-001',
    name: 'SWG Unit 1',
    activePowerMW: 0.0,
    reactivePowerMVar: 0.0,
    socPercent: 0.0,
    status: 'STANDBY',
    pLoad: 0,
    qLoad: 0,
    battLvl: 0,
    lastUpdated: new Date().toISOString(),
  },
  {
    id: 'SWG-002',
    name: 'SWG Unit 2',
    activePowerMW: 0.0,
    reactivePowerMVar: 0.0,
    socPercent: 0.0,
    status: 'STANDBY',
    pLoad: 0,
    qLoad: 0,
    battLvl: 0,
    lastUpdated: new Date().toISOString(),
  },
  {
    id: 'SWG-003',
    name: 'SWG Unit 3',
    activePowerMW: 0.0,
    reactivePowerMVar: 0.0,
    socPercent: 0.0,
    status: 'STANDBY',
    pLoad: 0,
    qLoad: 0,
    battLvl: 0,
    lastUpdated: new Date().toISOString(),
  }
];

export const THEME_COLORS = {
  BG_PRIMARY: 'bg-slate-950',
  BG_SECONDARY: 'bg-slate-900',
  BG_ACCENT: 'bg-slate-800',
  TEXT_PRIMARY: 'text-slate-50',
  TEXT_SECONDARY: 'text-slate-400',
  BORDER: 'border-slate-800',
  BRAND: 'text-cyan-400',
  SUCCESS: 'text-emerald-400',
  WARNING: 'text-amber-400',
  DANGER: 'text-rose-500',
};
