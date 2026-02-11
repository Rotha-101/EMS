
const { app, BrowserWindow, Menu, ipcMain } = require('electron');
const path = require('path');
const Database = require('better-sqlite3');

// Initialize Database in the user data directory
const dbPath = path.join(app.getPath('userData'), 'ems_production.sqlite');
const db = new Database(dbPath);

// Database Schema Initialization
db.exec(`
  CREATE TABLE IF NOT EXISTS dispatch_history (
    timestamp TEXT PRIMARY KEY,
    payload TEXT NOT NULL
  );
  CREATE TABLE IF NOT EXISTS unit_state (
    id TEXT PRIMARY KEY,
    name TEXT,
    activePowerMW REAL,
    reactivePowerMVar REAL,
    socPercent REAL,
    status TEXT
  );
`);

// IPC Handlers
ipcMain.handle('db:get-history', () => {
  const rows = db.prepare('SELECT * FROM dispatch_history ORDER BY timestamp DESC LIMIT 100').all();
  return rows.map(r => JSON.parse(r.payload));
});

ipcMain.handle('db:add-record', (event, record) => {
  const stmt = db.prepare('INSERT INTO dispatch_history (timestamp, payload) VALUES (?, ?)');
  return stmt.run(record.timestamp, JSON.stringify(record));
});

ipcMain.handle('db:delete-record', (event, timestamp) => {
  const stmt = db.prepare('DELETE FROM dispatch_history WHERE timestamp = ?');
  return stmt.run(timestamp);
});

ipcMain.handle('db:update-record', (event, record) => {
  const stmt = db.prepare('UPDATE dispatch_history SET payload = ? WHERE timestamp = ?');
  return stmt.run(JSON.stringify(record), record.timestamp);
});

ipcMain.handle('db:get-units', () => {
  return db.prepare('SELECT * FROM unit_state').all();
});

ipcMain.handle('db:update-unit', (event, unit) => {
  const stmt = db.prepare(`
    INSERT INTO unit_state (id, name, activePowerMW, reactivePowerMVar, socPercent, status)
    VALUES (?, ?, ?, ?, ?, ?)
    ON CONFLICT(id) DO UPDATE SET
      activePowerMW=excluded.activePowerMW,
      reactivePowerMVar=excluded.reactivePowerMVar,
      socPercent=excluded.socPercent,
      status=excluded.status
  `);
  return stmt.run(unit.id, unit.name, unit.activePowerMW, unit.reactivePowerMVar, unit.socPercent, unit.status);
});

function createWindow() {
  const win = new BrowserWindow({
    width: 1440,
    height: 900,
    title: "SWG DISPATCH EMS - LOCAL_DB_ACTIVE",
    backgroundColor: '#020617',
    show: false,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      sandbox: true,
      preload: path.join(__dirname, 'preload.js'),
      devTools: false
    }
  });

  Menu.setApplicationMenu(null);

  win.loadFile(path.join(__dirname, 'dist/index.html'))
    .then(() => {
      win.maximize();
      win.show();
    })
    .catch((err) => {
      console.error("Critical Failure: UI assets not found.", err);
    });
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
