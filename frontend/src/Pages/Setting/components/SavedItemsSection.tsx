import React, { useMemo, useCallback } from 'react';
import { Heart } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import SettingSection from './SettingSection';
import SettingItem from './SettingItem';
import { SECTION_TITLES, SETTING_LABELS } from './constants';
import type { SavedItemCounts, ViewType } from './types';

interface SavedItemBadgeProps {
  readonly count: number;
  readonly type: 'favorite' | 'bookmark';
}

const SavedItemBadge = React.memo<SavedItemBadgeProps>(({ count, type }) => {
  const badgeClassName = useMemo(() => 
    `text-white text-xs px-1.5 py-0.5 rounded-full ${
      type === 'favorite' ? 'bg-red-500' : 'bg-blue-500'
    }`,
    [type]
  );

  if (count === 0) return null;

  return (
    <span className={badgeClassName}>
      {count}
    </span>
  );
});

SavedItemBadge.displayName = 'SavedItemBadge';

interface SavedItemsSectionProps {
  readonly counts: SavedItemCounts;
  readonly onViewChange: (view: ViewType) => void;
}

const SavedItemsSection = React.memo<SavedItemsSectionProps>(({ counts, onViewChange }) => {
  const handleHadithClick = useCallback(() => {
    onViewChange('saved-hadiths');
  }, [onViewChange]);

  const handleQuranClick = useCallback(() => {
    onViewChange('saved-quran');
  }, [onViewChange]);

  const hadithBadges = useMemo(() => {
    const hasItems = counts.hadithFavorites > 0 || counts.hadithBookmarks > 0;
    if (!hasItems) return null;

    return (
      <div className="flex items-center gap-1">
        <SavedItemBadge count={counts.hadithFavorites} type="favorite" />
        <SavedItemBadge count={counts.hadithBookmarks} type="bookmark" />
      </div>
    );
  }, [counts.hadithFavorites, counts.hadithBookmarks]);

  const quranBadges = useMemo(() => {
    const hasItems = counts.quranFavorites > 0 || counts.quranBookmarks > 0;
    if (!hasItems) return null;

    return (
      <div className="flex items-center gap-1">
        <SavedItemBadge count={counts.quranFavorites} type="favorite" />
        <SavedItemBadge count={counts.quranBookmarks} type="bookmark" />
      </div>
    );
  }, [counts.quranFavorites, counts.quranBookmarks]);

  return (
    <SettingSection title={SECTION_TITLES.SAVED}>
      <SettingItem
        icon={Heart}
        label={SETTING_LABELS.SAVED_HADITH}
        onClick={handleHadithClick}
        rightContent={hadithBadges}
      />
      <Separator />
      <SettingItem
        icon={Heart}
        label={SETTING_LABELS.SAVED_QURAN}
        onClick={handleQuranClick}
        rightContent={quranBadges}
      />
    </SettingSection>
  );
});

SavedItemsSection.displayName = 'SavedItemsSection';

export default SavedItemsSection;
