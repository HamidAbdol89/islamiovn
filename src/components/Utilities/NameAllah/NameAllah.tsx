import React, { useState, useEffect } from 'react';
import { Moon, Sun, Search, X } from 'lucide-react';
import nameAllahData from '@/assets/NameAllah.json';
import BackButton from "@/components/ui/BackButton"; 

// Types
interface AsmaName {
  number: number;
  arabic: string;
  transliteration: string;
  english: string;
}

interface AsmaData {
  title: string;
  description: string;
  names: AsmaName[];
}





// Theme Context
const ThemeContext = React.createContext<{
  isDark: boolean;
  toggleTheme: () => void;
}>({
  isDark: false,
  toggleTheme: () => {}
});

// Theme Provider
const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isDark, setIsDark] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('theme');
      if (saved) return saved === 'dark';
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });

  useEffect(() => {
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
    document.documentElement.classList.toggle('dark', isDark);
  }, [isDark]);

  const toggleTheme = () => setIsDark(!isDark);

  return (
    <ThemeContext.Provider value={{ isDark, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

// Search Component
const SearchBar: React.FC<{
  searchTerm: string;
  onSearchChange: (term: string) => void;
}> = ({ searchTerm, onSearchChange }) => {
  return (
    <div className="relative mb-6">
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
      <input
        type="text"
        placeholder="Search name Allah..."
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
        className="w-full pl-10 pr-10 py-3 rounded-lg border border-gray-300 dark:border-gray-600 
                   bg-white dark:bg-gray-800 text-gray-900 dark:text-white
                   focus:ring-2 focus:ring-blue-500 focus:border-transparent
                   placeholder-gray-500 dark:placeholder-gray-400"
      />
      {searchTerm && (
        <button
          onClick={() => onSearchChange('')}
          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
        >
          <X className="w-5 h-5" />
        </button>
      )}
    </div>
  );
};

// Name Card Component
const NameCard: React.FC<{ name: AsmaName }> = ({ name }) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg 
                    transition-all duration-300 p-4 sm:p-6 border border-gray-200 dark:border-gray-700
                    hover:scale-105 cursor-pointer group">
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 
                        rounded-full bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 
                        text-sm sm:text-base font-bold mb-3">
          {name.number}
        </div>
        
        <div className="text-2xl sm:text-3xl lg:text-4xl font-arabic text-green-600 dark:text-green-400 
                        mb-2 group-hover:text-green-700 dark:group-hover:text-green-300 transition-colors">
          {name.arabic}
        </div>
        
        <div className="text-sm sm:text-base font-medium text-gray-700 dark:text-gray-300 mb-1">
          {name.transliteration}
        </div>
        
        <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 font-medium">
          {name.english}
        </div>
      </div>
    </div>
  );
};

// Main Component
const AsmaUlHusnaComponent: React.FC = () => {
  const { isDark, toggleTheme } = React.useContext(ThemeContext);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [data, setData] = useState<AsmaData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

 useEffect(() => {
  setData(nameAllahData as AsmaData);
  setLoading(false);
}, []);

  // Filter names based on search
  const filteredNames = data?.names.filter(name => 
    name.arabic.includes(searchTerm) ||
    name.transliteration.toLowerCase().includes(searchTerm.toLowerCase()) ||
    name.english.toLowerCase().includes(searchTerm.toLowerCase()) ||
    name.number.toString().includes(searchTerm)
  ) || [];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <p className="text-red-500">Unable to load data</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
     <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
    <BackButton />
    
    <div className="flex-1 mx-4">
      <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white mb-1">
        {data.title}
      </h1>
      <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
        {data.description}
      </p>
    </div>

    <button
      onClick={toggleTheme}
    className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-opacity-80 transition-all"
      aria-label={isDark ? 'Chuyển sang chế độ sáng' : 'Chuyển sang chế độ tối'}
    >
      {isDark ? (
        <Sun className="w-5 h-5 text-yellow-500" />
      ) : (
        <Moon className="w-5 h-5 text-gray-600" />
      )}
    </button>
  </div>
</header>


      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <SearchBar searchTerm={searchTerm} onSearchChange={setSearchTerm} />
        
        {/* Results count */}
        <div className="mb-6">
          <p className="text-sm text-gray-600 dark:text-gray-400">
           Show {filteredNames.length} / {data.names.length} names
          </p>
        </div>

        {/* Names Grid */}
        {filteredNames.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
            {filteredNames.map(name => (
              <NameCard key={name.number} name={name} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-gray-400 dark:text-gray-500 mb-4">
              <Search className="w-12 h-12 mx-auto" />
            </div>
            <p className="text-gray-600 dark:text-gray-400">
              Không tìm thấy kết quả cho "{searchTerm}"
            </p>
          </div>
        )}
      </main>
    </div>
  );
};

// App Component with Theme Provider
const App: React.FC = () => {
  return (
    <ThemeProvider>
      <AsmaUlHusnaComponent />
    </ThemeProvider>
  );
};

export default App;