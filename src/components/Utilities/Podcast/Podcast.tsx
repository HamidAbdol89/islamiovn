import React, { useState, useEffect } from 'react';
import { Play, Pause, Calendar, Clock, RefreshCw, AlertCircle, ChevronLeft } from 'lucide-react';

interface PodcastEpisode {
  id: string;
  title: string;
  description: string;
  audioUrl: string;
  duration: string;
  publishDate: string;
  thumbnail?: string;
  index?: number;
}

interface Scholar {
  id: string;
  name: string;
  title: string;
  bio: string;
  avatar: string;
  color: string;
  episodes: PodcastEpisode[];
  isLoading?: boolean;
  error?: string;
  tags?: string[];
}

const IslamicPodcastApp: React.FC = () => {
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [currentScholar, setCurrentScholar] = useState<string | null>(null);
  const [currentEpisode, setCurrentEpisode] = useState<PodcastEpisode | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [scholars, setScholars] = useState<Scholar[]>([]);
  const [audioRef, setAudioRef] = useState<HTMLAudioElement | null>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const currentScholarData = scholars.find(s => s.id === currentScholar);
  const [currentPage, setCurrentPage] = useState(1);
  const [episodesPerPage] = useState(10);
  const getPaginatedEpisodes = (episodes: PodcastEpisode[] = []) => {
    const startIndex = (currentPage - 1) * episodesPerPage;
    const endIndex = startIndex + episodesPerPage;
    return episodes.slice(startIndex, endIndex);
  };
  const [searchTerm, setSearchTerm] = useState('');
  const featuredScholars = [
    'mufti-menk',           // Inspirational, ethical, globally popular
    'nouman-ali-khan',      // Modern Tafsir, easy to understand, extremely famous
    'omar-suleiman',        // Aqidah + modern society, very popular with youth
    'yasir-qadhi',          // Deep knowledge, history, Aqidah, very academic
    'hamza-yusuf'           // Philosophy, tazkiyah, famous in the West, deep thinking
  ];
  const handleBackToHome = () => {
    window.history.back();
  };

  const scholarCategories = [
    {
      id: 'tafsir',
      name: "Qur'an Tafsir",
      scholarIds: ['nouman-ali-khan', 'abdul-nasir-jangda', 'taimiyyah-zubair']
    },
    {
      id: 'fiqh',
      name: "Islamic Jurisprudence",
      scholarIds: ['mufti-menk', 'yasir-qadhi', 'bilal-philips', 'muhammad-west']
    },
    {
      id: 'aqidah',
      name: "Theology & Creed",
      scholarIds: ['shady-alsuleiman', 'hamza-yusuf', 'omar-suleiman']
    },
    {
      id: 'tazkiyah',
      name: "Spirituality & Ethics",
      scholarIds: ['haifaa-younis', 'hasan-ali', 'muiz-bukhary']
    },
    {
      id: 'contemporary',
      name: "Contemporary Issues",
      scholarIds: ['moutasem-al-hameedy', 'ismail-kamdar', 'wahaj-tarin']
    },
    {
      id: 'inspiration',
      name: "Inspirational",
      scholarIds: ['mohamed-hoblos', 'abdulbary-yahya', 'zahir-mahmood']
    }
  ];

  // Initialize audio element
  useEffect(() => {
    const audio = new Audio();
    
    const handleLoadedMetadata = () => setDuration(audio.duration);
    const handleTimeUpdate = () => setCurrentTime(audio.currentTime);
    const handleEnded = () => {
      setIsPlaying(false);
      playNextEpisode();
    };

    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('ended', handleEnded);
    
    setAudioRef(audio);

    return () => {
      audio.pause();
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('ended', handleEnded);
    };
  }, []);

  // Initialize scholars data
  useEffect(() => {
    const initialScholars: Scholar[] = [
      {
        id: 'mufti-menk',
        name: 'Mufti Menk',
        title: 'Grand Mufti of Zimbabwe',
        bio: 'Inspirational scholar known for ethical teachings and practical life advice.',
        avatar: '/images/podcast/mufti-menk.webp',
        color: 'bg-gradient-to-r from-emerald-500 to-teal-600',
        tags: ['fiqh'],
        episodes: [],
        isLoading: false
      },
      {
        id: 'nouman-ali-khan',
        name: 'Nouman Ali Khan',
        title: 'Qur\'anic Arabic Instructor',
        bio: 'Founder of Bayyinah Institute, specializing in easy-to-understand Qur\'an explanations.',
        avatar: '/images/podcast/nouman-ali-khan.webp',
        color: 'bg-gradient-to-r from-blue-500 to-indigo-600',
        tags: ['tafsir'],
        episodes: [],
        isLoading: false
      },
      {
        id: 'omar-suleiman',
        name: 'Omar Suleiman',
        title: 'Islamic Scholar & Activist',
        bio: 'Expert in theology and contemporary Muslim social issues.',
        avatar: '/images/podcast/omar-suleiman.webp',
        color: 'bg-gradient-to-r from-purple-500 to-pink-600',
        tags: ['contemporary'],
        episodes: [],
        isLoading: false
      },
      {
        id: 'yasir-qadhi',
        name: 'Yasir Qadhi',
        title: 'Islamic Theologian',
        bio: 'Expert in Aqidah & classical Islamic history, known for in-depth teachings.',
        avatar: '/images/podcast/yasir-qadhi.webp',
        color: 'bg-gradient-to-r from-orange-500 to-red-600',
        tags: ['fiqh'],
        episodes: [],
        isLoading: false
      },
      {
        id: 'bilal-philips',
        name: 'Bilal Philips',
        title: 'Dr. & International Professor',
        bio: 'Founder of Islamic Online University, specializing in Aqidah & Islamic education.',
        avatar: '/images/podcast/bilal-philips.webp',
        color: 'bg-gradient-to-r from-sky-500 to-cyan-600',
        tags: ['fiqh'],
        episodes: [],
        isLoading: false
      },
      {
        id: 'hamza-yusuf',
        name: 'Hamza Yusuf',
        title: 'Islamic Scholar & Philosopher',
        bio: 'Co-founder of Zaytuna College, known for profound thinking and philosophical analysis.',
        avatar: '/images/podcast/hamza-yusuf.webp',
        color: 'bg-gradient-to-r from-amber-500 to-yellow-600',
        tags: ['aqidah', 'tazkiyah'],
        episodes: [],
        isLoading: false
      },
      {
        id: 'abdul-nasir-jangda',
        name: 'Abdul Nasir Jangda',
        title: 'Director of Qalam Institute',
        bio: 'Specializes in Tafsir, Fiqh, and practical Islamic instructor training in the US.',
        avatar: '/images/podcast/abdul-nasir-jangda.webp',
        color: 'bg-gradient-to-r from-rose-500 to-fuchsia-600',
        tags: ['tafsir'],
        episodes: [],
        isLoading: false
      },
      {
        id: 'wahaj-tarin',
        name: 'Wahaj Tarin',
        title: 'Islamic Speaker & Educator',
        bio: 'Practical teachings with strong logic, inspiring Muslim youth.',
        avatar: '/images/podcast/wahaj-tarin.webp',
        color: 'bg-gradient-to-r from-gray-700 to-neutral-800',
        tags: ['contemporary'],
        episodes: [],
        isLoading: false
      },
      {
        id: 'mohamed-hoblos',
        name: 'Mohamed Hoblos',
        title: 'Inspirational Speaker',
        bio: 'Moving voice, emotional style, conveying deep Islamic messages.',
        avatar: '/images/podcast/mohamed-hoblos.webp',
        color: 'bg-gradient-to-r from-lime-500 to-green-700',
        tags: ['inspiration'],
        episodes: [],
        isLoading: false
      },
      {
        id: 'haifaa-younis',
        name: 'Haifaa Younis',
        title: 'Dr. & Islamic Lecturer',
        bio: 'Specializes in psychology, Tazkiyah & the role of modern Muslim women.',
        avatar: '/images/podcast/haifaa-younis.webp',
        color: 'bg-gradient-to-r from-pink-500 to-rose-600',
        tags: ['tazkiyah'],
        episodes: [],
        isLoading: false
      },
      {
        id: 'abdulbary-yahya',
        name: 'AbdulBary Yahya',
        title: 'Scholar & Speaker in USA',
        bio: 'Relatable, practical teachings attracting Western Muslim youth.',
        avatar: '/images/podcast/abdulbary-yahya.webp',
        color: 'bg-gradient-to-r from-blue-800 to-cyan-700',
        tags: ['inspiration'],
        episodes: [],
        isLoading: false
      },
      {
        id: 'zahir-mahmood',
        name: 'Zahir Mahmood',
        title: 'Historian & Islamic Thinker',
        bio: 'Heroic style, vivid storytelling about Sahaba history and the Ummah.',
        avatar: '/images/podcast/zahir-mahmood.webp',
        color: 'bg-gradient-to-r from-yellow-800 to-orange-600',
        tags: ['inspiration'],
        episodes: [],
        isLoading: false
      },
      {
        id: 'ismail-kamdar',
        name: 'Ismail Kamdar',
        title: 'Author & Lecturer from South Africa',
        bio: 'Specializes in applying Islam to time management and personal development.',
        avatar: '/images/podcast/ismail-kamdar.webp',
        color: 'bg-gradient-to-r from-indigo-600 to-purple-700',
        tags: ['contemporary'],
        episodes: [],
        isLoading: false
      },
      {
        id: 'taimiyyah-zubair',
        name: 'Taimiyyah Zubair',
        title: 'Qur\'an & Tafsir Instructor',
        bio: 'Academic style, meticulous, prominent among female Islamic scholars.',
        avatar: '/images/podcast/taimiyyah-zubair.webp',
        color: 'bg-gradient-to-r from-purple-500 to-violet-700',
        tags: ['tafsir', 'tazkiyah'],
        episodes: [],
        isLoading: false
      },
      {
        id: 'hasan-ali',
        name: 'Hasan Ali',
        title: 'Tazkiyah & Emotional Instructor',
        bio: 'Emotional, moving style helping reconnect with Allah from within.',
        avatar: '/images/podcast/hasan-ali.webp',
        color: 'bg-gradient-to-r from-red-600 to-rose-700',
        tags: ['tazkiyah'],
        episodes: [],
        isLoading: false
      },
      {
        id: 'shady-alsuleiman',
        name: 'Shady Alsuleiman',
        title: 'Aqidah & Seerah Scholar',
        bio: 'Strong style, clear thinking, specializing in the Prophet\'s life and correct beliefs.',
        avatar: '/images/podcast/shady-alsuleiman.webp',
        color: 'bg-gradient-to-r from-teal-700 to-emerald-700',
        tags: ['aqidah'],
        episodes: [],
        isLoading: false
      },
      {
        id: 'moutasem-al-hameedy',
        name: 'Moutasem Al-Hameedy',
        title: 'Speaker on Logic & Critical Thinking',
        bio: 'Logical, coherent style with intelligent critique based on Qur\'an & Sunnah.',
        avatar: '/images/podcast/moutasem-al-hameedy.webp',
        color: 'bg-gradient-to-r from-gray-800 to-slate-600',
        tags: ['contemporary'],
        episodes: [],
        isLoading: false
      },
      {
        id: 'muhammad-west',
        name: 'Muhammad West',
        title: 'Contemporary Fiqh Scholar',
        bio: 'Specializes in applied Fiqh topics, practical Hajj and Umrah series.',
        avatar: '/images/podcast/muhammad-west.webp',
        color: 'bg-gradient-to-r from-yellow-600 to-amber-700',
        tags: ['fiqh'],
        episodes: [],
        isLoading: false
      },
      {
        id: 'muiz-bukhary',
        name: 'Muiz Bukhary',
        title: 'Qur\'an & Hadith Instructor',
        bio: 'Warm voice, simple teaching style, accessible for new Muslims.',
        avatar: '/images/podcast/muiz-bukhary.webp',
        color: 'bg-gradient-to-r from-indigo-600 to-blue-700',
        tags: ['tazkiyah'],
        episodes: [],
        isLoading: false
      }
    ];

    setScholars(initialScholars);
  }, []);

  // Fetch RSS Feed with CORS proxy
  const fetchRSSFeed = async (scholarId: string): Promise<void> => {
    try {
      setScholars(prev => prev.map(s => 
        s.id === scholarId ? { ...s, isLoading: true, error: undefined } : s
      ));

      // Dynamic server URL - using environment variable or fallback
      const serverUrl = process.env.REACT_APP_API_URL || 
                       window.location.hostname === 'localhost' ? 
                       'http://localhost:3001' : 
                       'https://hamidverse-podcast.onrender.com';

      const response = await fetch(`${serverUrl}/api/rss/${scholarId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || 'Failed to fetch episodes');
      }

      const episodes = data.episodes || [];

      setScholars(prev => prev.map(s => 
        s.id === scholarId 
          ? { ...s, episodes, isLoading: false, error: undefined }
          : s
      ));

    } catch (error) {
      console.error('Error fetching RSS feed:', error);
      setScholars(prev => prev.map(s => 
        s.id === scholarId 
          ? { ...s, isLoading: false, error: 'Encountered an error. Please try again.' }
          : s
      ));
    }
  };

  // Retry fetching RSS feed
  const retryFetch = (scholarId: string) => {
    const scholar = scholars.find(s => s.id === scholarId);
    if (scholar) {
      fetchRSSFeed(scholarId);
    }
  };

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  const selectScholar = (scholarId: string) => {
    setCurrentScholar(scholarId);
    setCurrentEpisode(null);
    setCurrentPage(1);
      
    // Fetch RSS feed if episodes are empty
    const scholar = scholars.find(s => s.id === scholarId);
    if (scholar && scholar.episodes.length === 0 && !scholar.isLoading) {
      fetchRSSFeed(scholarId);
    }
  };

  const playEpisode = async (episode: PodcastEpisode) => {
    if (!audioRef) return;

    try {
      // Stop current audio before switching to new episode
      audioRef.pause();
      audioRef.currentTime = 0;
      
      setCurrentEpisode(episode);
      
      if (episode.audioUrl && episode.audioUrl !== '#') {
        audioRef.src = episode.audioUrl;
        audioRef.preload = 'auto';
        
        const playPromise = audioRef.play();
        
        if (playPromise !== undefined) {
          await playPromise
            .then(() => setIsPlaying(true))
            .catch(error => {
              console.error('Playback failed:', error);
              setIsPlaying(false);
            });
        }
      } else {
        // Fallback for demo
        setIsPlaying(true);
      }
    } catch (error) {
      console.error('Error playing episode:', error);
      setIsPlaying(false);
    }
  };

  // Initialize audio element
  useEffect(() => {
    const audio = new Audio();
    let isMounted = true;

    const handleLoadedMetadata = () => {
      if (isMounted) setDuration(audio.duration);
    };

    const handleTimeUpdate = () => {
      if (isMounted) setCurrentTime(audio.currentTime);
    };

    const handleEnded = () => {
      if (isMounted) {
        setIsPlaying(false);
        // Small timeout to ensure state updates
        setTimeout(() => playNextEpisode(), 100);
      }
    };

    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('ended', handleEnded);

    setAudioRef(audio);

    return () => {
      isMounted = false;
      audio.pause();
      audio.src = '';
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('ended', handleEnded);
    };
  }, []);

  const playNextEpisode = async () => {
    // Check conditions more carefully
    if (!currentScholar || !currentEpisode || !audioRef) return;

    const scholar = scholars.find(s => s.id === currentScholar);
    if (!scholar || scholar.episodes.length === 0) return;

    const currentIndex = currentEpisode.index ?? scholar.episodes.findIndex(ep => ep.id === currentEpisode.id);
    const nextIndex = currentIndex + 1;

    // Stop if reached end of list
    if (nextIndex >= scholar.episodes.length) {
      setIsPlaying(false);
      return;
    }

    const nextEpisode = scholar.episodes[nextIndex];
    
    try {
      // Update state before playing
      setCurrentEpisode({ ...nextEpisode, index: nextIndex });
      
      // Reset audio element
      audioRef.pause();
      audioRef.currentTime = 0;
      audioRef.src = nextEpisode.audioUrl;
      
      // Add preload to ensure audio is ready
      audioRef.preload = 'auto';
      audioRef.load();

      const playPromise = audioRef.play();

      if (playPromise !== undefined) {
        await playPromise
          .then(() => setIsPlaying(true))
          .catch(error => {
            console.error('Playback failed:', error);
            setIsPlaying(false);
          });
      }
    } catch (error) {
      console.error('Error playing next episode:', error);
      setIsPlaying(false);
    }
  };

  const forward = () => {
    if (audioRef) {
      audioRef.currentTime = Math.min(audioRef.currentTime + 10, audioRef.duration);
      setCurrentTime(audioRef.currentTime);
    }
  };

  const rewind = () => {
    if (audioRef) {
      audioRef.currentTime = Math.max(audioRef.currentTime - 10, 0);
      setCurrentTime(audioRef.currentTime);
    }
  };

  const togglePlayPause = () => {
    if (audioRef && currentEpisode?.audioUrl && currentEpisode.audioUrl !== '#') {
      if (isPlaying) {
        audioRef.pause();
        setIsPlaying(false);
      } else {
        audioRef.play().then(() => {
          setIsPlaying(true);
        }).catch((error) => {
          console.error('Error playing audio:', error);
        });
      }
    } else {
      // Demo toggle for episodes without real audio
      setIsPlaying(!isPlaying);
    }
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const goBack = () => {
    setCurrentScholar(null);
    setCurrentEpisode(null);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      isDarkMode 
        ? 'bg-gray-900 text-white' 
        : 'bg-gray-50 text-gray-900'
    }`}>
      {/* Header */}
      <div className={`sticky top-0 z-50 ${
        isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
      } border-b backdrop-blur-sm bg-opacity-95`}>
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center space-x-3">
            {/* Always visible Back button */}
            <button
              onClick={currentScholar ? goBack : handleBackToHome}
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            <h1 className="text-xl font-bold">
              {currentScholarData ? currentScholarData.name : 'Islamic Scholars Podcast'}
            </h1>
          </div>
          
          {/* Improved toggle button */}
          <label className="relative inline-flex items-center cursor-pointer">
            <input 
              type="checkbox" 
              className="sr-only peer" 
              checked={isDarkMode}
              onChange={toggleTheme}
              aria-label="Toggle dark/light mode"
            />
            <div className={`w-12 h-6 rounded-full peer ${
              isDarkMode 
                ? 'bg-indigo-600'  // Indigo color for dark mode
                : 'bg-gray-300'    // Light gray for light mode
            } transition-colors duration-300 peer-focus:ring-2 peer-focus:ring-indigo-300 peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all after:shadow-sm`}>
            
            </div>
          </label>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="pb-24">
        {!currentScholar ? (
          <div className="pb-24">
            {/* Header remains the same */}
            <div className="p-4">
              <div className="text-center py-8">
                <h2 className="text-2xl font-bold mb-2">Islamic Knowledge Audio</h2>
                <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Listen to inspiring lectures from leading Islamic scholars worldwide.
                </p>
              </div>

              {/* Search bar */}
              <div className="mb-6 sticky top-16 z-10 bg-opacity-95 backdrop-blur-sm">
                <input
                  type="text"
                  placeholder="Search scholars..."
                  className={`w-full p-3 rounded-lg ${
                    isDarkMode 
                      ? 'bg-gray-700 text-white placeholder-gray-400' 
                      : 'bg-gray-100 text-gray-900 placeholder-gray-500'
                  }`}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              {/* FEATURED SCHOLARS */}   
              {!searchTerm && (
                <div className="mb-6 px-4">
                  <h3 className="text-xl font-bold mb-4">Featured Scholars</h3>
                  
                  {/* Changed layout for mobile */}
                  <div className="flex space-x-4 overflow-x-auto pb-4 -mx-4 px-4 snap-x snap-mandatory no-scrollbar">
                    {scholars
                      .filter(scholar => featuredScholars.includes(scholar.id))
                      .map(scholar => (
                        <div
                          key={scholar.id}
                          onClick={() => selectScholar(scholar.id)}
                          className={`
                            flex-shrink-0 w-[80vw] sm:w-[280px] rounded-xl shadow-lg
                            transition-all duration-300 hover:shadow-xl snap-start
                            ${isDarkMode ? 'bg-gray-800' : 'bg-white'}
                          `}
                        >
                          {/* Mobile-friendly layout */}
                          <div className="relative p-4 flex items-center space-x-4 h-full">
                            {/* Light gradient background */}
                            <div 
                              className={`absolute inset-0 ${
                                scholar.color.replace('bg-gradient-to-r', 'bg-gradient-to-br')
                              } opacity-10 rounded-xl`}
                            ></div>
                            
                            {/* Larger avatar for mobile */}
                            <div className={`w-16 h-16 sm:w-20 sm:h-20 rounded-lg ${
                              scholar.color
                            } flex-shrink-0 overflow-hidden`}>
                              <img
                                src={scholar.avatar}
                                alt={scholar.name}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            
                            {/* Concise content */}
                            <div className="flex-1 min-w-0">
                              <h3 className="font-bold text-base line-clamp-1">{scholar.name}</h3>
                              <p className={`text-sm line-clamp-2 ${
                                isDarkMode ? 'text-gray-300' : 'text-gray-600'
                              }`}>
                                {scholar.title}
                              </p>
                              
                              {/* Simplified featured badge */}
                              <span className={`inline-block mt-1 px-2 py-0.5 text-xs rounded-full ${
                                isDarkMode ? 'bg-yellow-600 text-white' : 'bg-yellow-100 text-yellow-800'
                              }`}>
                                Featured
                              </span>
                            </div>
                          </div>
                        </div>
                      ))
                    }
                  </div>
                </div>
              )}
              
              {/* Display by category */}
              {scholarCategories.map((category) => {
                const categoryScholars = scholars.filter(scholar => 
                  category.scholarIds.includes(scholar.id) &&
                  (searchTerm === '' || 
                   scholar.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                   scholar.bio.toLowerCase().includes(searchTerm.toLowerCase()))
                );

                if (categoryScholars.length === 0) return null;

                return (
                  <div key={category.id} className="mb-8">
                    <h3 className="text-xl font-bold mb-4 px-4">{category.name}</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 px-4">
                      {categoryScholars.map((scholar) => (
                        <div
                          key={scholar.id}
                          onClick={() => selectScholar(scholar.id)}
                          className={`rounded-xl p-4 cursor-pointer transition-all duration-300 ${
                            isDarkMode 
                              ? 'bg-gray-800 hover:bg-gray-700' 
                              : 'bg-white hover:bg-gray-50'
                          } shadow-md hover:shadow-lg`}
                        >
                          <div className="flex items-center space-x-3">
                            <div className={`w-16 h-16 rounded-lg ${scholar.color} flex-shrink-0 overflow-hidden`}>
                              <img
                                src={scholar.avatar}
                                alt={scholar.name}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h3 className="font-semibold truncate">{scholar.name}</h3>
                              <p className={`text-sm truncate ${
                                isDarkMode ? 'text-gray-400' : 'text-gray-600'
                              }`}>
                                {scholar.title}
                              </p>
                              {/* Add tags if available */}
                              {scholar.tags && (
                                <div className="flex flex-wrap gap-1 mt-1">
                                  {scholar.tags.slice(0, 2).map(tag => (
                                    <span 
                                      key={tag} 
                                      className={`text-xs px-1.5 py-0.5 rounded-full ${
                                        isDarkMode ? 'bg-gray-700' : 'bg-gray-100'
                                      }`}
                                    >
                                      {tag}
                                    </span>
                                  ))}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}

              {/* Display when no results found */}
              {searchTerm && scholars.filter(scholar => 
                scholar.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                scholar.bio.toLowerCase().includes(searchTerm.toLowerCase())
              ).length === 0 && (
                <div className={`p-8 text-center rounded-xl ${
                  isDarkMode ? 'bg-gray-800' : 'bg-white'
                }`}>
                  <p className={isDarkMode ? 'text-gray-400' : 'text-gray-500'}>
                    No matching scholars found
                  </p>
                </div>
              )}
            </div>
          </div>
        ) : (
          // Episodes List
          <div className="p-4 space-y-4">
            {/* Scholar Info */}
            <div className={`rounded-xl p-6 ${
              isDarkMode ? 'bg-gray-800' : 'bg-white'
            } shadow-lg`}>
              <div className="flex items-center space-x-4 mb-4">
                {/* Changed from rounded-full to rounded-lg and increased size */}
                <div className={`w-24 h-24 rounded-lg ${currentScholarData?.color} flex items-center justify-center overflow-hidden`}>
                  <img
                    src={currentScholarData?.avatar}
                    alt={currentScholarData?.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h2 className="text-xl font-bold">{currentScholarData?.name}</h2>
                  <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    {currentScholarData?.title}
                  </p>
                </div>
              </div>
              <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                {currentScholarData?.bio}
              </p>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-4">
                  {/* Scholar avatar and info */}
                </div>
                <span className={`text-sm ${
                  isDarkMode ? 'text-gray-400' : 'text-gray-500'
                }`}>
                  {currentScholarData?.episodes.length} lectures
                </span>
              </div>
            </div>

            {/* Episodes */}
            <div className="space-y-3">
              {/* Loading State */}
              {currentScholarData?.isLoading && (
                <div className={`rounded-xl p-8 text-center ${
                  isDarkMode ? 'bg-gray-800' : 'bg-white'
                } shadow-lg`}>
                  <RefreshCw className="w-8 h-8 mx-auto mb-4 animate-spin text-blue-500" />
                  <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    Loading lecture list...
                  </p>
                </div>
              )}

              {/* Error State */}
              {currentScholarData?.error && (
                <div className={`rounded-xl p-6 text-center ${
                  isDarkMode ? 'bg-gray-800' : 'bg-white'
                } shadow-lg`}>
                  <AlertCircle className="w-8 h-8 mx-auto mb-4 text-red-500" />
                  <p className={`mb-4 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    {currentScholarData.error}
                  </p>
                  <button
                    onClick={() => retryFetch(currentScholarData.id)}
                    className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
                  >
                    Try Again
                  </button>
                </div>
              )}

              {/* Episodes List */}
              {!currentScholarData?.isLoading && !currentScholarData?.error && (
                <>
                  {/* Display when no episodes */}
                  {currentScholarData?.episodes.length === 0 ? (
                    <div className={`rounded-xl p-8 text-center ${
                      isDarkMode ? 'bg-gray-800' : 'bg-white'
                    } shadow-lg`}>
                      <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        No lectures available yet
                      </p>
                    </div>
                  ) : (
                    <>
                      {/* Display paginated episodes list */}
                      {getPaginatedEpisodes(currentScholarData?.episodes).map((episode) => (
                        <div
                          key={episode.id}
                          onClick={() => playEpisode(episode)}
                          className={`rounded-xl overflow-hidden ${
                            isDarkMode ? 'bg-gray-800 hover:bg-gray-750' : 'bg-white hover:bg-gray-50'
                          } shadow-md transition-all duration-200 hover:shadow-lg ${
                            currentEpisode?.id === episode.id ? 
                              (isDarkMode ? 'ring-2 ring-blue-400' : 'ring-2 ring-blue-500') : ''
                          }`}
                          style={{ cursor: 'pointer' }}
                        >
                          <div className="flex p-4">
                            {/* Thumbnail section */}
                            <div className="relative mr-4 flex-shrink-0">
                              {episode.thumbnail ? (
                                <div className="relative">
                                  <img 
                                    src={episode.thumbnail} 
                                    alt={episode.title}
                                    className="w-16 h-16 rounded-lg object-cover"
                                  />
                                  <div className={`absolute inset-0 flex items-center justify-center w-full h-full rounded-lg ${
                                    currentEpisode?.id === episode.id ? 'bg-black bg-opacity-30' : ''
                                  }`}>
                                    {currentEpisode?.id === episode.id && (
                                      isPlaying ? (
                                        <Pause className="w-6 h-6 text-white" />
                                      ) : (
                                        <Play className="w-6 h-6 text-white ml-1" />
                                      )
                                    )}
                                  </div>
                                </div>
                              ) : (
                                <div className={`w-16 h-16 rounded-lg flex items-center justify-center ${
                                  currentEpisode?.id === episode.id && isPlaying
                                    ? 'bg-red-500'
                                    : currentScholarData?.color.replace('bg-gradient-to-r', 'bg-gradient-to-br')
                                }`}>
                                  {currentEpisode?.id === episode.id && isPlaying ? (
                                    <Pause className="w-6 h-6 text-white" />
                                  ) : (
                                    <Play className="w-6 h-6 text-white ml-1" />
                                  )}
                                </div>
                              )}
                            </div>

                            {/* Content section */}
                            <div className="flex-1 min-w-0">
                              <h3 className="font-semibold text-sm md:text-base leading-tight mb-1 line-clamp-2">
                                {episode.title}
                              </h3>
                              <p className={`text-xs mb-3 line-clamp-2 ${
                                isDarkMode ? 'text-gray-400' : 'text-gray-600'
                              }`}>
                                {episode.description}
                              </p>
                              <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs">
                                <span className={`flex items-center space-x-1 ${
                                  isDarkMode ? 'text-gray-400' : 'text-gray-500'
                                }`}>
                                  <Calendar className="w-3 h-3 flex-shrink-0" />
                                  <span>{formatDate(episode.publishDate)}</span>
                                </span>
                                <span className={`flex items-center space-x-1 ${
                                  isDarkMode ? 'text-gray-400' : 'text-gray-500'
                                }`}>
                                  <Clock className="w-3 h-3 flex-shrink-0" />
                                  <span>{episode.duration}</span>
                                </span>
                                {currentEpisode?.id === episode.id && (
                                  <span className={`flex items-center space-x-1 ${
                                    isDarkMode ? 'text-blue-400' : 'text-blue-600'
                                  } font-medium`}>
                                    <span>•</span>
                                    <span>{isPlaying ? 'Playing' : 'Paused'}</span>
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}

                      {/* Pagination controls */}
                      {currentScholarData && currentScholarData.episodes.length > episodesPerPage && (
                        <div className={`flex justify-center items-center space-x-4 mt-6 ${
                          isDarkMode ? 'text-gray-300' : 'text-gray-600'
                        }`}>
                          <button
                            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                            disabled={currentPage === 1}
                            className={`p-2 rounded-full ${
                              currentPage === 1 
                                ? 'opacity-50 cursor-not-allowed' 
                                : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                            }`}
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                          </button>

                          <span className="text-sm">
                            Page {currentPage} of {Math.ceil(currentScholarData.episodes.length / episodesPerPage)}
                          </span>

                          <button
                            onClick={() => setCurrentPage(prev => 
                              prev < Math.ceil(currentScholarData.episodes.length / episodesPerPage) 
                                ? prev + 1 
                                : prev
                            )}
                            disabled={currentPage >= Math.ceil(currentScholarData.episodes.length / episodesPerPage)}
                            className={`p-2 rounded-full ${
                              currentPage >= Math.ceil(currentScholarData.episodes.length / episodesPerPage)
                                ? 'opacity-50 cursor-not-allowed' 
                                : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                            }`}
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                          </button>
                        </div>
                      )}
                    </>
                  )}
                </>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Mini Player */}
      {currentEpisode && (
        <div className={`fixed bottom-0 left-0 right-0 ${
          isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
        } border-t backdrop-blur-sm bg-opacity-95`}>
          <div className="p-4">
            <div className="flex items-center space-x-3">
              {/* Rewind button */}
              <button
                onClick={rewind}
                className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                aria-label="Rewind 10 seconds"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12.066 11.2a1 1 0 000 1.6l5.334 4A1 1 0 0019 16V8a1 1 0 00-1.6-.8l-5.333 4zM4.066 11.2a1 1 0 000 1.6l5.334 4A1 1 0 0011 16V8a1 1 0 00-1.6-.8l-5.334 4z" />
                </svg>
              </button>

              {/* Main play/pause button */}
              <button
                onClick={togglePlayPause}
                className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  currentScholarData?.color.replace('bg-gradient-to-r', 'bg-gradient-to-br')
                }`}
              >
                {isPlaying ? (
                  <Pause className="w-4 h-4 text-white" />
                ) : (
                  <Play className="w-4 h-4 text-white ml-0.5" />
                )}
              </button>

              {/* Forward button */}
              <button
                onClick={forward}
                className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                aria-label="Forward 10 seconds"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.933 12.8a1 1 0 000-1.6L6.6 7.2A1 1 0 005 8v8a1 1 0 001.6.8l5.333-4zM19.933 12.8a1 1 0 000-1.6l-5.333-4A1 1 0 0013 8v8a1 1 0 001.6.8l5.333-4z" />
                </svg>
              </button>

              {/* Episode info */}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">Now Playing: {currentEpisode.title}</p>
                <p className={`text-xs truncate ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  {currentScholarData?.name}
                </p>
              </div>
            </div>

            {/* Progress bar */}
            <div className={`mt-2 w-full h-1 rounded-full ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'}`}>
              <div 
                className="h-full bg-gradient-to-r from-blue-500 to-purple-600 rounded-full transition-all duration-300"
                style={{ width: duration > 0 ? `${(currentTime / duration) * 100}%` : '0%' }}
              ></div>
            </div>
            
            {duration > 0 && (
              <div className="flex justify-between text-xs mt-1">
                <span className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>
                  {formatTime(currentTime)}
                </span>
                <span className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>
                  {formatTime(duration)}
                </span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default IslamicPodcastApp;