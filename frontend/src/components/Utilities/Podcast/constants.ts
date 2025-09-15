import type { Scholar, ScholarCategory } from './types';

export const EPISODES_PER_PAGE = 10;

// RSS feed URLs mapping for scholars
export const FEED_URLS: Record<string, string> = {
  'mufti-menk': 'https://feeds.acast.com/public/shows/669f8f9582b4e4eb3d88ad2e',
  'nouman-ali-khan': 'https://rss.muslimcentral.com/nouman-ali-khan.rss',
  'omar-suleiman': 'https://rss.muslimcentral.com/omar-suleiman.rss',
  'yasir-qadhi': 'https://rss.muslimcentral.com/yasir-qadhi.rss',
  'bilal-philips': 'https://muslimcentral.com/audio/bilal-philips/feed/',
  'hamza-yusuf': 'https://muslimcentral.com/audio/hamza-yusuf/feed/',
  'abdul-nasir-jangda': 'https://muslimcentral.com/audio/abdul-nasir-jangda/feed/',
  'wahaj-tarin': 'https://muslimcentral.com/audio/wahaj-tarin/feed/',
  'mohamed-hoblos': 'https://muslimcentral.com/audio/muhammad-hoblos/feed/',
  'haifaa-younis': 'https://rss.muslimcentral.com/haifaa-younis.rss',
  'abdulbary-yahya': 'https://rss.muslimcentral.com/abdulbary-yahya.rss',
  'zahir-mahmood': 'https://rss.muslimcentral.com/zahir-mahmood.rss',
  'taimiyyah-zubair': 'https://rss.muslimcentral.com/taimiyyah-zubair.rss',
  'hasan-ali': 'https://rss.muslimcentral.com/hasan-ali.rss',
  'shady-alsuleiman': 'https://rss.muslimcentral.com/shady-alsuleiman.rss',
  'moutasem-al-hameedy': 'https://rss.muslimcentral.com/moutasem-al-hameedy.rss',
  'muhammad-west': 'https://rss.muslimcentral.com/muhammad-west.rss',
  'muiz-bukhary': 'https://rss.muslimcentral.com/muiz-bukhary.rss',
};

export const FEATURED_SCHOLARS = [
  'mufti-menk',           // Inspirational, ethical, globally popular
  'nouman-ali-khan',      // Modern Tafsir, easy to understand, extremely famous
  'omar-suleiman',        // Aqidah + modern society, very popular with youth
  'yasir-qadhi',          // Deep knowledge, history, Aqidah, very academic
  'hamza-yusuf'           // Philosophy, tazkiyah, famous in the West, deep thinking
];

export const SCHOLAR_CATEGORIES: ScholarCategory[] = [
  {
    id: 'tafsir',
    name: "Giải Thích Qur'an",
    scholarIds: ['nouman-ali-khan', 'abdul-nasir-jangda', 'taimiyyah-zubair']
  },
  {
    id: 'fiqh',
    name: "Luật Học Islam",
    scholarIds: ['mufti-menk', 'yasir-qadhi', 'bilal-philips', 'muhammad-west']
  },
  {
    id: 'aqidah',
    name: "Thần Học & Tín Ngưỡng",
    scholarIds: ['shady-alsuleiman', 'hamza-yusuf', 'omar-suleiman']
  },
  {
    id: 'tazkiyah',
    name: "Tâm Linh & Đạo Đức",
    scholarIds: ['haifaa-younis', 'hasan-ali', 'muiz-bukhary']
  },
  {
    id: 'contemporary',
    name: "Vấn Đề Đương Đại",
    scholarIds: ['moutasem-al-hameedy', 'ismail-kamdar', 'wahaj-tarin']
  },
  {
    id: 'inspiration',
    name: "Truyền Cảm Hứng",
    scholarIds: ['mohamed-hoblos', 'abdulbary-yahya', 'zahir-mahmood']
  }
];

export const INITIAL_SCHOLARS: Scholar[] = [
  {
    id: 'mufti-menk',
    name: 'Mufti Menk',
    title: 'Đại Mufti của Zimbabwe',
    bio: 'Học giả truyền cảm hứng nổi tiếng với những lời dạy về đạo đức và lời khuyên thực tế trong cuộc sống.',
    avatar: '/images/podcast/mufti-menk.webp',
    color: 'bg-gradient-to-r from-emerald-500 to-teal-600',
    tags: ['fiqh'],
    episodes: [],
    isLoading: false
  },
  {
    id: 'nouman-ali-khan',
    name: 'Nouman Ali Khan',
    title: 'Giảng Viên Tiếng Ả Rập Qur\'an',
    bio: 'Người sáng lập Viện Bayyinah, chuyên về việc giải thích Qur\'an dễ hiểu.',
    avatar: '/images/podcast/nouman-ali-khan.webp',
    color: 'bg-gradient-to-r from-blue-500 to-indigo-600',
    tags: ['tafsir'],
    episodes: [],
    isLoading: false
  },
  {
    id: 'omar-suleiman',
    name: 'Omar Suleiman',
    title: 'Học Giả Islam & Nhà Hoạt Động',
    bio: 'Chuyên gia về thần học và các vấn đề xã hội đương đại của người Muslim.',
    avatar: '/images/podcast/omar-suleiman.webp',
    color: 'bg-gradient-to-r from-purple-500 to-pink-600',
    tags: ['contemporary'],
    episodes: [],
    isLoading: false
  },
  {
    id: 'yasir-qadhi',
    name: 'Yasir Qadhi',
    title: 'Nhà Thần Học Islam',
    bio: 'Chuyên gia về Aqidah và lịch sử Islam cổ điển, nổi tiếng với những bài giảng sâu sắc.',
    avatar: '/images/podcast/yasir-qadhi.webp',
    color: 'bg-gradient-to-r from-orange-500 to-red-600',
    tags: ['fiqh'],
    episodes: [],
    isLoading: false
  },
  {
    id: 'bilal-philips',
    name: 'Bilal Philips',
    title: 'Tiến Sĩ & Giáo Sư Quốc Tế',
    bio: 'Người sáng lập Đại học Islam Trực tuyến, chuyên về Aqidah và giáo dục Islam.',
    avatar: '/images/podcast/bilal-philips.webp',
    color: 'bg-gradient-to-r from-sky-500 to-cyan-600',
    tags: ['fiqh'],
    episodes: [],
    isLoading: false
  },
  {
    id: 'hamza-yusuf',
    name: 'Hamza Yusuf',
    title: 'Học Giả Islam & Triết Gia',
    bio: 'Đồng sáng lập Trường Đại học Zaytuna, nổi tiếng với tư duy sâu sắc và phân tích triết học.',
    avatar: '/images/podcast/hamza-yusuf.webp',
    color: 'bg-gradient-to-r from-amber-500 to-yellow-600',
    tags: ['aqidah', 'tazkiyah'],
    episodes: [],
    isLoading: false
  },
  {
    id: 'abdul-nasir-jangda',
    name: 'Abdul Nasir Jangda',
    title: 'Giám Đốc Viện Qalam',
    bio: 'Chuyên về Tafsir, Fiqh và đào tạo giảng viên Islam thực tế tại Mỹ.',
    avatar: '/images/podcast/abdul-nasir-jangda.webp',
    color: 'bg-gradient-to-r from-rose-500 to-fuchsia-600',
    tags: ['tafsir'],
    episodes: [],
    isLoading: false
  },
  {
    id: 'wahaj-tarin',
    name: 'Wahaj Tarin',
    title: 'Diễn Giả & Nhà Giáo Dục Islam',
    bio: 'Giảng dạy thực tế với logic mạnh mẽ, truyền cảm hứng cho thanh niên Muslim.',
    avatar: '/images/podcast/wahaj-tarin.webp',
    color: 'bg-gradient-to-r from-gray-700 to-neutral-800',
    tags: ['contemporary'],
    episodes: [],
    isLoading: false
  },
  {
    id: 'mohamed-hoblos',
    name: 'Mohamed Hoblos',
    title: 'Diễn Giả Truyền Cảm Hứng',
    bio: 'Giọng nói cảm động, phong cách đầy cảm xúc, truyền tải thông điệp Islam sâu sắc.',
    avatar: '/images/podcast/mohamed-hoblos.webp',
    color: 'bg-gradient-to-r from-lime-500 to-green-700',
    tags: ['inspiration'],
    episodes: [],
    isLoading: false
  },
  {
    id: 'haifaa-younis',
    name: 'Haifaa Younis',
    title: 'Tiến Sĩ & Giảng Viên Islam',
    bio: 'Chuyên về tâm lý học, Tazkiyah và vai trò của phụ nữ Muslim hiện đại.',
    avatar: '/images/podcast/haifaa-younis.webp',
    color: 'bg-gradient-to-r from-pink-500 to-rose-600',
    tags: ['tazkiyah'],
    episodes: [],
    isLoading: false
  },
  {
    id: 'abdulbary-yahya',
    name: 'AbdulBary Yahya',
    title: 'Học Giả & Diễn Giả tại Mỹ',
    bio: 'Giảng dạy dễ hiểu, thực tế, thu hút thanh niên Muslim phương Tây.',
    avatar: '/images/podcast/abdulbary-yahya.webp',
    color: 'bg-gradient-to-r from-blue-800 to-cyan-700',
    tags: ['inspiration'],
    episodes: [],
    isLoading: false
  },
  {
    id: 'zahir-mahmood',
    name: 'Zahir Mahmood',
    title: 'Sử Gia & Nhà Tư Tưởng Islam',
    bio: 'Phong cách hùng hồn, kể chuyện sinh động về lịch sử Sahaba và Ummah.',
    avatar: '/images/podcast/zahir-mahmood.webp',
    color: 'bg-gradient-to-r from-yellow-800 to-orange-600',
    tags: ['inspiration'],
    episodes: [],
    isLoading: false
  },
  {
    id: 'ismail-kamdar',
    name: 'Ismail Kamdar',
    title: 'Tác Giả & Giảng Viên từ Nam Phi',
    bio: 'Chuyên về việc áp dụng Islam vào quản lý thời gian và phát triển cá nhân.',
    avatar: '/images/podcast/ismail-kamdar.webp',
    color: 'bg-gradient-to-r from-indigo-600 to-purple-700',
    tags: ['contemporary'],
    episodes: [],
    isLoading: false
  },
  {
    id: 'taimiyyah-zubair',
    name: 'Taimiyyah Zubair',
    title: 'Giảng Viên Qur\'an & Tafsir',
    bio: 'Phong cách học thuật, tỉ mỉ, nổi bật trong số các học giả Islam nữ.',
    avatar: '/images/podcast/taimiyyah-zubair.webp',
    color: 'bg-gradient-to-r from-purple-500 to-violet-700',
    tags: ['tafsir', 'tazkiyah'],
    episodes: [],
    isLoading: false
  },
  {
    id: 'hasan-ali',
    name: 'Hasan Ali',
    title: 'Giảng Viên Tazkiyah & Cảm Xúc',
    bio: 'Phong cách đầy cảm xúc, cảm động, giúp kết nối lại với Allah từ bên trong.',
    avatar: '/images/podcast/hasan-ali.webp',
    color: 'bg-gradient-to-r from-red-600 to-rose-700',
    tags: ['tazkiyah'],
    episodes: [],
    isLoading: false
  },
  {
    id: 'shady-alsuleiman',
    name: 'Shady Alsuleiman',
    title: 'Học Giả Aqidah & Seerah',
    bio: 'Phong cách mạnh mẽ, tư duy rõ ràng, chuyên về cuộc đời Tiên tri và tín ngưỡng đúng đắn.',
    avatar: '/images/podcast/shady-alsuleiman.webp',
    color: 'bg-gradient-to-r from-teal-700 to-emerald-700',
    tags: ['aqidah'],
    episodes: [],
    isLoading: false
  },
  {
    id: 'moutasem-al-hameedy',
    name: 'Moutasem Al-Hameedy',
    title: 'Diễn Giả về Logic & Tư Duy Phản Biện',
    bio: 'Phong cách logic, mạch lạc với phê phán thông minh dựa trên Qur\'an & Sunnah.',
    avatar: '/images/podcast/moutasem-al-hameedy.webp',
    color: 'bg-gradient-to-r from-gray-800 to-slate-600',
    tags: ['contemporary'],
    episodes: [],
    isLoading: false
  },
  {
    id: 'muhammad-west',
    name: 'Muhammad West',
    title: 'Học Giả Fiqh Đương Đại',
    bio: 'Chuyên về các chủ đề Fiqh ứng dụng, chuỗi bài thực tế về Hajj và Umrah.',
    avatar: '/images/podcast/muhammad-west.webp',
    color: 'bg-gradient-to-r from-yellow-600 to-amber-700',
    tags: ['fiqh'],
    episodes: [],
    isLoading: false
  },
  {
    id: 'muiz-bukhary',
    name: 'Muiz Bukhary',
    title: 'Giảng Viên Qur\'an & Hadith',
    bio: 'Giọng nói ấm áp, phong cách giảng dạy đơn giản, dễ tiếp cận cho Muslim mới.',
    avatar: '/images/podcast/muiz-bukhary.webp',
    color: 'bg-gradient-to-r from-indigo-600 to-blue-700',
    tags: ['tazkiyah'],
    episodes: [],
    isLoading: false
  }
];
