import React, { useState } from 'react';
import { Search, MapPin, Clock, Phone, Globe, Calendar, Users } from 'lucide-react';
import type { Mosque } from './mosque.types';
import mosqueData from './mosqueData';

// Mosque Card Component
const MosqueCard: React.FC<{ mosque: Mosque; onClick: () => void }> = ({ mosque, onClick }) => {
  return (
    <div 
      className="bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer overflow-hidden"
      onClick={onClick}
    >
      <div className="relative h-48 sm:h-56">
        <img 
          src={mosque.image || "/images/mosque-default.webp"} 
          alt={mosque.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute top-4 right-4 bg-white dark:bg-gray-800 px-2 py-1 rounded-full text-xs font-medium text-gray-700 dark:text-gray-300">
          {mosque.region}
        </div>
      </div>
      
      <div className="p-4 sm:p-6">
        <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mb-2">
          {mosque.name}
        </h3>
        
        <div className="flex items-start text-gray-600 dark:text-gray-400 mb-3">
          <MapPin className="w-4 h-4 mt-0.5 mr-2 flex-shrink-0" />
          <span className="text-sm">{mosque.address}, {mosque.city}</span>
        </div>
        
        <div className="flex items-center text-gray-600 dark:text-gray-400 mb-3">
          <Users className="w-4 h-4 mr-2" />
          <span className="text-sm">Capacity: {mosque.capacity?.toLocaleString()} people</span>
        </div>
        
        <div className="flex items-center text-gray-600 dark:text-gray-400 mb-4">
          <Calendar className="w-4 h-4 mr-2" />
          <span className="text-sm">Established: {mosque.foundedYear}</span>
        </div>
        
        <p className="text-gray-700 dark:text-gray-300 text-sm mb-4 line-clamp-2">
          {mosque.description}
        </p>
        
        <div className="flex flex-wrap gap-2">
          {mosque.facilities?.slice(0, 2).map((facility, index) => (
            <span 
              key={index}
              className="px-2 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 text-xs rounded-full"
            >
              {facility}
            </span>
          ))}
          {(mosque.facilities?.length ?? 0) > 2 && (
            <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 text-xs rounded-full">
              +{(mosque.facilities?.length ?? 0) - 2} more
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

// Mosque Detail Modal
const MosqueDetail: React.FC<{ mosque: Mosque; onClose: () => void }> = ({ mosque, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="relative h-64 sm:h-80">
          <img 
            src={mosque.image} 
            alt={mosque.name}
            className="w-full h-full object-cover rounded-t-xl"
          />
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 bg-white dark:bg-gray-800 rounded-full flex items-center justify-center text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            ×
          </button>
        </div>
        
        <div className="p-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            {mosque.name}
          </h2>
          
          <div className="space-y-4 mb-6">
            <div className="flex items-start text-gray-600 dark:text-gray-400">
              <MapPin className="w-5 h-5 mt-0.5 mr-3 flex-shrink-0" />
              <div>
                <p>{mosque.address}</p>
                <p>{mosque.city}, {mosque.region}</p>
              </div>
            </div>
            
            {mosque.phone && (
              <div className="flex items-center text-gray-600 dark:text-gray-400">
                <Phone className="w-5 h-5 mr-3" />
                <a href={`tel:${mosque.phone}`} className="hover:text-green-600 dark:hover:text-green-400">
                  {mosque.phone}
                </a>
              </div>
            )}
            
            {mosque.website && (
              <div className="flex items-center text-gray-600 dark:text-gray-400">
                <Globe className="w-5 h-5 mr-3" />
                <a 
                  href={mosque.website} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hover:text-green-600 dark:hover:text-green-400"
                >
                  Website
                </a>
              </div>
            )}
            
            <div className="flex items-center text-gray-600 dark:text-gray-400">
              <Users className="w-5 h-5 mr-3" />
              <span>Capacity: {mosque.capacity?.toLocaleString()} people</span>
            </div>
            
            <div className="flex items-center text-gray-600 dark:text-gray-400">
              <Calendar className="w-5 h-5 mr-3" />
              <span>Established: {mosque.foundedYear}</span>
            </div>
          </div>
          
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Description</h3>
            <p className="text-gray-700 dark:text-gray-300">{mosque.description}</p>
          </div>
          
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Prayer Times</h3>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
              {Object.entries(mosque.prayerTimes ?? {}).map(([prayer, time]) => (
                <div key={prayer} className="text-center p-3 bg-green-50 dark:bg-green-900 rounded-lg">
                  <div className="flex items-center justify-center mb-1">
                    <Clock className="w-4 h-4 mr-1" />
                  </div>
                  <div className="text-xs text-gray-600 dark:text-gray-400 capitalize">{prayer}</div>
                  <div className="font-bold text-green-700 dark:text-green-300">{time ?? '-'}</div>
                </div>
              ))}
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Facilities</h3>
            <div className="flex flex-wrap gap-2">
              {mosque.facilities?.map((facility, index) => (
                <span 
                  key={index}
                  className="px-3 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 text-sm rounded-full"
                >
                  {facility}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Main Component
const VietnamMosqueDirectory: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRegion, setSelectedRegion] = useState('All');
  const [selectedMosque, setSelectedMosque] = useState<Mosque | null>(null);

  const regions = ['All', 'Northern', 'Central', 'Southern'];

  const filteredMosques = mosqueData.filter(mosque => {
    const matchesSearch = mosque.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         mosque.city?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         mosque.address?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRegion = selectedRegion === 'All' || mosque.region === selectedRegion;
    return matchesSearch && matchesRegion;
  });

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <span>🕌 Masjid Vietnam 🇻🇳</span>
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                Directory of mosques across Vietnam
              </p>
              
              {/* Important notice */}
              <div className="mt-3 bg-yellow-50 dark:bg-yellow-900/20 border-l-4 border-yellow-400 dark:border-yellow-600 p-4 rounded-r">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-yellow-400 dark:text-yellow-300" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-yellow-700 dark:text-yellow-300">
                      <strong>Important note:</strong> Data is currently being collected and may not be accurate. Please contact the local Muslim community directly to verify information.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Filters */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search by name, city..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>
          
          <select
            value={selectedRegion}
            onChange={(e) => setSelectedRegion(e.target.value)}
            className="px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent"
          >
            {regions.map(region => (
              <option key={region} value={region}>{region}</option>
            ))}
          </select>
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-gray-600 dark:text-gray-400">
            Found {filteredMosques.length} mosques
          </p>
        </div>

        {/* Mosque Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMosques.map(mosque => (
            <MosqueCard
              key={mosque.id}
              mosque={mosque}
              onClick={() => setSelectedMosque(mosque)}
            />
          ))}
        </div>

        {filteredMosques.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 dark:text-gray-400 text-lg">
              No mosques found matching your search criteria.
            </p>
          </div>
        )}
      </div>

      {/* Modal */}
      {selectedMosque && (
        <MosqueDetail
          mosque={selectedMosque}
          onClose={() => setSelectedMosque(null)}
        />
      )}
    </div>
  );
};

// Export with Theme Provider
const VietnamMosqueApp: React.FC = () => {
  return (
      <VietnamMosqueDirectory />
  );
};

export default VietnamMosqueApp;