
import React, { useState } from 'react';
import type { PatientRecord } from '../types';

const Comparison: React.FC<{ records: PatientRecord[] }> = ({ records }) => {
  const [left, setLeft] = useState<string>(records[0]?.id || '');
  const [right, setRight] = useState<string>(records[1]?.id || '');

  const leftRecord = records.find(r => r.id === left);
  const rightRecord = records.find(r => r.id === right);

  return (
    <div className="space-y-8">
       <header>
        <span className="text-[10px] font-mono font-bold tracking-[0.4em] opacity-40 uppercase text-black">Clinical / Longitudinal Study</span>
        <h2 className="text-6xl font-black uppercase tracking-tighter mt-2 font-narrow">Case Comparison</h2>
      </header>

      <div className="grid grid-cols-2 gap-10">
        <div className="space-y-4">
           <select className="w-full neo-border p-3 font-bold uppercase text-xs" value={left} onChange={e => setLeft(e.target.value)}>
             {records.map(r => <option key={r.id} value={r.id}>{r.patientDetails?.name || 'Anonymous'} ({r.id.slice(0,4)}) - {r.timestamp}</option>)}
           </select>
           {leftRecord && (
             <div className="neo-border p-4 bg-white neo-shadow-sm">
               <img src={leftRecord.image} className="w-full aspect-square object-cover grayscale" />
               <div className="mt-4 border-t-2 border-black pt-4">
                 <h4 className="font-black uppercase text-sm">{leftRecord.patientDetails?.name || 'Anonymous'}</h4>
                 <p className="text-[10px] font-mono mt-1 opacity-60">Findings: {leftRecord.result.predictions[0].label} | Severity: {leftRecord.result.severity}</p>
               </div>
             </div>
           )}
        </div>

        <div className="space-y-4">
           <select className="w-full neo-border p-3 font-bold uppercase text-xs" value={right} onChange={e => setRight(e.target.value)}>
             {records.map(r => <option key={r.id} value={r.id}>{r.patientDetails?.name || 'Anonymous'} ({r.id.slice(0,4)}) - {r.timestamp}</option>)}
           </select>
           {rightRecord && (
             <div className="neo-border p-4 bg-white neo-shadow-sm">
               <img src={rightRecord.image} className="w-full aspect-square object-cover grayscale" />
               <div className="mt-4 border-t-2 border-black pt-4">
                 <h4 className="font-black uppercase text-sm">{rightRecord.patientDetails?.name || 'Anonymous'}</h4>
                 <p className="text-[10px] font-mono mt-1 opacity-60">Findings: {rightRecord.result.predictions[0].label} | Severity: {rightRecord.result.severity}</p>
               </div>
             </div>
           )}
        </div>
      </div>
    </div>
  );
};

export default Comparison;
