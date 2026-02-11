
const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('emsAPI', {
  getHistory: () => ipcRenderer.invoke('db:get-history'),
  addRecord: (record) => ipcRenderer.invoke('db:add-record', record),
  deleteRecord: (timestamp) => ipcRenderer.invoke('db:delete-record', timestamp),
  updateRecord: (record) => ipcRenderer.invoke('db:update-record', record),
  getUnits: () => ipcRenderer.invoke('db:get-units'),
  updateUnit: (unit) => ipcRenderer.invoke('db:update-unit', unit)
});
