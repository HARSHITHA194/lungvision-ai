import React, { useState } from 'react';
import { View } from './types';
import type { PatientRecord } from './types';
import LandingPage from './components/LandingPage';
import Dashboard from './components/Dashboard';
import Archive from './components/Archive';
import Sidebar from './components/Sidebar';
import Analytics from './components/Analytics';
import Comparison from './components/Comparison';

const STORAGE_KEY = 'lungvision_enterprise_records';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>(View.LANDING);

  // ✅ Lazy initialization (fixes useEffect warning)
  const [records, setRecords] = useState<PatientRecord[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      localStorage.removeItem(STORAGE_KEY);
      return [];
    }
  });

  // ✅ Safe state update (avoids stale state bugs)
  const addRecord = (record: PatientRecord) => {
    setRecords(prev => {
      const updated = [record, ...prev];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });
  };

  const deleteRecord = (id: string) => {
    setRecords(prev => {
      const updated = prev.filter(r => r.id !== id);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });
  };

  if (currentView === View.LANDING) {
    return <LandingPage onEnter={() => setCurrentView(View.DASHBOARD)} />;
  }

  return (
    <div className="flex h-screen w-full bg-white selection:bg-primary">
      <Sidebar activeView={currentView} onNavigate={setCurrentView} />

      <main className="flex-1 overflow-y-auto relative">
        <div className="p-12 max-w-[1400px] mx-auto">

          {currentView === View.DASHBOARD && (
            <Dashboard onSaveRecord={addRecord} />
          )}

          {currentView === View.ARCHIVE && (
            <Archive records={records} onDelete={deleteRecord} />
          )}

          {currentView === View.ANALYTICS && (
            <Analytics records={records} />
          )}

          {currentView === View.COMPARISON && (
            <Comparison records={records} />
          )}

          {currentView === View.AUDIT && (
            <div className="neo-border p-10 bg-white">
              <h2 className="text-4xl font-black uppercase font-narrow mb-8">
                Security Audit Logs
              </h2>

              <div className="space-y-2 font-mono text-xs">
                {records.map(r => (
                  <div
                    key={r.id}
                    className="p-2 border-b border-black/10 flex justify-between"
                  >
                    <span>[UPLOAD] USER_RADIOLOGIST_{r.id}</span>
                    <span className="opacity-40">{r.timestamp}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      </main>
    </div>
  );
};

export default App;