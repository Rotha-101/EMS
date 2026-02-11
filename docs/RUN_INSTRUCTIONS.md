
# INDUSTRIAL EMS BUILD SYSTEM

Follow these deterministic steps to generate the Windows EXE.

## 1. Local Environment Setup
Open PowerShell as Administrator:
```powershell
npm install
```

## 2. Development Mode
Run the dashboard in a hot-reload browser environment:
```powershell
npm run dev
```

## 3. Generate Standalone Windows EXE
This command bundles the assets and packages them into a single file located in the `release/` directory:
```powershell
npm run dist
```

## 4. Launching the Product
Once the build completes, navigate to the `release` folder and double-click:
`EMS_Dispatch_v3.0.4.exe`

### Terminal Execution
The production app can be launched via command line:
```powershell
.\release\EMS_Dispatch_v3.0.4.exe
```

### Safety Note
This build is configured for **Offline Local Operation**. No data is transmitted outside the local machine. All dispatch sequences are committed to the local memory store and can be exported via the "Protocol" actions in the UI.
