
import React, { useState } from 'react';
import { useEMSStore } from '../store';
import { DispatchRecord } from '../types';
import * as XLSX from 'xlsx';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';

export const DispatchHistory: React.FC = () => {
  const history = useEMSStore(state => state.history);
  const deleteHistoryRecord = useEMSStore(state => state.deleteHistoryRecord);
  const updateHistoryRecord = useEMSStore(state => state.updateHistoryRecord);

  const [editingTimestamp, setEditingTimestamp] = useState<string | null>(null);
  const [editData, setEditData] = useState<DispatchRecord | null>(null);

  const startEdit = (record: DispatchRecord) => {
    setEditingTimestamp(record.timestamp);
    setEditData(JSON.parse(JSON.stringify(record)));
  };

  const cancelEdit = () => {
    setEditingTimestamp(null);
    setEditData(null);
  };

  const saveEdit = () => {
    if (editData) {
      updateHistoryRecord(editData);
    }
    setEditingTimestamp(null);
    setEditData(null);
  };

  const updateEditValue = (unitId: string, field: 'active' | 'reac' | 'soc', value: number) => {
    if (!editData) return;
    setEditData({
      ...editData,
      units: {
        ...editData.units,
        [unitId]: {
          ...editData.units[unitId],
          [field]: value
        }
      }
    });
  };

  const handleExport = (format: 'CSV' | 'XLSX' | 'JSON' | 'PDF') => {
    if (history.length === 0) return;

    const flattenedData = history.map(record => ({
      Timestamp: record.timestamp,
      'SWG_01_Active': record.units['SWG_01']?.active,
      'SWG_01_Reac': record.units['SWG_01']?.reac,
      'SWG_01_SOC': record.units['SWG_01']?.soc,
      'SWG_02_Active': record.units['SWG_02']?.active,
      'SWG_02_Reac': record.units['SWG_02']?.reac,
      'SWG_02_SOC': record.units['SWG_02']?.soc,
      'SWG_03_Active': record.units['SWG_03']?.active,
      'SWG_03_Reac': record.units['SWG_03']?.reac,
      'SWG_03_SOC': record.units['SWG_03']?.soc,
    }));

    const fileName = `EMS_DISPATCH_HISTORY_${new Date().toISOString().slice(0, 10)}`;

    switch (format) {
      case 'JSON': {
        const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(history, null, 2));
        const downloadAnchorNode = document.createElement('a');
        downloadAnchorNode.setAttribute("href", dataStr);
        downloadAnchorNode.setAttribute("download", `${fileName}.json`);
        document.body.appendChild(downloadAnchorNode);
        downloadAnchorNode.click();
        downloadAnchorNode.remove();
        break;
      }
      case 'CSV': {
        const worksheet = XLSX.utils.json_to_sheet(flattenedData);
        const csvOutput = XLSX.utils.sheet_to_csv(worksheet);
        const blob = new Blob([csvOutput], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.setAttribute("href", url);
        link.setAttribute("download", `${fileName}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        break;
      }
      case 'XLSX': {
        const worksheet = XLSX.utils.json_to_sheet(flattenedData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "DispatchHistory");
        XLSX.writeFile(workbook, `${fileName}.xlsx`);
        break;
      }
      case 'PDF': {
        const doc = new jsPDF('l', 'mm', 'a4');
        doc.setFont("helvetica", "bold");
        doc.setFontSize(14);
        doc.text("Industrial EMS Dispatch History", 14, 15);
        doc.setFontSize(8);
        doc.setTextColor(100);
        doc.text(`Generated: ${new Date().toLocaleString()}`, 14, 20);

        const tableBody = flattenedData.map(d => [
          d.Timestamp,
          d.SWG_01_Active?.toFixed(2), d.SWG_01_Reac?.toFixed(2), d.SWG_01_SOC?.toFixed(1) + '%',
          d.SWG_02_Active?.toFixed(2), d.SWG_02_Reac?.toFixed(2), d.SWG_02_SOC?.toFixed(1) + '%',
          d.SWG_03_Active?.toFixed(2), d.SWG_03_Reac?.toFixed(2), d.SWG_03_SOC?.toFixed(1) + '%'
        ]);

        (doc as any).autoTable({
          startY: 25,
          head: [['Timestamp', 'SWG01 Act', 'SWG01 Reac', 'SWG01 SOC', 'SWG02 Act', 'SWG02 Reac', 'SWG02 SOC', 'SWG03 Act', 'SWG03 Reac', 'SWG03 SOC']],
          body: tableBody,
          theme: 'grid',
          headStyles: { fillStyle: '#1e293b', textColor: [255, 255, 255], fontSize: 7 },
          styles: { fontSize: 7, font: 'courier' }
        });

        doc.save(`${fileName}.pdf`);
        break;
      }
    }
  };

  return (
    <div className="flex-1 border border-slate-800 bg-slate-900/20 rounded-xl overflow-hidden flex flex-col">
      <div className="px-6 py-4 flex items-center justify-between border-b border-slate-800 bg-slate-900/40">
        <div className="flex flex-col">
           <h2 className="text-xs font-black uppercase tracking-[0.2em] text-slate-200">Dispatch_History</h2>
           <span className="text-[9px] font-bold text-slate-500 uppercase">Active_Shift_Buffer</span>
        </div>
        
        <div className="flex items-center gap-4">
           <span className="text-[9px] font-black text-slate-600 uppercase tracking-widest">Protocol:</span>
           <div className="flex gap-1">
             <ExportBtn label="CSV" color="text-slate-400" onClick={() => handleExport('CSV')} />
             <ExportBtn label="XLSX" color="text-emerald-500" onClick={() => handleExport('XLSX')} />
             <ExportBtn label="JSON" color="text-amber-500" onClick={() => handleExport('JSON')} />
             <ExportBtn label="PDF" color="text-rose-500" onClick={() => handleExport('PDF')} />
           </div>
        </div>
      </div>

      <div className="flex-1 overflow-auto">
        <table className="w-full text-left border-collapse border-spacing-0">
          <thead className="sticky top-0 bg-slate-900 z-20 text-[9px] font-black uppercase text-slate-500 tracking-wider">
            <tr>
              <th rowSpan={2} className="px-6 py-3 border-b border-slate-800">Datetime_Stamp</th>
              <th colSpan={3} className="px-6 py-3 border-b border-l border-slate-800 text-center text-emerald-500">SWG 01</th>
              <th colSpan={3} className="px-6 py-3 border-b border-l border-slate-800 text-center text-indigo-500">SWG 02</th>
              <th colSpan={3} className="px-6 py-3 border-b border-l border-slate-800 text-center text-amber-500">SWG 03</th>
              <th rowSpan={2} className="px-6 py-3 border-b border-l border-slate-800">Actions</th>
            </tr>
            <tr>
              <th className="px-2 py-2 border-b border-l border-slate-800/50 text-center font-normal">Active</th>
              <th className="px-2 py-2 border-b border-slate-800/50 text-center font-normal">Reac</th>
              <th className="px-2 py-2 border-b border-slate-800/50 text-center font-normal">Soc</th>
              <th className="px-2 py-2 border-b border-l border-slate-800/50 text-center font-normal">Active</th>
              <th className="px-2 py-2 border-b border-slate-800/50 text-center font-normal">Reac</th>
              <th className="px-2 py-2 border-b border-slate-800/50 text-center font-normal">Soc</th>
              <th className="px-2 py-2 border-b border-l border-slate-800/50 text-center font-normal">Active</th>
              <th className="px-2 py-2 border-b border-slate-800/50 text-center font-normal">Reac</th>
              <th className="px-2 py-2 border-b border-slate-800/50 text-center font-normal">Soc</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/30 text-[11px] font-mono-industrial">
            {history.map((record, i) => {
              const isEditing = editingTimestamp === record.timestamp;
              const currentRecord = isEditing ? editData! : record;

              return (
                <tr key={i} className={`transition-colors ${isEditing ? 'bg-indigo-500/10' : 'hover:bg-white/5'}`}>
                  <td className="px-6 py-3 text-slate-500 flex items-center gap-2">
                    <svg className="w-3 h-3 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    {record.timestamp}
                  </td>
                  
                  {['SWG_01', 'SWG_02', 'SWG_03'].map(unitId => (
                    <UnitCells 
                      key={unitId}
                      unitId={unitId}
                      data={currentRecord.units[unitId]} 
                      isEditing={isEditing}
                      highlight={unitId === 'SWG_01' ? 'text-emerald-500' : unitId === 'SWG_02' ? 'text-indigo-500' : 'text-amber-500'}
                      onChange={(field, val) => updateEditValue(unitId, field, val)}
                    />
                  ))}

                  <td className="px-6 py-3 border-l border-slate-800/50">
                    <div className="flex gap-4 items-center">
                      {isEditing ? (
                        <>
                          <button onClick={saveEdit} className="text-emerald-500 hover:text-emerald-400">
                             <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M5 13l4 4L19 7" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" /></svg>
                          </button>
                          <button onClick={cancelEdit} className="text-rose-500 hover:text-rose-400">
                             <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M6 18L18 6M6 6l12 12" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" /></svg>
                          </button>
                        </>
                      ) : (
                        <>
                          <button onClick={() => startEdit(record)} className="opacity-30 hover:opacity-100 transition-opacity hover:text-white">
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" strokeWidth={2} /></svg>
                          </button>
                          <button onClick={() => deleteHistoryRecord(record.timestamp)} className="opacity-30 hover:opacity-100 transition-opacity hover:text-rose-500">
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" strokeWidth={2} /></svg>
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const UnitCells: React.FC<{ 
  unitId: string, 
  data?: { active: number, reac: number, soc: number }, 
  highlight: string,
  isEditing: boolean,
  onChange: (field: 'active' | 'reac' | 'soc', val: number) => void
}> = ({ data, highlight, isEditing, onChange }) => (
  <>
    <td className="px-2 py-3 border-l border-slate-800/30 text-center font-bold text-slate-200">
      {isEditing ? (
        <input 
          type="number" 
          value={data?.active} 
          onChange={(e) => onChange('active', parseFloat(e.target.value) || 0)}
          className="w-16 bg-slate-950 border border-slate-800 rounded px-1 text-center focus:outline-none focus:border-indigo-500"
        />
      ) : data?.active.toFixed(2)}
    </td>
    <td className="px-2 py-3 text-center text-slate-500">
      {isEditing ? (
        <input 
          type="number" 
          value={data?.reac} 
          onChange={(e) => onChange('reac', parseFloat(e.target.value) || 0)}
          className="w-16 bg-slate-950 border border-slate-800 rounded px-1 text-center focus:outline-none focus:border-indigo-500"
        />
      ) : data?.reac.toFixed(2)}
    </td>
    <td className={`px-2 py-3 text-center font-black ${highlight}`}>
      {isEditing ? (
        <div className="flex items-center justify-center">
          <input 
            type="number" 
            value={data?.soc} 
            onChange={(e) => onChange('soc', parseFloat(e.target.value) || 0)}
            className="w-12 bg-slate-950 border border-slate-800 rounded px-1 text-center focus:outline-none focus:border-indigo-500"
          />
          <span className="ml-0.5">%</span>
        </div>
      ) : `${data?.soc.toFixed(1)}%`}
    </td>
  </>
);

const ExportBtn: React.FC<{ label: string; color: string; onClick: () => void }> = ({ label, color, onClick }) => (
  <button 
    onClick={onClick}
    className={`flex items-center gap-1.5 px-2 py-1 bg-slate-900 border border-slate-800 rounded text-[9px] font-black ${color} hover:bg-slate-800 transition-colors uppercase`}
  >
    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1M16 10l-4 4m0 0l-4-4m4 4V4" strokeWidth={3} /></svg>
    {label}
  </button>
);
