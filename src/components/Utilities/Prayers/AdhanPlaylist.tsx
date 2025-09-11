import { useState, useRef, useEffect } from 'react';
import { Play, Pause, SkipBack, SkipForward, ChevronRight  } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Lottie from "lottie-react";
import audioAnim from "@/assets/lottie/audio-animition.json";

interface AdhanReader {
  id: string;
  name: string;
  image: string;
  audio: string;
  description?: string;
}

const adhanReaders: AdhanReader[] = [
  {
    id: 'hamad-daghriry',
    name: 'Hamad Daghriry',
    image: '/images/adhan/hamad_daghriry.webp',
    audio: '/audio/adhan/hamad_daghriry.mp3',
    description: 'Imam tại Masjid al-Haram, Mecca'
  },
  {
    id: 'mansoor-az-zahrani',
    name: 'Mansoor Az-Zahrani',
    image: '/images/adhan/Mansoor-Az-Zahrani.webp',
    audio: '/audio/adhan/Mansoor-Az-Zahrani.mp3',
    description: 'Mu\'azzin nổi tiếng từ Saudi Arabia'
  },
  {
    id: 'mishary-alafasi',
    name: 'Mishary Alafasi',
    image: '/images/adhan/Mishary-Alafasi.webp',
    audio: '/audio/adhan/Mishary-Alafasi.mp3',
    description: 'Qari và Mu\'azzin từ Kuwait'
  },
  {
    id: 'nasser-alqatami',
    name: 'Nasser Alqatami',
    image: '/images/adhan/Nasser-Alqatami.webp',
    audio: '/audio/adhan/Nasser-Alqatami.mp3',
    description: 'Imam và Qari từ Saudi Arabia'
  }
  ,
  {
    id: 'Rabeh-Ibn-Darah-Al-Jazairi',
    name: 'Rabeh Ibn Darah Al Jazairi',
    image: '/images/adhan/Rabeh-Ibn-Darah-Al-Jazairi.webp',
    audio: '/audio/adhan/Rabeh-Ibn-Darah-Al-Jazairi.mp3',
  }
   ,
  {
    id: 'Ahmed-El-Kourdi',
    name: 'Ahmed El Kourdi',
    image: '/images/adhan/Ahmed-El-Kourdi.webp',
    audio: '/audio/adhan/Ahmed-El-Kourdi.mp3',
  }
];

export default function AdhanPlaylist() {
  const [currentPlaying, setCurrentPlaying] = useState<string | null>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [currentReaderIndex, setCurrentReaderIndex] = useState(0);
  const [isSeeking, setIsSeeking] = useState(false);
 const [showScrollIndicator, setShowScrollIndicator] = useState(true);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const checkScroll = () => {
      if (scrollContainerRef.current) {
        const { scrollWidth, clientWidth, scrollLeft } = scrollContainerRef.current;
        // Kiểm tra xem còn nội dung để cuộn không
        const hasMoreContent = scrollWidth > clientWidth;
        const isAtEnd = scrollLeft + clientWidth >= scrollWidth - 10; // 10px dung sai
        
        setShowScrollIndicator(hasMoreContent && !isAtEnd);
      }
    };

    // Kiểm tra khi component mount
    checkScroll();
    
    // Thêm event listener để kiểm tra khi cuộn
    const container = scrollContainerRef.current;
    if (container) {
      container.addEventListener('scroll', checkScroll);
      window.addEventListener('resize', checkScroll);
    }

    return () => {
      if (container) {
        container.removeEventListener('scroll', checkScroll);
      }
      window.removeEventListener('resize', checkScroll);
    };
  }, []);
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateTime = () => {
      if (!isSeeking) {
        setCurrentTime(audio.currentTime);
      }
    };
    const updateDuration = () => setDuration(audio.duration);
    const handleEnded = () => {
      setCurrentPlaying(null);
      setCurrentTime(0);
      setIsPlaying(false);
    };
    const handleLoadStart = () => setIsLoading(true);
    const handleCanPlay = () => setIsLoading(false);
    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);

    audio.addEventListener('timeupdate', updateTime);
    audio.addEventListener('loadedmetadata', updateDuration);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('loadstart', handleLoadStart);
    audio.addEventListener('canplay', handleCanPlay);
    audio.addEventListener('play', handlePlay);
    audio.addEventListener('pause', handlePause);

    return () => {
      audio.removeEventListener('timeupdate', updateTime);
      audio.removeEventListener('loadedmetadata', updateDuration);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('loadstart', handleLoadStart);
      audio.removeEventListener('canplay', handleCanPlay);
      audio.removeEventListener('play', handlePlay);
      audio.removeEventListener('pause', handlePause);
    };
  }, [isSeeking]);

  const playPause = (reader: AdhanReader, index: number) => {
    if (currentPlaying === reader.id && isPlaying) {
      // Pause current audio
      audioRef.current?.pause();
    } else {
      if (audioRef.current) {
        if (currentPlaying !== reader.id) {
          // New audio selected
          audioRef.current.src = reader.audio;
          setCurrentReaderIndex(index);
        }
        audioRef.current.play();
        setCurrentPlaying(reader.id);
      }
    }
  };

  const togglePlayPause = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
    }
  };

  const skipPrevious = () => {
    const prevIndex = currentReaderIndex > 0 ? currentReaderIndex - 1 : adhanReaders.length - 1;
    const prevReader = adhanReaders[prevIndex];
    setCurrentReaderIndex(prevIndex);
    if (audioRef.current) {
      audioRef.current.src = prevReader.audio;
      audioRef.current.play();
      setCurrentPlaying(prevReader.id);
    }
  };

  const skipNext = () => {
    const nextIndex = currentReaderIndex < adhanReaders.length - 1 ? currentReaderIndex + 1 : 0;
    const nextReader = adhanReaders[nextIndex];
    setCurrentReaderIndex(nextIndex);
    if (audioRef.current) {
      audioRef.current.src = nextReader.audio;
      audioRef.current.play();
      setCurrentPlaying(nextReader.id);
    }
  };

  const handleSeek = (value: number[]) => {
    if (audioRef.current) {
      const newTime = value[0];
      setCurrentTime(newTime);
      audioRef.current.currentTime = newTime;
    }
  };

  const handleSeekStart = () => {
    setIsSeeking(true);
  };

  const handleSeekEnd = () => {
    setIsSeeking(false);
  };

  const formatTime = (time: number) => {
    if (isNaN(time)) return "0:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const currentReader = adhanReaders[currentReaderIndex];

 return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Lottie 
            animationData={audioAnim} 
            loop={true} 
            autoplay={true} 
            className="w-7 h-7" 
          />
          Lắng nghe Adhan
        </CardTitle>
      </CardHeader>
      <CardContent>
        <audio ref={audioRef} />
        
        {/* Horizontal Scroll Reader Cards với chỉ báo cuộn */}
        <div className="mb-4 relative">
          <div 
            ref={scrollContainerRef}
            className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide"
          >
            {adhanReaders.map((reader, index) => (
              <div
                key={reader.id}
                className="flex-shrink-0 cursor-pointer group"
                onClick={() => playPause(reader, index)}
              >
                <div className="w-16 text-center">
                  {/* Avatar */}
                  <div className="relative w-16 h-16 rounded-full overflow-hidden shadow-sm mb-1 mx-auto border border-border">
                    <img
                      src={reader.image}
                      alt={reader.name}
                      className="w-full h-full object-cover transition-transform group-hover:scale-110"
                    />
                    
                    {/* Play Overlay - Sử dụng màu primary thay vì trắng */}
                    <div className={`absolute inset-0 bg-black/50 flex items-center justify-center transition-opacity ${
                      currentPlaying === reader.id && isPlaying ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
                    }`}>
                      <div className="bg-primary rounded-full p-1">
                        {isLoading && currentPlaying === reader.id ? (
                          <div className="w-3 h-3 border-2 border-background border-t-transparent rounded-full animate-spin" />
                        ) : currentPlaying === reader.id && isPlaying ? (
                          <Pause className="w-3 h-3 text-primary-foreground" />
                        ) : (
                          <Play className="w-3 h-3 text-primary-foreground ml-0.5" />
                        )}
                      </div>
                    </div>

                    {/* Active Ring - Sử dụng màu primary */}
                    {currentPlaying === reader.id && (
                      <div className="absolute inset-0 rounded-full border-2 border-primary" />
                    )}
                  </div>
                  
                  {/* Name */}
                  <p className={`text-xs truncate ${
                    currentPlaying === reader.id ? 'text-primary font-medium' : 'text-muted-foreground'
                  }`}>
                    {reader.name}
                  </p>
                </div>
              </div>
            ))}
          </div>
          
          {/* Chỉ báo cuộn với màu sắc nổi bật hơn */}
          {showScrollIndicator && (
            <div className="absolute right-0 top-0 bottom-0 flex items-center justify-end pointer-events-none">
              <div className="bg-gradient-to-l from-background via-background/90 to-transparent w-12 h-full flex items-center justify-end pr-1">
                <div className="bg-primary/20 rounded-full p-1.5">
                  <ChevronRight className="w-5 h-5 text-primary animate-pulse" />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Mini Player (only when an audio is selected) */}
        {currentPlaying && (
          <div className="bg-muted rounded-lg p-3">
            <div className="flex items-center gap-2 mb-3">
              <div className="relative w-8 h-8 rounded-full overflow-hidden border border-border">
                <img
                  src={currentReader.image}
                  alt={currentReader.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{currentReader.name}</p>
                {currentReader.description && (
                  <p className="text-xs text-muted-foreground truncate">{currentReader.description}</p>
                )}
              </div>
              <div className="flex items-center gap-1">
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={skipPrevious} 
                  className="h-8 w-8 text-muted-foreground hover:text-foreground"
                >
                  <SkipBack className="w-4 h-4" />
                </Button>
                <Button
                  variant="default" 
                  size="icon"
                  onClick={togglePlayPause}
                  className="h-9 w-9 bg-primary hover:bg-primary/90"
                >
                  {isLoading ? (
                    <div className="w-4 h-4 border-2 border-background border-t-transparent rounded-full animate-spin" />
                  ) : isPlaying ? (
                    <Pause className="w-4 h-4" />
                  ) : (
                    <Play className="w-4 h-4 ml-0.5" />
                  )}
                </Button>
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={skipNext} 
                  className="h-8 w-8 text-muted-foreground hover:text-foreground"
                >
                  <SkipForward className="w-4 h-4" />
                </Button>
              </div>
            </div>
            
            {/* Progress and Seek Bar */}
            <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
              <span>{formatTime(currentTime)}</span>
              <div className="flex-1">
                <Slider
                  value={[currentTime]}
                  max={duration}
                  step={0.1}
                  onValueChange={handleSeek}
                  onValueCommit={handleSeekEnd}
                  onPointerDown={handleSeekStart}
                  className="cursor-pointer"
                />
              </div>
              <span>{formatTime(duration)}</span>
            </div>
          </div>
        )}

        <style>{`
          .scrollbar-hide {
            -ms-overflow-style: none;
            scrollbar-width: none;
          }
          .scrollbar-hide::-webkit-scrollbar {
            display: none;
          }
        `}</style>
      </CardContent>
    </Card>
  );
}