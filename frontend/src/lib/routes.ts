// lib/routes.ts - Quản lý routes tập trung
export const ROUTES = {
  HOME: '/',
  NEWS: '/tin-tuc',
  VIDEO: '/video',
  SETTING: '/cai-dat',
  CHAT: '/chat',
  UTILITIES: {
    PRAYERS: '/cau-nguyen',
    QIBLAH: '/qiblah',
    CALENDAR: '/lich-hoi-giao',
    QURAN_READER: '/quran',
    MASJID: '/masjid',
    TASBIH: '/tasbih',
    DUAS: '/dua',
    HADITH: '/hadith',
    NAMEALLAH: '/ten-allah',
    PODCAST: '/podcast',
    STUDY: '/study',
    ZAKAT: '/zakat',
    MASJID_VIET_NAM: '/masjid/viet-nam',
    AI: '/ai',
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
