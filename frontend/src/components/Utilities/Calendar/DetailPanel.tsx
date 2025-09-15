import { memo } from 'react';
import { Calendar, Star, ChevronDown } from 'lucide-react';
import type { DetailPanelProps } from './types';
import { VAN_BAN_VI } from './constants';

const DetailPanel = memo(({ 
  selectedDay, 
  showDetailPanel, 
  onClose, 
  hijriMonthsVi, 
  gregorianMonthsVi 
}: DetailPanelProps) => {
  if (!selectedDay) return null;

  return (
    <>
      {/* Mobile Overlay */}
      <div 
        className={`fixed inset-0 bg-black/50 z-10 lg:hidden transition-opacity duration-300 ${
          showDetailPanel ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
      />
      
      {/* Mobile Panel */}
      <div className={`fixed bottom-0 left-0 right-0 z-20 p-6 rounded-t-3xl bg-card shadow-luxury lg:hidden transition-transform duration-300 ${
        showDetailPanel ? 'translate-y-0' : 'translate-y-full'
      }`}>
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <div className="p-2 rounded-xl bg-primary/10 mr-3">
              <Calendar className="w-5 h-5 text-primary" />
            </div>
            <h3 className="text-xl font-bold text-foreground">
              {VAN_BAN_VI.CHI_TIET_NGAY}
            </h3>
          </div>
          <button 
            onClick={onClose}
            className="p-2 rounded-full bg-muted hover:bg-muted/80 transition-colors"
          >
            <ChevronDown className="w-5 h-5 text-muted-foreground" />
          </button>
        </div>
        
        <div className="space-y-4">
          {/* Lịch Dương */}
          <div className="p-4 rounded-2xl bg-muted/50 border border-border">
            <h4 className="font-semibold mb-2 text-xs text-muted-foreground uppercase tracking-wide">
              {VAN_BAN_VI.LICH_GREGORIAN}
            </h4>
            <p className="text-2xl font-bold mb-1 text-primary">
              {selectedDay.gregorian.day}
            </p>
            <p className="text-xs text-muted-foreground font-medium">
              {gregorianMonthsVi[parseInt(selectedDay.gregorian.month.number.toString()) - 1]} {selectedDay.gregorian.year}
            </p>
          </div>
          
          {/* Lịch Hijri */}
          <div className="p-4 rounded-2xl bg-teal-50/80 dark:bg-teal-900/20 border border-teal-200/50 dark:border-teal-800/50">
            <h4 className="font-semibold mb-2 text-xs text-teal-600 dark:text-teal-400 uppercase tracking-wide">
              {VAN_BAN_VI.LICH_HIJRI}
            </h4>
            <p className="text-2xl font-bold mb-1 text-teal-600 dark:text-teal-400">
              {selectedDay.hijri.day}
            </p>
            <p className="text-xs mb-1 text-foreground font-medium">
              {hijriMonthsVi[selectedDay.hijri.month.number - 1]} {selectedDay.hijri.year}H
            </p>
            <p className="text-xs text-muted-foreground font-arabic">
              {selectedDay.hijri.month.ar}
            </p>
          </div>
          
          {/* Lễ đặc biệt */}
          {selectedDay.hijri.holidays && selectedDay.hijri.holidays.length > 0 && (
            <div className="p-4 rounded-2xl bg-amber-50/80 dark:bg-amber-900/20 border border-amber-200/50 dark:border-amber-800/50">
              <div className="flex items-center mb-2">
                <Star className="w-4 h-4 mr-2 text-amber-600 dark:text-amber-400" />
                <h4 className="font-semibold text-xs text-amber-700 dark:text-amber-400 uppercase tracking-wide">
                  {VAN_BAN_VI.LE_DAC_BIET}
                </h4>
              </div>
              {selectedDay.hijri.holidays.map((holiday, index) => (
                <div 
                  key={index}
                  className="flex items-center text-xs mb-1 p-2 rounded-lg bg-card/60 backdrop-blur-sm"
                >
                  <span className="text-base mr-2">🌙</span>
                  <span className="text-foreground font-medium">{holiday}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
});

DetailPanel.displayName = 'DetailPanel';

export default DetailPanel;
