
import React, { useState, useRef } from 'react';
import { analyzeXray, chatAssistant } from '../services/geminiService';
import { Severity } from '../types';
import type { AnalysisResult, PatientRecord } from '../types';
import { jsPDF } from 'jspdf';

interface DashboardProps {
  onSaveRecord: (record: PatientRecord) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ onSaveRecord }) => {
  const [image, setImage] = useState<string | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [opacity, setOpacity] = useState(0.5);
  const [chatInput, setChatInput] = useState('');
  const [chatHistory, setChatHistory] = useState<{role: string, text: string}[]>([]);
  const [patientData, setPatientData] = useState({ 
    name: '', 
    age: '', 
    gender: 'Male', 
    address: '', 
    symptoms: '' 
  });
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const generateReport = () => {
    if (!result || !image) return;
    const doc = new jsPDF();
    doc.setFontSize(22);
    doc.text("LUNGVISION AI CLINICAL REPORT", 20, 20);
    doc.setFontSize(10);
    doc.text(`Timestamp: ${new Date().toLocaleString()}`, 20, 30);
    doc.text(`Patient: ${patientData.name || 'N/A'}`, 20, 40);
    doc.text(`Age: ${patientData.age || 'N/A'} | Gender: ${patientData.gender}`, 20, 45);
    doc.text(`Address: ${patientData.address || 'N/A'}`, 20, 50);
    doc.text(`Symptoms: ${patientData.symptoms || 'None'}`, 20, 55, { maxWidth: 170 });
    doc.text(`Primary Finding: ${result.predictions[0].label}`, 20, 70);
    doc.text(`Severity: ${result.severity}`, 20, 75);
    doc.text(`Reasoning: ${result.reasoning}`, 20, 85, { maxWidth: 170 });
    doc.save(`Report_${patientData.name || 'Patient'}_${Date.now()}.pdf`);
  };

  const handleChat = async () => {
    if (!chatInput || !result || !image) return;
    const msg = chatInput;
    setChatInput('');
    setChatHistory(prev => [...prev, { role: 'user', text: msg }]);
    const response = await chatAssistant(msg, result, image);
    setChatHistory(prev => [...prev, { role: 'ai', text: response }]);
  };

  const handleAnalysis = async () => {
    if (!image) return;
    setAnalyzing(true);
    try {
      const data = await analyzeXray(image, undefined, patientData);
      setResult(data);
      onSaveRecord({
        id: Math.random().toString(36).substr(2, 9),
        timestamp: new Date().toLocaleString(),
        image: image,
        result: data,
        review: { status: 'PENDING', notes: '', reviewedBy: 'DR_CURRENT' },
        patientDetails: patientData
      });
    } catch {
      alert("Analysis failed.");
    }
    finally { setAnalyzing(false); }
  };

  return (
    <div className="grid grid-cols-1 xl:grid-cols-12 gap-10">
      <div className="xl:col-span-3 flex flex-col gap-6">
        <div className="neo-border p-6 bg-white neo-shadow-sm">
          <h3 className="text-xs font-black uppercase tracking-widest mb-4">Patient Profile</h3>
          <div className="space-y-4">
            <input type="text" placeholder="Patient Name" className="w-full neo-border p-2 text-xs font-bold" value={patientData.name} onChange={e => setPatientData({...patientData, name: e.target.value})} />
            <div className="grid grid-cols-2 gap-2">
              <input type="number" placeholder="Age" className="w-full neo-border p-2 text-xs font-bold" value={patientData.age} onChange={e => setPatientData({...patientData, age: e.target.value})} />
              <select className="w-full neo-border p-2 text-xs font-bold" value={patientData.gender} onChange={e => setPatientData({...patientData, gender: e.target.value})}>
                <option>Male</option>
                <option>Female</option>
                <option>Other</option>
              </select>
            </div>
            <input type="text" placeholder="Address" className="w-full neo-border p-2 text-xs font-bold" value={patientData.address} onChange={e => setPatientData({...patientData, address: e.target.value})} />
            <textarea placeholder="Symptoms..." className="w-full neo-border p-2 text-xs font-bold h-20" value={patientData.symptoms} onChange={e => setPatientData({...patientData, symptoms: e.target.value})} />
          </div>
        </div>

        <div onClick={() => fileInputRef.current?.click()} className="aspect-square neo-border bg-white flex flex-col items-center justify-center p-4 cursor-pointer hover:bg-bone transition-all">
          {image ? <img src={image} className="w-full h-full object-contain" /> : <span className="material-symbols-outlined text-4xl">add_a_photo</span>}
          <input type="file" ref={fileInputRef} className="hidden" onChange={e => {
            const f = e.target.files?.[0];
            if(f) { const r = new FileReader(); r.onload = () => setImage(r.result as string); r.readAsDataURL(f); }
          }} />
        </div>

        <button disabled={!image || analyzing} onClick={handleAnalysis} className="w-full py-4 bg-primary neo-border neo-shadow-sm font-black uppercase tracking-widest text-xs">
          {analyzing ? 'Processing...' : 'Run Neural Inference'}
        </button>
      </div>

      <div className="xl:col-span-9 flex flex-col gap-8">
        {result ? (
          <>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="flex flex-col gap-4">
                <div className="relative aspect-video neo-border bg-black overflow-hidden group">
                  <img src={image!} className="w-full h-full object-cover grayscale" />
                  <div className="absolute inset-0 transition-opacity" style={{ 
                    opacity: opacity,
                    background: `radial-gradient(circle at 50% 50%, rgba(255, 61, 0, 0.6) 0%, rgba(255, 196, 0, 0.4) 40%, transparent 80%)` 
                  }} />
                  <div className="absolute bottom-4 left-4 right-4 bg-white/90 neo-border p-2 flex items-center gap-4">
                    <span className="text-[10px] font-black uppercase">Heatmap Focus</span>
                    <input type="range" min="0" max="1" step="0.01" value={opacity} onChange={e => setOpacity(parseFloat(e.target.value))} className="flex-1" />
                  </div>
                </div>
                
                <div className="neo-border bg-black p-6 text-white">
                  <h4 className="text-[10px] font-black text-primary uppercase mb-4 tracking-[0.2em]">Diagnostic AI Assistant</h4>
                  <div className="h-48 overflow-y-auto mb-4 space-y-2 pr-2 custom-scrollbar text-[11px] font-mono">
                    {chatHistory.map((c, i) => (
                      <div key={i} className={`${c.role === 'ai' ? 'text-primary' : 'text-gray-400'}`}>
                        [{c.role.toUpperCase()}]: {c.text}
                      </div>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <input type="text" className="flex-1 bg-transparent border-b border-primary/50 text-[11px] p-1 focus:outline-none" placeholder="Ask about findings..." value={chatInput} onChange={e => setChatInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleChat()} />
                    <button onClick={handleChat} className="material-symbols-outlined text-primary">send</button>
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-6">
                <div className={`p-6 neo-border neo-shadow-sm flex items-center justify-between ${result.severity === Severity.SEVERE ? 'bg-red-50' : 'bg-white'}`}>
                  <div>
                    <span className="text-[10px] font-black uppercase opacity-40">Primary Finding</span>
                    <h3 className="text-4xl font-black font-narrow uppercase tracking-tighter">{result.predictions[0].label}</h3>
                    <div className="flex gap-4 mt-2">
                       <span className="px-2 py-0.5 bg-black text-white text-[9px] font-black uppercase tracking-widest">{result.severity}</span>
                       <span className="text-[9px] font-bold text-gray-500 uppercase tracking-widest">Risk: {(result.riskProbability * 100).toFixed(0)}%</span>
                    </div>
                  </div>
                  <div className="flex flex-col items-center">
                    <div className="size-16 neo-border border-4 flex items-center justify-center bg-primary">
                       <span className="text-2xl font-black">{(result.predictions[0].confidence * 100).toFixed(0)}</span>
                    </div>
                    <span className="text-[8px] font-black uppercase mt-1">Conf %</span>
                  </div>
                </div>

                <div className="neo-border bg-white p-6">
                   <h4 className="text-[10px] font-black uppercase border-b border-black pb-2 mb-4">Clinical Reasoning</h4>
                   <p className="text-xs font-mono leading-relaxed">{result.reasoning}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <button onClick={generateReport} className="py-4 neo-border flex items-center justify-center gap-2 hover:bg-primary transition-all text-xs font-black uppercase">
                    <span className="material-symbols-outlined">description</span> Report
                  </button>
                  <div className="neo-border bg-white p-2 flex flex-col items-center justify-center">
                     <span className="text-[9px] font-black uppercase opacity-40">Review Status</span>
                     <span className="text-xs font-black text-warning">PENDING</span>
                  </div>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="h-full min-h-[500px] neo-border border-dashed flex flex-col items-center justify-center opacity-20">
             <span className="material-symbols-outlined text-8xl mb-4">clinical_notes</span>
             <p className="font-narrow font-black text-2xl uppercase">System Ready for Input</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
