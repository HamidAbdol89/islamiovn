import { toast } from '@/lib/toast';

export interface QuranReference {
  surah: number;
  verse: number;
  surahName: string;
  surahNameArabic: string;
  text: string;
  textArabic: string;
  translation: string;
  relevance: number;
}

export interface HadithReference {
  book: string;
  bookArabic: string;
  number: string;
  text: string;
  textArabic: string;
  translation: string;
  narrator: string;
  grade: string;
  relevance: number;
}

export interface IslamicConcept {
  name: string;
  nameArabic: string;
  definition: string;
  category: 'aqidah' | 'fiqh' | 'akhlaq' | 'seerah' | 'tafsir' | 'hadith' | 'dua' | 'general';
  relatedConcepts: string[];
  quranReferences: QuranReference[];
  hadithReferences: HadithReference[];
}

export interface IslamicContextAnalysis {
  primaryConcepts: IslamicConcept[];
  secondaryConcepts: IslamicConcept[];
  contextType: 'religious' | 'practical' | 'spiritual' | 'academic' | 'personal';
  urgencyLevel: 'high' | 'medium' | 'low';
  complexityLevel: 'beginner' | 'intermediate' | 'advanced';
  recommendedApproach: 'scholarly' | 'practical' | 'spiritual' | 'balanced';
  culturalContext: 'vietnamese' | 'arabic' | 'universal';
  suggestedReferences: {
    quran: QuranReference[];
    hadith: HadithReference[];
  };
}

export class IslamicContextEngine {
  private static instance: IslamicContextEngine;
  private islamicConcepts: Map<string, IslamicConcept> = new Map();
  private conceptKeywords: Map<string, string[]> = new Map();
  private initialized = false;

  private constructor() {}

  public static getInstance(): IslamicContextEngine {
    if (!IslamicContextEngine.instance) {
      IslamicContextEngine.instance = new IslamicContextEngine();
    }
    return IslamicContextEngine.instance;
  }

  public async initialize(): Promise<void> {
    if (this.initialized) return;

    try {
      console.log('🕌 Initializing Islamic Context Engine...');
      
      // Load Islamic concepts and keywords
      await this.loadIslamicConcepts();
      await this.loadConceptKeywords();
      
      this.initialized = true;
      console.log('✅ Islamic Context Engine initialized');
      
      toast.success('🕌 Islamic Knowledge Base loaded', {
        description: 'AI có thể trả lời câu hỏi Islamic chính xác hơn',
        duration: 3000
      });
    } catch (error) {
      console.error('❌ Failed to initialize Islamic Context Engine:', error);
      toast.error('⚠️ Không thể tải Islamic Knowledge Base', {
        description: 'Một số tính năng có thể bị hạn chế',
        duration: 5000
      });
    }
  }

  private async loadIslamicConcepts(): Promise<void> {
    // Core Islamic concepts with Vietnamese translations
    const coreIslamicConcepts: IslamicConcept[] = [
      {
        name: 'Salah',
        nameArabic: 'صلاة',
        definition: 'Cầu nguyện 5 lần trong ngày, là một trong 5 trụ cột của Islam',
        category: 'fiqh',
        relatedConcepts: ['wudu', 'qibla', 'takbir', 'rukun', 'sunnah'],
        quranReferences: [],
        hadithReferences: []
      },
      {
        name: 'Zakat',
        nameArabic: 'زكاة',
        definition: 'Nghĩa vụ từ thiện bắt buộc, là một trong 5 trụ cột của Islam',
        category: 'fiqh',
        relatedConcepts: ['nisab', 'hawl', 'sadaqah', 'charity'],
        quranReferences: [],
        hadithReferences: []
      },
      {
        name: 'Hajj',
        nameArabic: 'حج',
        definition: 'Hành hương đến Mecca, là một trong 5 trụ cột của Islam',
        category: 'fiqh',
        relatedConcepts: ['umrah', 'kaaba', 'tawaf', 'mecca', 'pilgrimage'],
        quranReferences: [],
        hadithReferences: []
      },
      {
        name: 'Sawm',
        nameArabic: 'صوم',
        definition: 'Nhịn ăn trong tháng Ramadan, là một trong 5 trụ cột của Islam',
        category: 'fiqh',
        relatedConcepts: ['ramadan', 'iftar', 'suhur', 'fasting', 'tarawih'],
        quranReferences: [],
        hadithReferences: []
      },
      {
        name: 'Shahada',
        nameArabic: 'شهادة',
        definition: 'Lời tuyên thệ đức tin, là một trong 5 trụ cột của Islam',
        category: 'aqidah',
        relatedConcepts: ['tawhid', 'muhammad', 'allah', 'faith', 'testimony'],
        quranReferences: [],
        hadithReferences: []
      },
      {
        name: 'Dua',
        nameArabic: 'دعاء',
        definition: 'Cầu nguyện cá nhân, giao tiếp trực tiếp với Allah',
        category: 'dua',
        relatedConcepts: ['prayer', 'supplication', 'dhikr', 'worship'],
        quranReferences: [],
        hadithReferences: []
      },
      {
        name: 'Quran',
        nameArabic: 'قرآن',
        definition: 'Kinh thánh của Islam, lời của Allah được tiết lộ qua Prophet Muhammad',
        category: 'tafsir',
        relatedConcepts: ['revelation', 'muhammad', 'surah', 'ayah', 'recitation'],
        quranReferences: [],
        hadithReferences: []
      },
      {
        name: 'Hadith',
        nameArabic: 'حديث',
        definition: 'Lời nói, hành động và sự chấp thuận của Prophet Muhammad',
        category: 'hadith',
        relatedConcepts: ['sunnah', 'muhammad', 'tradition', 'narration', 'sahih'],
        quranReferences: [],
        hadithReferences: []
      },
      {
        name: 'Jihad',
        nameArabic: 'جهاد',
        definition: 'Nỗ lực và đấu tranh trong đường lối của Allah, bao gồm jihad cá nhân (jihad nafs)',
        category: 'akhlaq',
        relatedConcepts: ['struggle', 'effort', 'nafs', 'spiritual', 'self-improvement'],
        quranReferences: [],
        hadithReferences: []
      },
      {
        name: 'Tawhid',
        nameArabic: 'توحيد',
        definition: 'Đức tin vào sự duy nhất của Allah, khái niệm cốt lõi của Islam',
        category: 'aqidah',
        relatedConcepts: ['monotheism', 'allah', 'unity', 'oneness', 'shirk'],
        quranReferences: [],
        hadithReferences: []
      }
    ];

    // Store concepts in map for quick lookup
    coreIslamicConcepts.forEach(concept => {
      this.islamicConcepts.set(concept.name.toLowerCase(), concept);
      this.islamicConcepts.set(concept.nameArabic, concept);
    });
  }

  private async loadConceptKeywords(): Promise<void> {
    // Vietnamese keywords mapping to Islamic concepts
    const vietnameseKeywords = new Map([
      ['cầu nguyện', ['salah', 'dua', 'prayer']],
      ['cầu nguyen', ['salah', 'dua', 'prayer']],
      ['làm lễ', ['salah', 'worship']],
      ['thờ phượng', ['worship', 'salah', 'dua']],
      ['từ thiện', ['zakat', 'sadaqah', 'charity']],
      ['tu thien', ['zakat', 'sadaqah', 'charity']],
      ['hành hương', ['hajj', 'umrah', 'pilgrimage']],
      ['hanh huong', ['hajj', 'umrah', 'pilgrimage']],
      ['nhịn ăn', ['sawm', 'fasting', 'ramadan']],
      ['nhin an', ['sawm', 'fasting', 'ramadan']],
      ['nhịn', ['fasting', 'sawm']],
      ['ramadan', ['ramadan', 'sawm', 'fasting']],
      ['kinh quran', ['quran', 'recitation']],
      ['kinh qur\'an', ['quran', 'recitation']],
      ['allah', ['allah', 'god', 'tawhid']],
      ['chúa', ['allah', 'god']],
      ['thần', ['allah', 'god', 'tawhid']],
      ['muhammad', ['muhammad', 'prophet', 'messenger']],
      ['tiên tri', ['muhammad', 'prophet']],
      ['tien tri', ['muhammad', 'prophet']],
      ['đức tin', ['faith', 'iman', 'shahada']],
      ['duc tin', ['faith', 'iman', 'shahada']],
      ['tin tưởng', ['faith', 'iman']],
      ['tin tuong', ['faith', 'iman']],
      ['hồi giáo', ['islam', 'muslim']],
      ['hoi giao', ['islam', 'muslim']],
      ['muslim', ['muslim', 'islam']],
      ['thánh địa', ['mecca', 'medina', 'kaaba']],
      ['thanh dia', ['mecca', 'medina', 'kaaba']],
      ['mecca', ['mecca', 'hajj', 'kaaba']],
      ['medina', ['medina', 'muhammad']],
      ['kaaba', ['kaaba', 'mecca', 'hajj', 'qibla']],
      ['hướng cầu nguyện', ['qibla', 'direction']],
      ['huong cau nguyen', ['qibla', 'direction']],
      ['thánh kinh', ['quran', 'holy book']],
      ['thanh kinh', ['quran', 'holy book']],
      ['hadith', ['hadith', 'tradition', 'sunnah']],
      ['truyền thống', ['hadith', 'sunnah', 'tradition']],
      ['truyen thong', ['hadith', 'sunnah', 'tradition']]
    ]);

    // Store keywords mapping
    vietnameseKeywords.forEach((concepts, keyword) => {
      this.conceptKeywords.set(keyword.toLowerCase(), concepts);
    });

    // Add English keywords
    const englishKeywords = new Map([
      ['prayer', ['salah', 'dua']],
      ['charity', ['zakat', 'sadaqah']],
      ['pilgrimage', ['hajj', 'umrah']],
      ['fasting', ['sawm', 'ramadan']],
      ['faith', ['iman', 'shahada']],
      ['god', ['allah', 'tawhid']],
      ['prophet', ['muhammad', 'messenger']],
      ['quran', ['quran', 'revelation']],
      ['hadith', ['hadith', 'sunnah']],
      ['islam', ['islam', 'muslim']],
      ['muslim', ['muslim', 'islam']]
    ]);

    englishKeywords.forEach((concepts, keyword) => {
      this.conceptKeywords.set(keyword.toLowerCase(), concepts);
    });
  }

  public analyzeQuestion(question: string): IslamicContextAnalysis {
    const lowerQuestion = question.toLowerCase();
    const words = lowerQuestion.split(/\s+/);
    
    // Use words for future analysis (currently analyzing by keywords)
    console.log(`Analyzing ${words.length} words in question`);
    
    const foundConcepts: IslamicConcept[] = [];
    const conceptRelevance: Map<string, number> = new Map();

    // Find Islamic concepts in the question
    this.conceptKeywords.forEach((concepts, keyword) => {
      if (lowerQuestion.includes(keyword)) {
        concepts.forEach(conceptName => {
          const concept = this.islamicConcepts.get(conceptName);
          if (concept && !foundConcepts.find(c => c.name === concept.name)) {
            foundConcepts.push(concept);
            
            // Calculate relevance based on keyword frequency and position
            const keywordCount = (lowerQuestion.match(new RegExp(keyword, 'g')) || []).length;
            const position = lowerQuestion.indexOf(keyword);
            const relevance = keywordCount * (position === 0 ? 2 : 1);
            
            conceptRelevance.set(concept.name, relevance);
          }
        });
      }
    });

    // Sort concepts by relevance
    foundConcepts.sort((a, b) => 
      (conceptRelevance.get(b.name) || 0) - (conceptRelevance.get(a.name) || 0)
    );

    // Determine context type
    let contextType: 'religious' | 'practical' | 'spiritual' | 'academic' | 'personal' = 'religious';
    if (lowerQuestion.includes('làm thế nào') || lowerQuestion.includes('how to')) {
      contextType = 'practical';
    } else if (lowerQuestion.includes('tại sao') || lowerQuestion.includes('why')) {
      contextType = 'academic';
    } else if (lowerQuestion.includes('cảm thấy') || lowerQuestion.includes('feel') || lowerQuestion.includes('tâm linh')) {
      contextType = 'spiritual';
    } else if (lowerQuestion.includes('tôi') || lowerQuestion.includes('mình') || lowerQuestion.includes('i ')) {
      contextType = 'personal';
    }

    // Determine urgency level
    let urgencyLevel: 'high' | 'medium' | 'low' = 'medium';
    if (lowerQuestion.includes('khẩn cấp') || lowerQuestion.includes('urgent') || lowerQuestion.includes('gấp')) {
      urgencyLevel = 'high';
    } else if (lowerQuestion.includes('tò mò') || lowerQuestion.includes('curious') || lowerQuestion.includes('muốn biết')) {
      urgencyLevel = 'low';
    }

    // Determine complexity level
    let complexityLevel: 'beginner' | 'intermediate' | 'advanced' = 'intermediate';
    if (lowerQuestion.includes('cơ bản') || lowerQuestion.includes('basic') || lowerQuestion.includes('mới bắt đầu')) {
      complexityLevel = 'beginner';
    } else if (lowerQuestion.includes('chi tiết') || lowerQuestion.includes('detailed') || lowerQuestion.includes('sâu')) {
      complexityLevel = 'advanced';
    }

    // Determine cultural context
    let culturalContext: 'vietnamese' | 'arabic' | 'universal' = 'vietnamese';
    if (lowerQuestion.includes('ả rập') || lowerQuestion.includes('arabic') || lowerQuestion.includes('عربي')) {
      culturalContext = 'arabic';
    } else if (lowerQuestion.includes('toàn cầu') || lowerQuestion.includes('universal') || lowerQuestion.includes('quốc tế')) {
      culturalContext = 'universal';
    }

    // Recommend approach
    let recommendedApproach: 'scholarly' | 'practical' | 'spiritual' | 'balanced' = 'balanced';
    if (contextType === 'academic') {
      recommendedApproach = 'scholarly';
    } else if (contextType === 'practical') {
      recommendedApproach = 'practical';
    } else if (contextType === 'spiritual') {
      recommendedApproach = 'spiritual';
    }

    return {
      primaryConcepts: foundConcepts.slice(0, 3),
      secondaryConcepts: foundConcepts.slice(3, 6),
      contextType,
      urgencyLevel,
      complexityLevel,
      recommendedApproach,
      culturalContext,
      suggestedReferences: {
        quran: [],
        hadith: []
      }
    };
  }

  public getConceptByName(name: string): IslamicConcept | undefined {
    return this.islamicConcepts.get(name.toLowerCase());
  }

  public getAllConcepts(): IslamicConcept[] {
    return Array.from(this.islamicConcepts.values());
  }

  public searchConcepts(query: string): IslamicConcept[] {
    const lowerQuery = query.toLowerCase();
    const results: IslamicConcept[] = [];

    this.islamicConcepts.forEach(concept => {
      if (
        concept.name.toLowerCase().includes(lowerQuery) ||
        concept.nameArabic.includes(lowerQuery) ||
        concept.definition.toLowerCase().includes(lowerQuery) ||
        concept.relatedConcepts.some(related => related.toLowerCase().includes(lowerQuery))
      ) {
        results.push(concept);
      }
    });

    return results;
  }
}

export default IslamicContextEngine;
