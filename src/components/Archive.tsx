
import React, { useState } from 'react';
import type { PatientRecord } from '../types';

interface ArchiveProps {
  records: PatientRecord[];
  onDelete: (id: string) => void;
}

const Archive: React.FC<ArchiveProps> = ({ records, onDelete }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filtered = records.filter(r => 
    r.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.result.predictions[0].label.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.patientDetails?.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex flex-col gap-10">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-4">
        <div>
          <span className="text-[10px] font-mono font-bold tracking-[0.4em] opacity-40 uppercase text-black">System Logs / Archive</span>
          <h2 className="text-6xl font-black uppercase tracking-tighter mt-2 font-narrow">Diagnostic Archive</h2>
        </div>
        <div className="relative w-full md:w-96">
          <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-black/40">search</span>
          <input 
            type="text" 
            placeholder="Search Record ID or Pathology..."
            className="w-full pl-12 pr-4 py-4 neo-border bg-white text-xs font-bold uppercase tracking-widest focus:ring-primary focus:border-primary"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </header>

      {records.length === 0 ? (
        <div className="p-20 border-2 border-dashed border-gray-200 text-center flex flex-col items-center gap-6">
          <span className="material-symbols-outlined text-6xl text-gray-200">database</span>
          <p className="font-mono text-gray-400 uppercase tracking-widest text-xs">The archive is currently empty.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filtered.map((record) => (
            <div key={record.id} className="neo-border bg-white overflow-hidden group flex flex-col">
              <div className="aspect-video bg-white border-b-2 border-black relative overflow-hidden">
                <img 
                  src={record.image} 
                  alt="Scan Preview" 
                  className="w-full h-full object-cover grayscale-0 transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute top-4 left-4 bg-black text-white text-[9px] font-bold px-3 py-1 neo-border border-white/20">
                  {record.timestamp}
                </div>
              </div>
              <div className="p-8 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-2xl font-black uppercase font-narrow tracking-tighter">
                        {record.patientDetails?.name || 'Anonymous Patient'}
                      </h3>
                      <p className="text-[10px] font-black uppercase text-primary">
                        {record.result.predictions[0].label.replace('_', ' ')}
                      </p>
                    </div>
                    <span className="text-[10px] font-mono font-bold opacity-40 uppercase">ID: {record.id}</span>
                  </div>
                  <div className="space-y-2 mb-6">
                    <div className="flex justify-between text-[10px] font-black uppercase opacity-60">
                      <span>Confidence</span>
                      <span>{(record.result.predictions[0].confidence * 100).toFixed(1)}%</span>
                    </div>
                    <div className="h-1.5 w-full bg-white border border-black/10 overflow-hidden">
                      <div 
                        className="h-full bg-primary" 
                        style={{ width: `${record.result.predictions[0].confidence * 100}%` }}
                      ></div>
                    </div>
                  </div>
                  <p className="text-[11px] leading-relaxed opacity-60 italic line-clamp-2">
                    {record.result.reasoning}
                  </p>
                </div>
                <div className="mt-8 pt-6 border-t border-black/10 flex gap-4">
                  <button className="flex-1 py-3 neo-border text-[10px] font-black uppercase tracking-widest hover:bg-primary transition-colors">
                    View Details
                  </button>
                  <button 
                    onClick={() => onDelete(record.id)}
                    className="size-11 neo-border flex items-center justify-center text-black/40 hover:text-warning hover:bg-warning/10 transition-all"
                  >
                    <span className="material-symbols-outlined">delete</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Archive;
