import { useEffect, useState } from 'react';
import { RotateCcw, Trophy, Volume2, VolumeX } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import type { TasbihItem } from './types';

interface CounterProps {
  tasbih: TasbihItem;
}

const Counter: React.FC<CounterProps> = ({ tasbih }) => {
  const [count, setCount] = useState(() => {
    const saved = localStorage.getItem(`tasbih-count-${tasbih.id}`);
    return saved ? parseInt(saved, 10) : 0;
  });
  const [isSoundEnabled, setIsSoundEnabled] = useState(() => {
    const saved = localStorage.getItem('tasbih-sound');
    return saved ? JSON.parse(saved) : true;
  });
  const [showCelebration, setShowCelebration] = useState(false);

  useEffect(() => {
    localStorage.setItem(`tasbih-count-${tasbih.id}`, count.toString());
  }, [count, tasbih.id]);

  useEffect(() => {
    localStorage.setItem('tasbih-sound', JSON.stringify(isSoundEnabled));
  }, [isSoundEnabled]);

  const increment = () => {
    const newCount = count + 1;
    setCount(newCount);
    if (isSoundEnabled) {
      try {
        const AudioContextClass = (window as any).AudioContext || (window as any).webkitAudioContext;
        const audioContext = new AudioContextClass();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
        gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.1);
      } catch (error) {
        console.warn('Audio context not supported:', error);
      }
    }
    if (newCount === tasbih.target) {
      setShowCelebration(true);
      setTimeout(() => setShowCelebration(false), 2000);
    }
  };

  const reset = () => {
    setCount(0);
  };

  const progress = (count / tasbih.target) * 100;
  const isComplete = count >= tasbih.target;

  return (
    <div className="flex flex-col h-dvh overflow-hidden md:h-auto md:overflow-visible">
      <Card className="text-center p-3 mx-3 my-2 md:p-6 md:mx-6 md:my-4">
        <p 
          className="text-4xl mb-4 font-arabic leading-relaxed"
          style={{ color: tasbih.color }}
        >
          {tasbih.arabic}
        </p>
        <p 
          className="text-lg font-semibold mb-2 text-foreground"
        >
          {tasbih.name}
        </p>
        <p className="text-sm text-muted-foreground">
          {tasbih.meaning}
        </p>
      </Card>

      <div className="flex-1 flex flex-col justify-center items-center px-3 py-3 md:p-6">
        <Card 
          className="relative mb-4 p-4 rounded-full shadow-lg flex items-center justify-center w-[60vw] h-[60vw] max-w-72 max-h-72 min-w-44 min-h-44 md:w-72 md:h-72 md:p-6"
        >
          <svg 
            className="absolute inset-0 w-full h-full transform -rotate-90" 
            viewBox="0 0 100 100"
          >
            <circle cx="50" cy="50" r="45" fill="none" className="stroke-border" strokeWidth="2" />
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke={tasbih.color}
              strokeWidth="3"
              strokeDasharray={`${2 * Math.PI * 45}`}
              strokeDashoffset={`${2 * Math.PI * 45 * (1 - progress / 100)}`}
              className="transition-all duration-300"
            />
          </svg>
          <div className="text-center">
            <div className="text-5xl font-bold mb-2 text-foreground">
              {count}
            </div>
            <div className="text-sm text-muted-foreground">
              / {tasbih.target}
            </div>
          </div>
          {isComplete && (
            <div 
              className="absolute -top-2 -right-2 p-2 rounded-full"
              style={{ backgroundColor: '#34C759' }}
            >
              <Trophy size={16} color="white" />
            </div>
          )}
        </Card>

        <Button onClick={increment} size="lg" className="w-24 h-24 md:w-28 md:h-28 rounded-full transition-all hover:scale-105 active:scale-95 mb-3 md:mb-4 shadow-lg" style={{ backgroundColor: tasbih.color }}>
          <span className="text-white text-xl font-semibold">Đếm</span>
        </Button>

        <div className="flex items-center space-x-2 md:space-x-3">
          <Button onClick={reset} variant="secondary" size="sm" className="flex items-center space-x-2">
            <RotateCcw size={16} />
            <span>Đặt lại</span>
          </Button>
          <Button onClick={() => setIsSoundEnabled(!isSoundEnabled)} variant="secondary" size="sm" className="flex items-center space-x-2">
            {isSoundEnabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
            <span>{isSoundEnabled ? 'Tắt âm' : 'Bật âm'}</span>
          </Button>
        </div>
      </div>

      {showCelebration && (
        <div 
          className="fixed inset-0 flex items-center justify-center pointer-events-none bg-black/80"
          style={{ zIndex: 1000 }}
        >
          <div 
            className="text-center p-8 rounded-xl animate-pulse bg-card"
          >
            <div className="text-6xl mb-4">🎉</div>
            <h2 
              className="text-2xl font-bold mb-2 text-foreground"
            >
              Hoàn thành!
            </h2>
            <p className="text-lg text-muted-foreground">
              Bạn đã hoàn thành {tasbih.target} {tasbih.name}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Counter;


