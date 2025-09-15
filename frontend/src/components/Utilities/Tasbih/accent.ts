export type AccentKey = 'primary' | 'accent' | 'destructive';

const idToAccent: Record<number, AccentKey> = {
  1: 'accent',
  2: 'primary',
  3: 'destructive',
  4: 'accent',
  5: 'primary',
  6: 'accent',
};

export const getAccent = (id: number): AccentKey => idToAccent[id] ?? 'primary';

export const getAccentClasses = (id: number) => {
  const key = getAccent(id);
  return {
    text: `text-${key}`,
    bg: `bg-${key}`,
    border: `border-${key}`,
    progressIndicator: `[&>div]:bg-${key}`,
  } as const;
};


