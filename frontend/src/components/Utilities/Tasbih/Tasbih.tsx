import { useEffect, useState } from 'react';
// Use global ThemeContext and shadcn tokens; no local theme here
import { tasbihData } from './data';
import Header from './Header';
import TasbihList from './TasbihList';
import Counter from './Counter';
import type { SavedCounts, TasbihItem } from './types';

const TasbihApp: React.FC = () => {
  const [currentTasbih, setCurrentTasbih] = useState<TasbihItem | null>(null);
  const [showSettings, setShowSettings] = useState<boolean>(false);
  const [savedCounts, setSavedCounts] = useState<SavedCounts>(() => {
    const counts: SavedCounts = {};
    tasbihData.forEach(tasbih => {
      const saved = localStorage.getItem(`tasbih-count-${tasbih.id}`);
      counts[tasbih.id] = saved ? parseInt(saved, 10) : 0;
    });
    return counts;
  });

  useEffect(() => {
    const interval = setInterval(() => {
      const counts: SavedCounts = {};
      tasbihData.forEach(tasbih => {
        const saved = localStorage.getItem(`tasbih-count-${tasbih.id}`);
        counts[tasbih.id] = saved ? parseInt(saved, 10) : 0;
      });
      setSavedCounts(counts);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen font-sans bg-background">
      <div className="max-w-md mx-auto shadow-2xl min-h-screen bg-card rounded-2xl overflow-hidden">
        <Header 
          onSettings={() => setShowSettings(!showSettings)}
          onBack={currentTasbih ? () => setCurrentTasbih(null) : undefined}
        />
        <div className="h-full">
          {currentTasbih ? (
            <Counter tasbih={currentTasbih} />
          ) : (
            <TasbihList onSelectTasbih={setCurrentTasbih} savedCounts={savedCounts} />
          )}
        </div>
      </div>
    </div>
  );
};

export default TasbihApp;


