// Export main component
export { default as Dua } from './Dua';
export { default as DuaSourceSelector } from './DuaSourceSelector';

// Export types
export type {
  DuaView,
  DuaSource,
  DuaDataViet,
  DuaCategoryViet,
  DuaTextViet,
  DuaSourceInfo,
  DuaSettings as DuaSettingsType,
  KetQuaTimKiem,
  DuaYeuThich,
  AudioPlayerState
} from './types';

// Export constants
export {
  VIETNAMESE_TEXT,
  DUA_SOURCES,
  DEFAULT_SETTINGS,
  STORAGE_KEYS,
  FONT_SIZE,
  AUDIO_SETTINGS,
  ANIMATION
} from './constants';

// Export hooks
export {
  useDuaData,
  useDuaPlayer,
  useDuaSettings,
  useDuaFavorites
} from './hooks';

// Export components
export {
  DuaHeader,
  DuaSettings,
  DuaNavigation,
  DuaSearch,
  DuaCategoriesView,
  DuaFavoritesView,
  DuaContentView,
  DuaBottomControls
} from './components';
