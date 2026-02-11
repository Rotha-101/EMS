
export enum AlarmSeverity {
  CRITICAL = 'CRITICAL',
  WARNING = 'WARNING',
  INFO = 'INFO'
}

export interface SWGUnit {
  id: string;
  name: string;
  activePowerMW: number;
  reactivePowerMVar: number;
  socPercent: number;
  status: 'NOMINAL' | 'STANDBY' | 'FAULT' | 'ACTIVE';
  pLoad: number;
  qLoad: number;
  battLvl: number;
  lastUpdated: string;
}

export interface DispatchRecord {
  timestamp: string;
  units: {
    [unitId: string]: {
      active: number;
      reac: number;
      soc: number;
    }
  };
}

export interface Alarm {
  id: string;
  timestamp: string;
  severity: AlarmSeverity;
  message: string;
  acknowledged: boolean;
}

export interface AppState {
  units: SWGUnit[];
  history: DispatchRecord[];
  isConnected: boolean;
  isAuth: boolean;
  version: string;
}