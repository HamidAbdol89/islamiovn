// TajweedVerse.tsx
import React, { useMemo } from 'react';
import './globals.css';

interface TajweedRule {
  rule: 'hamzat_wasl' | 'lam_shamsiyyah' | 'madd_2' | 'madd_246' | 'madd_6' | 'ghunnah' | 'ikhfa' | 'idgham' | 'iqlab' | 'qalqalah' | 'waqf' | 'sakt';
  start: number;
  end: number;
}

interface TajweedVerseProps {
  verse: string;
  tajweedRules?: TajweedRule[];
  className?: string;
}

const TajweedVerse: React.FC<TajweedVerseProps> = React.memo(({ 
  verse, 
  tajweedRules = [], 
  className = '' 
}) => {
  // Memoized tajweed processing
  const processedVerse = useMemo(() => {
    if (!tajweedRules.length) {
      return <span className={`font-arabic ${className}`}>{verse}</span>;
    }

    // Sort rules by start position
    const sortedRules = [...tajweedRules].sort((a, b) => a.start - b.start);
    const segments: React.ReactNode[] = [];
    let lastIndex = 0;

    sortedRules.forEach((rule, index) => {
      // Add text before this rule
      if (rule.start > lastIndex) {
        segments.push(
          <span key={`text-${index}`}>
            {verse.substring(lastIndex, rule.start)}
          </span>
        );
      }

      // Add the tajweed-highlighted text
      const ruleText = verse.substring(rule.start, rule.end + 1);
      segments.push(
        <span 
          key={`tajweed-${index}`} 
          className={`tajweed-${rule.rule}`}
          title={getTajweedTitle(rule.rule)}
        >
          {ruleText}
        </span>
      );

      lastIndex = rule.end + 1;
    });

    // Add remaining text
    if (lastIndex < verse.length) {
      segments.push(
        <span key="text-end">
          {verse.substring(lastIndex)}
        </span>
      );
    }

    return (
      <span className={`font-arabic ${className}`}>
        {segments}
      </span>
    );
  }, [verse, tajweedRules, className]);

  return <>{processedVerse}</>;
});

// Helper function to get tajweed rule descriptions in Vietnamese
const getTajweedTitle = (rule: TajweedRule['rule']): string => {
  const titles: Record<TajweedRule['rule'], string> = {
    hamzat_wasl: 'Hamzat Wasl - Hamzah nối',
    lam_shamsiyyah: 'Lam Shamsiyyah - Lam mặt trời',
    madd_2: 'Madd - Kéo dài 2 harakat',
    madd_246: 'Madd - Kéo dài 2-4-6 harakat',
    madd_6: 'Madd - Kéo dài 6 harakat',
    ghunnah: 'Ghunnah - Âm mũi (2 harakat)',
    ikhfa: 'Ikhfa - Đọc âm ẩn',
    idgham: 'Idgham - Đọc hòa âm',
    iqlab: 'Iqlab - Đọc chuyển âm',
    qalqalah: 'Qalqalah - Đọc rung động',
    waqf: 'Waqf - Dấu dừng',
    sakt: 'Sakt - Dừng ngắn'
  };
  return titles[rule] || rule;
};

TajweedVerse.displayName = 'TajweedVerse';

export default TajweedVerse;
export type { TajweedRule, TajweedVerseProps };
