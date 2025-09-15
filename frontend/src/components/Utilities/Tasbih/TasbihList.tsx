import { tasbihData } from './data';
import type { SavedCounts, TasbihItem } from './types';
import { getAccentClasses } from './accent';
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface TasbihListProps {
  onSelectTasbih: (tasbih: TasbihItem) => void;
  savedCounts: SavedCounts;
}

const TasbihList: React.FC<TasbihListProps> = ({ onSelectTasbih, savedCounts }) => {
  return (
    <div className="p-6">
      <Card className="text-center mb-8 p-6">
        <h2 
          className="text-2xl font-bold mb-2 text-foreground"
        >
          بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
        </h2>
        <p 
          className="text-sm text-muted-foreground"
        >
          Nhân danh Allah, Đấng Vô cùng Nhân từ, Vô cùng Khoan dung
        </p>
      </Card>

      <div className="grid gap-4">
        {tasbihData.map((tasbih) => {
          const currentCount = savedCounts[tasbih.id] || 0;
          const progress = (currentCount / tasbih.target) * 100;
          const accent = getAccentClasses(tasbih.id);
          return (
            <Card
              key={tasbih.id}
              onClick={() => onSelectTasbih(tasbih)}
              className={`text-left p-6 rounded-xl transition-transform hover:scale-[1.02] active:scale-[0.98] bg-card shadow-md border border-border cursor-pointer ${accent.text}`}
            >
              <div className="flex items-center justify-between mb-3">
                <div 
                  className="w-4 h-4 rounded-full"
                  style={{ backgroundColor: tasbih.color }}
                />
                <div className="text-right">
                  <span className="text-sm font-medium text-muted-foreground">
                    {currentCount}/{tasbih.target}
                  </span>
                </div>
              </div>
              <h3 
                className="font-semibold text-lg mb-1 text-foreground"
              >
                {tasbih.name}
              </h3>
              <p 
                className="text-xl mb-2 font-arabic"
                style={{ color: tasbih.color }}
              >
                {tasbih.arabic}
              </p>
              <p className="text-sm mb-3 text-muted-foreground">
                {tasbih.meaning}
              </p>
              <div className={`w-full`}>
                <Progress value={Math.min(progress, 100)} className={`h-2 ${accent.progressIndicator}`} />
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default TasbihList;


