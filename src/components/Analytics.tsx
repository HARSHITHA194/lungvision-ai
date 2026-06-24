
import React, { useEffect, useRef } from 'react';
import { Chart, registerables } from 'chart.js';
import type { PatientRecord } from '../types';

Chart.register(...registerables);

const Analytics: React.FC<{ records: PatientRecord[] }> = ({ records }) => {
  const pieRef = useRef<HTMLCanvasElement>(null);
  const lineRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!pieRef.current || !lineRef.current) return;

    const counts: Record<string, number> = {};
    records.forEach(r => {
      const label = r.result.predictions[0].label;
      counts[label] = (counts[label] || 0) + 1;
    });

    const pieChart = new Chart(pieRef.current, {
      type: 'doughnut',
      data: {
        labels: Object.keys(counts),
        datasets: [{
          data: Object.values(counts),
          backgroundColor: ['#00D9FF', '#FF3D00', '#00E676', '#000000', '#CCCCCC'],
          borderWidth: 2,
          borderColor: '#000000'
        }]
      },
      options: { plugins: { legend: { position: 'bottom', labels: { font: { family: 'JetBrains Mono', weight: 'bold' } } } } }
    });

    const lineChart = new Chart(lineRef.current, {
      type: 'line',
      data: {
        labels: records.map(r => r.id).slice(-10),
        datasets: [{
          label: 'Confidence Scores',
          data: records.map(r => r.result.predictions[0].confidence).slice(-10),
          borderColor: '#00D9FF',
          backgroundColor: '#00D9FF',
          tension: 0,
          borderWidth: 4
        }]
      },
      options: { 
        scales: { 
          y: { min: 0, max: 1, grid: { color: '#eee' } },
          x: { grid: { display: false } }
        }
      }
    });

    return () => { pieChart.destroy(); lineChart.destroy(); };
  }, [records]);

  return (
    <div className="space-y-12">
      <header>
        <span className="text-[10px] font-mono font-bold tracking-[0.4em] opacity-40 uppercase text-black">BI / Performance Metrics</span>
        <h2 className="text-6xl font-black uppercase tracking-tighter mt-2 font-narrow">Enterprise Analytics</h2>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        <div className="neo-border p-8 bg-white neo-shadow-sm">
           <h4 className="text-xs font-black uppercase mb-8 border-b-2 border-black pb-2">Disease Distribution</h4>
           <div className="h-80"><canvas ref={pieRef}></canvas></div>
        </div>
        <div className="neo-border p-8 bg-white neo-shadow-sm">
           <h4 className="text-xs font-black uppercase mb-8 border-b-2 border-black pb-2">Model Reliability (Last 10)</h4>
           <div className="h-80"><canvas ref={lineRef}></canvas></div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-8">
        {[
          { l: 'Mean Sensitivity', v: '94.2%', s: 'up' },
          { l: 'Avg Processing', v: '1.2s', s: 'down' },
          { l: 'F1 Score', v: '0.89', s: 'up' }
        ].map((item, i) => (
          <div key={i} className="neo-border p-6 bg-black text-white neo-shadow-sm">
             <span className="text-[10px] font-black uppercase opacity-40">{item.l}</span>
             <div className="text-4xl font-black font-narrow mt-2 text-primary">{item.v}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Analytics;
