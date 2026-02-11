
# EMS INDUSTRIAL BUILD & DEPLOYMENT GUIDE

This application is designed as a standalone industrial product.

## 1. PRE-REQUISITES
- Node.js 18.x+
- NPM 9.x+
- Windows 10/11 Target

## 2. DEVELOPMENT SETUP
```powershell
npm install
npm run dev
```

## 3. PRODUCTION BUILD (VITE)
Generates static assets for local hosting or wrapper injection.
```powershell
npm run build
```

## 4. WINDOWS EXE PACKAGING (ELECTRON WRAPPER)
We utilize `electron-builder` to wrap the Vite output into a single-file `.exe`.

**Steps:**
1. Ensure the `dist` folder is populated via `npm run build`.
2. Configure `electron-builder` (requires `electron` and `electron-builder` dependencies).
3. Run:
```powershell
npm run dist
```

## 5. TERMINAL EXECUTION
Once packaged, the EXE can be launched via terminal with custom flags if implemented:
```powershell
.\EMS_Dispatch_v3.exe --silent --port 8080
```

## 6. OFFLINE CAPABILITY
- Application logic is entirely client-side.
- State is managed via Zustand.
- For persistence, the `data/` layer should be swapped from `localStorage` to `SQLite` using a bridge if running in Electron.

## 7. SECURITY & DETERMINISM
- All inputs are strictly typed and range-validated.
- Logic is decoupled from UI via the `useEMSStore`.
- No external CDN dependencies used (except for preview fonts/Tailwind, which should be vendored in a physical production build).
