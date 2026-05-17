import type { Icon } from 'phosphor-react';

export type ToolId =
  | 'prayers'
  | 'qiblah'
  | 'calendar'
  | 'quranreader'
  | 'masjid'
  | 'tasbih'
  | 'dua'
  | 'hadith'
  | 'nameallah'
  | 'podcast'
  | 'study'
  | 'zakat';

export interface AppTool {
  id: ToolId;
  label: string;
  iconUrl: string;
  icon: Icon;
  route: string;
  isAvailable: boolean;
  description?: string;
  accentColor: string;
}
