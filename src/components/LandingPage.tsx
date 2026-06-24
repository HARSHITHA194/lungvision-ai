
import React from 'react';

interface LandingPageProps {
  onEnter: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onEnter }) => {
  return (
    <div className="min-h-screen bg-bone grainy-bg flex flex-col relative overflow-hidden">
      <header className="p-12 border-b-2 border-charcoal flex justify-between items-center bg-white/80 backdrop-blur sticky top-0 z-30">
        <div className="flex items-center gap-4">
          <div className="size-10 bg-primary neo-border flex items-center justify-center">
             <span className="material-symbols-outlined font-black">view_in_ar</span>
          </div>
          <div className="flex flex-col">
            <h1 className="text-2xl font-black font-narrow uppercase tracking-tighter">LUNGVISION AI</h1>
            <span className="text-[10px] font-mono opacity-40 uppercase font-bold tracking-[0.2em]">[SYSTEM_NODE_01]</span>
          </div>
        </div>
        <div className="hidden lg:flex gap-12 text-[11px] font-black uppercase tracking-[0.2em]">
          <a href="#" className="hover:text-primary transition-colors">Platform</a>
          <a href="#" className="hover:text-primary transition-colors">Security</a>
          <a href="#" className="hover:text-primary transition-colors">Archive</a>
        </div>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center p-12 max-w-[1400px] mx-auto w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center w-full">
          <div className="lg:col-span-7 flex flex-col gap-10">
            <span className="text-[11px] font-bold font-mono tracking-[0.5em] opacity-40 uppercase">[ARCHIVE_PROTOCOL_V4.0]</span>
            <h2 className="text-7xl md:text-9xl font-black font-narrow leading-[0.85] uppercase tracking-tighter">
              AI-POWERED <br/>
              <span className="bg-charcoal text-primary px-4 py-1 inline-block">LUNG ANALYSIS</span>
            </h2>
            <p className="max-w-xl text-lg font-medium opacity-80 leading-relaxed border-l-4 border-primary pl-6 py-2">
              High-precision neural networks for automated thoracic pathology detection. Designed for clinical-grade diagnostic support and quantitative volume mapping.
            </p>
            <div className="flex flex-wrap gap-6 mt-4">
              <button 
                onClick={onEnter}
                className="px-10 py-5 bg-primary neo-border text-charcoal font-black uppercase tracking-widest text-sm neo-shadow-hover transition-all flex items-center gap-3"
              >
                Launch Dashboard
                <span className="material-symbols-outlined font-bold">arrow_forward</span>
              </button>
              <button className="px-10 py-5 bg-transparent border-2 border-charcoal text-charcoal font-black uppercase tracking-widest text-sm hover:bg-charcoal hover:text-white transition-all">
                Documentation
              </button>
            </div>
          </div>
          <div className="lg:col-span-5 relative">
            <div className="neo-border bg-charcoal overflow-hidden neo-shadow aspect-square relative group">
              <img 
                src="https://picsum.photos/seed/lungs/800/800" 
                alt="Lung X-ray Visualization" 
                className="w-full h-full object-cover opacity-60 grayscale contrast-125 transition-transform duration-700 group-hover:scale-105" 
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="size-48 border-2 border-primary relative flex items-center justify-center">
                   <div className="absolute top-0 left-0 size-3 bg-primary -translate-x-1.5 -translate-y-1.5"></div>
                   <div className="absolute top-0 right-0 size-3 bg-primary translate-x-1.5 -translate-y-1.5"></div>
                   <div className="absolute bottom-0 left-0 size-3 bg-primary -translate-x-1.5 translate-y-1.5"></div>
                   <div className="absolute bottom-0 right-0 size-3 bg-primary translate-x-1.5 translate-y-1.5"></div>
                   <span className="text-[10px] font-bold text-primary tracking-[0.3em] font-mono">SCANNING...</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full mt-32">
          {[
            { label: 'Sensitivity', value: '99.2%', desc: 'Across diverse clinical datasets' },
            { label: 'Latency', value: '< 2.0s', desc: 'Real-time neural processing' },
            { label: 'Explainable', value: 'GRAD-CAM', desc: 'Transparent visual logic' }
          ].map((stat, i) => (
            <div key={i} className="neo-border p-10 bg-white neo-shadow-sm flex flex-col justify-between min-h-[220px]">
              <span className="text-[10px] font-bold uppercase tracking-widest opacity-40">{stat.label}</span>
              <div>
                <h3 className="text-5xl font-black font-narrow">{stat.value}</h3>
                <p className="text-[11px] font-bold uppercase tracking-widest mt-2 opacity-60 italic">{stat.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </main>

      <footer className="mt-24 p-12 border-t-2 border-charcoal bg-white flex justify-between items-center text-[10px] font-bold font-mono opacity-40 uppercase tracking-[0.2em]">
        <span>© 2024 PRISM ARCHIVE TECHNOLOGIES</span>
        <div className="flex gap-10">
          <a href="#">Privacy</a>
          <a href="#">Terms</a>
          <a href="#">Security</a>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
