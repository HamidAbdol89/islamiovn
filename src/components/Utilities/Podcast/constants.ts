import type { Scholar, ScholarCategory } from './types';

export const EPISODES_PER_PAGE = 10;

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
    name: "Qur'an Tafsir",
    scholarIds: ['nouman-ali-khan', 'abdul-nasir-jangda', 'taimiyyah-zubair']
  },
  {
    id: 'fiqh',
    name: "Islamic Jurisprudence",
    scholarIds: ['mufti-menk', 'yasir-qadhi', 'bilal-philips', 'muhammad-west']
  },
  {
    id: 'aqidah',
    name: "Theology & Creed",
    scholarIds: ['shady-alsuleiman', 'hamza-yusuf', 'omar-suleiman']
  },
  {
    id: 'tazkiyah',
    name: "Spirituality & Ethics",
    scholarIds: ['haifaa-younis', 'hasan-ali', 'muiz-bukhary']
  },
  {
    id: 'contemporary',
    name: "Contemporary Issues",
    scholarIds: ['moutasem-al-hameedy', 'ismail-kamdar', 'wahaj-tarin']
  },
  {
    id: 'inspiration',
    name: "Inspirational",
    scholarIds: ['mohamed-hoblos', 'abdulbary-yahya', 'zahir-mahmood']
  }
];

export const INITIAL_SCHOLARS: Scholar[] = [
  {
    id: 'mufti-menk',
    name: 'Mufti Menk',
    title: 'Grand Mufti of Zimbabwe',
    bio: 'Inspirational scholar known for ethical teachings and practical life advice.',
    avatar: '/images/podcast/mufti-menk.webp',
    color: 'bg-gradient-to-r from-emerald-500 to-teal-600',
    tags: ['fiqh'],
    episodes: [],
    isLoading: false
  },
  {
    id: 'nouman-ali-khan',
    name: 'Nouman Ali Khan',
    title: 'Qur\'anic Arabic Instructor',
    bio: 'Founder of Bayyinah Institute, specializing in easy-to-understand Qur\'an explanations.',
    avatar: '/images/podcast/nouman-ali-khan.webp',
    color: 'bg-gradient-to-r from-blue-500 to-indigo-600',
    tags: ['tafsir'],
    episodes: [],
    isLoading: false
  },
  {
    id: 'omar-suleiman',
    name: 'Omar Suleiman',
    title: 'Islamic Scholar & Activist',
    bio: 'Expert in theology and contemporary Muslim social issues.',
    avatar: '/images/podcast/omar-suleiman.webp',
    color: 'bg-gradient-to-r from-purple-500 to-pink-600',
    tags: ['contemporary'],
    episodes: [],
    isLoading: false
  },
  {
    id: 'yasir-qadhi',
    name: 'Yasir Qadhi',
    title: 'Islamic Theologian',
    bio: 'Expert in Aqidah & classical Islamic history, known for in-depth teachings.',
    avatar: '/images/podcast/yasir-qadhi.webp',
    color: 'bg-gradient-to-r from-orange-500 to-red-600',
    tags: ['fiqh'],
    episodes: [],
    isLoading: false
  },
  {
    id: 'bilal-philips',
    name: 'Bilal Philips',
    title: 'Dr. & International Professor',
    bio: 'Founder of Islamic Online University, specializing in Aqidah & Islamic education.',
    avatar: '/images/podcast/bilal-philips.webp',
    color: 'bg-gradient-to-r from-sky-500 to-cyan-600',
    tags: ['fiqh'],
    episodes: [],
    isLoading: false
  },
  {
    id: 'hamza-yusuf',
    name: 'Hamza Yusuf',
    title: 'Islamic Scholar & Philosopher',
    bio: 'Co-founder of Zaytuna College, known for profound thinking and philosophical analysis.',
    avatar: '/images/podcast/hamza-yusuf.webp',
    color: 'bg-gradient-to-r from-amber-500 to-yellow-600',
    tags: ['aqidah', 'tazkiyah'],
    episodes: [],
    isLoading: false
  },
  {
    id: 'abdul-nasir-jangda',
    name: 'Abdul Nasir Jangda',
    title: 'Director of Qalam Institute',
    bio: 'Specializes in Tafsir, Fiqh, and practical Islamic instructor training in the US.',
    avatar: '/images/podcast/abdul-nasir-jangda.webp',
    color: 'bg-gradient-to-r from-rose-500 to-fuchsia-600',
    tags: ['tafsir'],
    episodes: [],
    isLoading: false
  },
  {
    id: 'wahaj-tarin',
    name: 'Wahaj Tarin',
    title: 'Islamic Speaker & Educator',
    bio: 'Practical teachings with strong logic, inspiring Muslim youth.',
    avatar: '/images/podcast/wahaj-tarin.webp',
    color: 'bg-gradient-to-r from-gray-700 to-neutral-800',
    tags: ['contemporary'],
    episodes: [],
    isLoading: false
  },
  {
    id: 'mohamed-hoblos',
    name: 'Mohamed Hoblos',
    title: 'Inspirational Speaker',
    bio: 'Moving voice, emotional style, conveying deep Islamic messages.',
    avatar: '/images/podcast/mohamed-hoblos.webp',
    color: 'bg-gradient-to-r from-lime-500 to-green-700',
    tags: ['inspiration'],
    episodes: [],
    isLoading: false
  },
  {
    id: 'haifaa-younis',
    name: 'Haifaa Younis',
    title: 'Dr. & Islamic Lecturer',
    bio: 'Specializes in psychology, Tazkiyah & the role of modern Muslim women.',
    avatar: '/images/podcast/haifaa-younis.webp',
    color: 'bg-gradient-to-r from-pink-500 to-rose-600',
    tags: ['tazkiyah'],
    episodes: [],
    isLoading: false
  },
  {
    id: 'abdulbary-yahya',
    name: 'AbdulBary Yahya',
    title: 'Scholar & Speaker in USA',
    bio: 'Relatable, practical teachings attracting Western Muslim youth.',
    avatar: '/images/podcast/abdulbary-yahya.webp',
    color: 'bg-gradient-to-r from-blue-800 to-cyan-700',
    tags: ['inspiration'],
    episodes: [],
    isLoading: false
  },
  {
    id: 'zahir-mahmood',
    name: 'Zahir Mahmood',
    title: 'Historian & Islamic Thinker',
    bio: 'Heroic style, vivid storytelling about Sahaba history and the Ummah.',
    avatar: '/images/podcast/zahir-mahmood.webp',
    color: 'bg-gradient-to-r from-yellow-800 to-orange-600',
    tags: ['inspiration'],
    episodes: [],
    isLoading: false
  },
  {
    id: 'ismail-kamdar',
    name: 'Ismail Kamdar',
    title: 'Author & Lecturer from South Africa',
    bio: 'Specializes in applying Islam to time management and personal development.',
    avatar: '/images/podcast/ismail-kamdar.webp',
    color: 'bg-gradient-to-r from-indigo-600 to-purple-700',
    tags: ['contemporary'],
    episodes: [],
    isLoading: false
  },
  {
    id: 'taimiyyah-zubair',
    name: 'Taimiyyah Zubair',
    title: 'Qur\'an & Tafsir Instructor',
    bio: 'Academic style, meticulous, prominent among female Islamic scholars.',
    avatar: '/images/podcast/taimiyyah-zubair.webp',
    color: 'bg-gradient-to-r from-purple-500 to-violet-700',
    tags: ['tafsir', 'tazkiyah'],
    episodes: [],
    isLoading: false
  },
  {
    id: 'hasan-ali',
    name: 'Hasan Ali',
    title: 'Tazkiyah & Emotional Instructor',
    bio: 'Emotional, moving style helping reconnect with Allah from within.',
    avatar: '/images/podcast/hasan-ali.webp',
    color: 'bg-gradient-to-r from-red-600 to-rose-700',
    tags: ['tazkiyah'],
    episodes: [],
    isLoading: false
  },
  {
    id: 'shady-alsuleiman',
    name: 'Shady Alsuleiman',
    title: 'Aqidah & Seerah Scholar',
    bio: 'Strong style, clear thinking, specializing in the Prophet\'s life and correct beliefs.',
    avatar: '/images/podcast/shady-alsuleiman.webp',
    color: 'bg-gradient-to-r from-teal-700 to-emerald-700',
    tags: ['aqidah'],
    episodes: [],
    isLoading: false
  },
  {
    id: 'moutasem-al-hameedy',
    name: 'Moutasem Al-Hameedy',
    title: 'Speaker on Logic & Critical Thinking',
    bio: 'Logical, coherent style with intelligent critique based on Qur\'an & Sunnah.',
    avatar: '/images/podcast/moutasem-al-hameedy.webp',
    color: 'bg-gradient-to-r from-gray-800 to-slate-600',
    tags: ['contemporary'],
    episodes: [],
    isLoading: false
  },
  {
    id: 'muhammad-west',
    name: 'Muhammad West',
    title: 'Contemporary Fiqh Scholar',
    bio: 'Specializes in applied Fiqh topics, practical Hajj and Umrah series.',
    avatar: '/images/podcast/muhammad-west.webp',
    color: 'bg-gradient-to-r from-yellow-600 to-amber-700',
    tags: ['fiqh'],
    episodes: [],
    isLoading: false
  },
  {
    id: 'muiz-bukhary',
    name: 'Muiz Bukhary',
    title: 'Qur\'an & Hadith Instructor',
    bio: 'Warm voice, simple teaching style, accessible for new Muslims.',
    avatar: '/images/podcast/muiz-bukhary.webp',
    color: 'bg-gradient-to-r from-indigo-600 to-blue-700',
    tags: ['tazkiyah'],
    episodes: [],
    isLoading: false
  }
];
