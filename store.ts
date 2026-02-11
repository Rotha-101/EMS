
import { create } from 'zustand';
import { AppState, SWGUnit, DispatchRecord } from './types';

// Extend window interface for TS
declare global {
  interface Window {
    emsAPI: {
      getHistory: () => Promise<DispatchRecord[]>;
      addRecord: (record: DispatchRecord) => Promise<any>;
      deleteRecord: (timestamp: string) => Promise<any>;
      updateRecord: (record: DispatchRecord) => Promise<any>;
      getUnits: () => Promise<SWGUnit[]>;
      updateUnit: (unit: SWGUnit) => Promise<any>;
    };
  }
}

interface EMSStore extends AppState {
  hydrate: () => Promise<void>;
  updateStagedValue: (unitId: string, field: 'activePowerMW' | 'reactivePowerMVar' | 'socPercent', value: number) => void;
  commitSequence: () => Promise<void>;
  deleteHistoryRecord: (timestamp: string) => Promise<void>;
  updateHistoryRecord: (record: DispatchRecord) => Promise<void>;
  setConnectionStatus: (status: boolean) => void;
}

const INITIAL_UNITS: SWGUnit[] = [
  { id: 'SWG_01', name: 'SWG_UNIT_01', activePowerMW: 0.0, reactivePowerMVar: 0.0, socPercent: 0.0, status: 'NOMINAL', pLoad: 0.0, qLoad: 0.0, battLvl: 0.0, lastUpdated: new Date().toISOString() },
  { id: 'SWG_02', name: 'SWG_UNIT_02', activePowerMW: 0.0, reactivePowerMVar: 0.0, socPercent: 0.0, status: 'NOMINAL', pLoad: 0.0, qLoad: 0.0, battLvl: 0.0, lastUpdated: new Date().toISOString() },
  { id: 'SWG_03', name: 'SWG_UNIT_03', activePowerMW: 0.0, reactivePowerMVar: 0.0, socPercent: 0.0, status: 'NOMINAL', pLoad: 0.0, qLoad: 0.0, battLvl: 0.0, lastUpdated: new Date().toISOString() },
];

export const useEMSStore = create<EMSStore>((set, get) => ({
  units: INITIAL_UNITS,
  history: [],
  isConnected: true,
  isAuth: true,
  version: 'V3.0.4',

  hydrate: async () => {
    if (window.emsAPI) {
      const history = await window.emsAPI.getHistory();
      const dbUnits = await window.emsAPI.getUnits();
      
      // Merge DB units with defaults if DB is empty
      const units = dbUnits.length > 0 ? dbUnits.map(u => ({
        ...INITIAL_UNITS.find(i => i.id === u.id)!,
        ...u
      })) : INITIAL_UNITS;

      set({ history, units });
    }
  },

  updateStagedValue: (unitId, field, value) => {
    set((state) => ({
      units: state.units.map(u => u.id === unitId ? { ...u, [field]: value } : u)
    }));
    
    // Auto-persist unit configuration changes to SQLite
    const unit = get().units.find(u => u.id === unitId);
    if (unit && window.emsAPI) {
      window.emsAPI.updateUnit(unit);
    }
  },

  commitSequence: async () => {
    const { units, history } = get();
    const newRecord: DispatchRecord = {
      timestamp: new Date().toISOString().replace('T', ' ').split('.')[0],
      units: Object.fromEntries(units.map(u => [u.id, { active: u.activePowerMW, reac: u.reactivePowerMVar, soc: u.socPercent }]))
    };

    if (window.emsAPI) {
      await window.emsAPI.addRecord(newRecord);
    }

    set({
      history: [newRecord, ...history].slice(0, 100)
    });
  },

  deleteHistoryRecord: async (timestamp) => {
    if (window.emsAPI) {
      await window.emsAPI.deleteRecord(timestamp);
    }
    set((state) => ({
      history: state.history.filter(h => h.timestamp !== timestamp)
    }));
  },

  updateHistoryRecord: async (updatedRecord) => {
    if (window.emsAPI) {
      await window.emsAPI.updateRecord(updatedRecord);
    }
    set((state) => ({
      history: state.history.map(h => h.timestamp === updatedRecord.timestamp ? updatedRecord : h)
    }));
  },

  setConnectionStatus: (status) => set({ isConnected: status }),
}));
