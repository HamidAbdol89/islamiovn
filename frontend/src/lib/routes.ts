// lib/routes.ts - Quản lý routes tập trung
export const ROUTES = {
  HOME: '/',
  NEWS: '/news',
  VIDEO: '/video',
  SETTING: '/setting',
  CHAT: '/chat',
  UTILITIES: {
    PRAYERS: '/utilities/prayers',
    QIBLAH: '/utilities/qiblah',
    CALENDAR: '/utilities/calendar',
    QURAN_READER: '/utilities/quranreader',
    MASJID: '/utilities/masjid',
    TASBIH: '/utilities/tasbih',
    DUAS: '/utilities/dua',
    HADITH: '/utilities/hadith',
    NAMEALLAH: '/utilities/nameallah',
    PODCAST: '/utilities/podcast',
    STUDY: '/utilities/study',
    ZAKAT: '/utilities/zakat',
    MASJID_VIET_NAM: '/utilities/masjid-vietnam',
    AI: '/utilities/ai',
  }
};

export const TAB_ROUTES = {
  'home': ROUTES.HOME,
  'news': ROUTES.NEWS,
  'chat': ROUTES.CHAT,
  'video': ROUTES.VIDEO,
  'setting': ROUTES.SETTING,
};

export const UTILITY_ROUTES = {
  'quranreader': ROUTES.UTILITIES.QURAN_READER,
  'calendar': ROUTES.UTILITIES.CALENDAR,
  'prayers': ROUTES.UTILITIES.PRAYERS,
  'qiblah': ROUTES.UTILITIES.QIBLAH,
  'tasbih': ROUTES.UTILITIES.TASBIH,
  'nameallah': ROUTES.UTILITIES.NAMEALLAH,
  'masjid': ROUTES.UTILITIES.MASJID,
  'zakat': ROUTES.UTILITIES.ZAKAT,
  'dua': ROUTES.UTILITIES.DUAS,
  'podcast': ROUTES.UTILITIES.PODCAST,
  'hadith': ROUTES.UTILITIES.HADITH,
  'masjid-vietnam': ROUTES.UTILITIES.MASJID_VIET_NAM,
  'ai': ROUTES.UTILITIES.AI,
  'chat': ROUTES.CHAT,
};