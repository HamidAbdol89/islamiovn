export interface PodcastEpisode {
  id: string;
  title: string;
  description: string;
  audioUrl: string;
  duration: string;
  publishDate: string;
  thumbnail?: string;
  index?: number;
}

export interface Scholar {
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

export interface ScholarCategory {
  id: string;
  name: string;
  scholarIds: string[];
}

export interface AudioState {
  currentTime: number;
  duration: number;
  isPlaying: boolean;
}

export interface PodcastContextType {
  isDarkMode: boolean;
  setIsDarkMode: (value: boolean) => void;
  currentScholar: string | null;
  setCurrentScholar: (scholarId: string | null) => void;
  currentEpisode: PodcastEpisode | null;
  setCurrentEpisode: (episode: PodcastEpisode | null) => void;
  isPlaying: boolean;
  setIsPlaying: (playing: boolean) => void;
  scholars: Scholar[];
  setScholars: React.Dispatch<React.SetStateAction<Scholar[]>>;
  audioRef: HTMLAudioElement | null;
  currentTime: number;
  duration: number;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  currentPage: number;
  setCurrentPage: (page: number) => void;
}
