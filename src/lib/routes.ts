// lib/routes.ts - Quản lý routes tập trung
export const ROUTES = {
  HOME: '/',
  NEWS: '/news',
  AI: '/ai',
  VIDEO: '/video',
  SETTING: '/setting',
  CHAT: '/chat',
  UTILITIES: {
    PRAYERS: '/utilities/prayers',
    QIBLAH: '/utilities/qiblah',
    CALENDAR: '/utilities/calendar',
    QURAN: '/utilities/quran',
    MASJID: '/utilities/masjid',
    TASBIH: '/utilities/tasbih',
    DUAS: '/utilities/dua',
    HADITH: '/utilities/hadith',
    NAMEALLAH: '/utilities/nameallah',
    PODCAST: '/utilities/podcast',
    STUDY: '/utilities/study',
    ZAKAT: '/utilities/zakat',
  }
};

export const TAB_ROUTES = {
  'home': ROUTES.HOME,
  'news': ROUTES.NEWS,
  'ai': ROUTES.AI,
  'video': ROUTES.VIDEO,
  'setting': ROUTES.SETTING,
};

export const UTILITY_ROUTES = {
  'quran': ROUTES.UTILITIES.QURAN,
  'calendar': ROUTES.UTILITIES.CALENDAR,
  'prayers': ROUTES.UTILITIES.PRAYERS,
  'qiblah': ROUTES.UTILITIES.QIBLAH,
  'tasbih': ROUTES.UTILITIES.TASBIH,
  'nameallah': ROUTES.UTILITIES.NAMEALLAH,
  'masjid': ROUTES.UTILITIES.MASJID,
  'zakat': ROUTES.UTILITIES.ZAKAT,
  'dua': ROUTES.UTILITIES.DUAS,
  'podcast': ROUTES.UTILITIES.PODCAST,
};