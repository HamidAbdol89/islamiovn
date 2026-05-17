import {
  BookOpen,
  Buildings,
  Calculator,
  Calendar,
  Compass,
  Clock,
  Microphone,
  CirclesThreePlus,
  GraduationCap,
  Hash,
  Heart,
  Scroll,
} from 'phosphor-react';

import { ROUTES } from '@/lib/routes';

import prayerIcon from '@/assets/icon/prayer.png';
import compassIcon from '@/assets/icon/compass.png';
import bookIcon from '@/assets/icon/quran.png';
import buildingIcon from '@/assets/icon/building.png';
import tasbihIcon from '@/assets/icon/tasbih.png';
import doaIcon from '@/assets/icon/doa.png';
import hadihIcon from '@/assets/icon/hadih.png';
import nameIcon from '@/assets/icon/99.png';
import podcastIcon from '@/assets/icon/podcast.png';
import studyIcon from '@/assets/icon/study.png';
import zakatIcon from '@/assets/icon/zakat.png';
import scheduleIcon from '@/assets/icon/schedule.png';

import type { AppTool, ToolId } from './types';

export const APP_TOOLS: AppTool[] = [
  {
    id: 'prayers',
    label: 'Cầu Nguyện',
    iconUrl: prayerIcon,
    icon: Clock,
    route: ROUTES.UTILITIES.PRAYERS,
    isAvailable: true,
    description: 'Giờ cầu nguyện hàng ngày và lịch trình',
    accentColor: 'primary',
  },
  {
    id: 'qiblah',
    label: 'Qiblah',
    iconUrl: compassIcon,
    icon: Compass,
    route: ROUTES.UTILITIES.QIBLAH,
    isAvailable: true,
    description: 'Tìm hướng Qiblah để cầu nguyện',
    accentColor: 'purple',
  },
  {
    id: 'calendar',
    label: 'Lịch Hijri',
    iconUrl: scheduleIcon,
    icon: Calendar,
    route: ROUTES.UTILITIES.CALENDAR,
    isAvailable: true,
    description: 'Lịch Hijri và các sự kiện quan trọng',
    accentColor: 'orange',
  },
  {
    id: 'quranreader',
    label: "Kinh Qur'an",
    iconUrl: bookIcon,
    icon: BookOpen,
    route: ROUTES.UTILITIES.QURAN_READER,
    isAvailable: true,
    description: "Đọc và nghe Kinh Qur'an",
    accentColor: 'cyan',
  },
  {
    id: 'masjid',
    label: 'Masjid',
    iconUrl: buildingIcon,
    icon: Buildings,
    route: ROUTES.UTILITIES.MASJID,
    isAvailable: true,
    description: 'Tìm nhà thờ Hồi giáo gần bạn',
    accentColor: 'rose',
  },
  {
    id: 'tasbih',
    label: 'Tasbih',
    iconUrl: tasbihIcon,
    icon: CirclesThreePlus,
    route: ROUTES.UTILITIES.TASBIH,
    isAvailable: true,
    description: 'Đếm tràng hạt Tasbih kỹ thuật số',
    accentColor: 'yellow',
  },
  {
    id: 'dua',
    label: 'Dua',
    iconUrl: doaIcon,
    icon: Heart,
    route: ROUTES.UTILITIES.DUAS,
    isAvailable: true,
    description: 'Bộ sưu tập các lời cầu nguyện',
    accentColor: 'violet',
  },
  {
    id: 'hadith',
    label: 'Hadith',
    iconUrl: hadihIcon,
    icon: Scroll,
    route: ROUTES.UTILITIES.HADITH,
    isAvailable: true,
    description: 'Đọc và tìm hiểu Hadith',
    accentColor: 'blue',
  },
  {
    id: 'nameallah',
    label: '99 Tên Allah',
    iconUrl: nameIcon,
    icon: Hash,
    route: ROUTES.UTILITIES.NAMEALLAH,
    isAvailable: true,
    description: '99 tên đẹp nhất của Allah',
    accentColor: 'emerald',
  },
  {
    id: 'podcast',
    label: 'Podcast',
    iconUrl: podcastIcon,
    icon: Microphone,
    route: ROUTES.UTILITIES.PODCAST,
    isAvailable: true,
    description: 'Nghe podcast Hồi giáo',
    accentColor: 'sky',
  },
  {
    id: 'study',
    label: 'Học Tập',
    iconUrl: studyIcon,
    icon: GraduationCap,
    route: ROUTES.UTILITIES.STUDY,
    isAvailable: false,
    description: 'Tài liệu học tập Hồi giáo',
    accentColor: 'pink',
  },
  {
    id: 'zakat',
    label: 'Zakat',
    iconUrl: zakatIcon,
    icon: Calculator,
    route: ROUTES.UTILITIES.ZAKAT,
    isAvailable: true,
    description: 'Tính toán Zakat của bạn',
    accentColor: 'lime',
  },
];

export function getToolById(id: ToolId): AppTool | undefined {
  return APP_TOOLS.find((tool) => tool.id === id);
}

export function getToolRoute(id: ToolId): string | undefined {
  return getToolById(id)?.route;
}

export function isToolId(value: string): value is ToolId {
  return APP_TOOLS.some((tool) => tool.id === value);
}
