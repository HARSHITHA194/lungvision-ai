
import React from 'react';
import { View } from '../types';

interface SidebarProps {
  activeView: View;
  onNavigate: (view: View) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeView, onNavigate }) => {
  const menuItems = [
    { view: View.DASHBOARD, label: 'Diagnostic', icon: 'biotech' },
    { view: View.COMPARISON, label: 'Study', icon: 'compare' },
    { view: View.ARCHIVE, label: 'Archive', icon: 'inventory_2' },
    { view: View.ANALYTICS, label: 'Business Intelligence', icon: 'analytics' },
    { view: View.AUDIT, label: 'Audit', icon: 'lock' },
  ];

  return (
    <aside className="w-20 lg:w-72 h-full border-r-2 border-black flex flex-col bg-white z-20">
      <div className="p-6 lg:p-10 flex items-center gap-4 border-b-2 border-black mb-8">
        <div className="size-10 bg-primary neo-border flex items-center justify-center shrink-0">
          <span className="material-symbols-outlined text-black font-black text-xl">pulmonology</span>
        </div>
        <h1 className="hidden lg:block font-narrow font-black text-2xl uppercase italic tracking-tighter">LungVision Suite</h1>
      </div>

      <nav className="flex-1 flex flex-col px-6 gap-3">
        {menuItems.map((item) => (
          <button
            key={item.view}
            onClick={() => onNavigate(item.view)}
            className={`
              flex items-center gap-4 p-4 neo-border transition-all
              ${activeView === item.view 
                ? 'bg-primary text-black neo-shadow-sm translate-x-1 -translate-y-1 font-black' 
                : 'hover:bg-bone hover:border-black font-bold'}
            `}
          >
            <span className="material-symbols-outlined">{item.icon}</span>
            <span className="hidden lg:block text-[10px] uppercase tracking-[0.2em]">{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="p-10 border-t-2 border-black flex flex-col gap-4">
        <div className="hidden lg:flex flex-col gap-1">
          <div className="text-[9px] font-mono font-black text-black">NODE: US-EAST-CLINICAL</div>
          <div className="text-[9px] font-mono font-black text-success">ENCRYPTION: AES-256</div>
        </div>
        <button 
          onClick={() => onNavigate(View.LANDING)}
          className="w-full p-3 neo-border flex items-center justify-center hover:bg-warning hover:text-white transition-colors"
        >
          <span className="material-symbols-outlined">logout</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
