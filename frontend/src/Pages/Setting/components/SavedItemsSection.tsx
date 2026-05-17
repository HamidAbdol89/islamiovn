import React, { useCallback } from 'react';
import { BookOpen, Heart } from 'phosphor-react';
import SettingSection from './SettingSection';
import SettingItem from './SettingItem';
import { SECTION_TITLES, SETTING_LABELS } from './constants';
import type { SavedItemCounts, ViewType } from './types';

interface CountBadgesProps {
  favorites: number;
  bookmarks: number;
}

const CountBadges = React.memo<CountBadgesProps>(({ favorites, bookmarks }) => (
  <span className="flex items-center gap-1.5">
    {favorites > 0 && (
      <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-destructive/10 text-destructive">
        {favorites}
      </span>
    )}
    {bookmarks > 0 && (
      <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-primary/10 text-primary">
        {bookmarks}
      </span>
    )}
  </span>
));
CountBadges.displayName = 'CountBadges';

interface Props {
  counts: SavedItemCounts;
  onViewChange: (view: ViewType) => void;
}

const SavedItemsSection = React.memo<Props>(({ counts, onViewChange }) => {
  const goHadiths = useCallback(() => onViewChange('saved-hadiths'), [onViewChange]);
  const goQuran   = useCallback(() => onViewChange('saved-quran'),   [onViewChange]);

  return (
    <SettingSection title={SECTION_TITLES.SAVED} delay={0.15}>
      <SettingItem
        icon={Heart}
        label={SETTING_LABELS.SAVED_HADITH}
        iconVariant="red"
        onClick={goHadiths}
        rightContent={
          <CountBadges
            favorites={counts.hadithFavorites}
            bookmarks={counts.hadithBookmarks}
          />
        }
      />
      <SettingItem
        icon={BookOpen}
        label={SETTING_LABELS.SAVED_QURAN}
        iconVariant="amber"
        onClick={goQuran}
        rightContent={
          <CountBadges
            favorites={counts.quranFavorites}
            bookmarks={counts.quranBookmarks}
          />
        }
      />
    </SettingSection>
  );
});

SavedItemsSection.displayName = 'SavedItemsSection';
export default SavedItemsSection;
