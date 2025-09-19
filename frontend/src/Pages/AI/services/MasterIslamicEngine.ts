// Master Islamic Engine - Frontend Integration
// Advanced Islamic Knowledge Processing

export interface MasterIslamicAnalysis {
  questionType: 'aqidah' | 'fiqh' | 'akhlaq' | 'quran' | 'hadith' | 'general';
  madhab: 'shafii' | 'hanafi' | 'maliki' | 'hanbali' | 'comparative';
  complexityLevel: 'beginner' | 'intermediate' | 'advanced' | 'scholar';
  scholarConsultationNeeded: boolean;
  vietnameseContext: boolean;
  confidence: number;
  sources: {
    quran: string[];
    hadith: string[];
    scholars: string[];
  };
}

export interface MasterIslamicResponse {
  response: string;
  analysis: MasterIslamicAnalysis;
  madhab_opinions?: {
    shafii?: string;
    hanafi?: string;
    maliki?: string;
    hanbali?: string;
  };
  scholarly_references: {
    classical: string[];
    contemporary: string[];
    vietnamese: string[];
  };
  practical_guidance: string[];
  warnings?: string[];
}

export class MasterIslamicEngine {
  private static instance: MasterIslamicEngine;
  
  // Islamic Knowledge Categories
  private islamicCategories = {
    aqidah: {
      name: 'Aqidah (Tín ngưỡng)',
      description: 'Các vấn đề về đức tin, tawhid, và tín ngưỡng cơ bản',
      keywords: ['allah', 'tawhid', 'shirk', 'iman', 'kufr', 'tín ngưỡng', 'đức tin'],
      requiresHighAccuracy: true
    },
    fiqh: {
      name: 'Fiqh (Luật học Islam)',
      description: 'Các vấn đề về luật học, halal-haram, và thực hành tôn giáo',
      keywords: ['halal', 'haram', 'wudu', 'salah', 'zakat', 'hajj', 'nikah', 'talaq'],
      madhab_relevant: true
    },
    akhlaq: {
      name: 'Akhlaq (Đạo đức)',
      description: 'Các vấn đề về đạo đức, hành vi, và quan hệ xã hội',
      keywords: ['akhlaq', 'đạo đức', 'tính cách', 'hành vi', 'quan hệ', 'gia đình'],
      cultural_adaptation: true
    },
    quran: {
      name: 'Quran & Tafsir',
      description: 'Các vấn đề về Quran, tafsir, và hiểu biết kinh thánh',
      keywords: ['quran', 'ayah', 'surah', 'tafsir', 'nuzul', 'kinh thánh'],
      requires_arabic: true
    },
    hadith: {
      name: 'Hadith & Sunnah',
      description: 'Các vấn đề về hadith, sunnah, và truyền thống Tiên tri',
      keywords: ['hadith', 'sunnah', 'prophet', 'tiên tri', 'muhammad', 'sahih'],
      authenticity_critical: true
    }
  };

  // Vietnamese Islamic Context
  private vietnameseContext = {
    legal_framework: {
      status: 'Tôn giáo được công nhận tại Việt Nam',
      rights: ['Tự do thờ cúng', 'Giáo dục tôn giáo', 'Tổ chức cộng đồng'],
      responsibilities: ['Tuân thủ pháp luật', 'Hòa hợp xã hội', 'Đoàn kết dân tộc']
    },
    cultural_considerations: {
      majority_religion: 'Phật giáo',
      interfaith_harmony: 'Quan trọng trong xã hội đa tôn giáo',
      local_customs: 'Cần cân nhắc phong tục địa phương',
      family_values: 'Trọng gia đình và hiếu thảo'
    },
    practical_challenges: [
      'Tìm thức ăn halal',
      'Thời gian cầu nguyện trong công việc',
      'Giáo dục Islam cho con em',
      'Hòa nhập cộng đồng địa phương'
    ]
  };

  public static getInstance(): MasterIslamicEngine {
    if (!MasterIslamicEngine.instance) {
      MasterIslamicEngine.instance = new MasterIslamicEngine();
    }
    return MasterIslamicEngine.instance;
  }

  // Analyze question for Islamic context
  public analyzeQuestion(question: string): MasterIslamicAnalysis {
    const lowerQuestion = question.toLowerCase();
    
    // Detect question type
    const questionType = this.detectQuestionType(lowerQuestion);
    
    // Assess complexity
    const complexityLevel = this.assessComplexity(lowerQuestion, questionType);
    
    // Check if scholar consultation needed
    const scholarConsultationNeeded = this.requiresScholarConsultation(lowerQuestion);
    
    // Determine madhab relevance (Shafi'i primary in Vietnam)
    const madhab = questionType === 'fiqh' ? 'shafii' : 'comparative';
    
    // Calculate confidence
    const confidence = this.calculateConfidence(lowerQuestion, questionType);
    
    return {
      questionType,
      madhab,
      complexityLevel,
      scholarConsultationNeeded,
      vietnameseContext: true,
      confidence,
      sources: this.identifyRelevantSources(questionType)
    };
  }

  private detectQuestionType(question: string): MasterIslamicAnalysis['questionType'] {
    for (const [type, category] of Object.entries(this.islamicCategories)) {
      if (category.keywords.some(keyword => question.includes(keyword))) {
        return type as MasterIslamicAnalysis['questionType'];
      }
    }
    return 'general';
  }

  private assessComplexity(question: string, type: string): MasterIslamicAnalysis['complexityLevel'] {
    const complexKeywords = ['madhab', 'ijma', 'qiyas', 'ijtihad', 'usul', 'khilaf'];
    const beginnerKeywords = ['cơ bản', 'đơn giản', 'bắt đầu', 'học', 'hiểu'];
    
    // Advanced complexity for certain question types
    if (type === 'aqidah' || type === 'fiqh') {
      if (complexKeywords.some(keyword => question.includes(keyword))) {
        return 'advanced';
      }
    }
    
    // Scholar level for very complex topics
    if (type === 'fiqh' && question.includes('khilaf')) {
      return 'scholar';
    }
    
    if (complexKeywords.some(keyword => question.includes(keyword))) {
      return 'advanced';
    }
    
    if (beginnerKeywords.some(keyword => question.includes(keyword))) {
      return 'beginner';
    }
    
    // Default complexity based on question type
    if (type === 'aqidah') return 'intermediate';
    if (type === 'fiqh') return 'intermediate';
    if (type === 'quran' || type === 'hadith') return 'intermediate';
    
    return 'beginner';
  }

  private requiresScholarConsultation(question: string): boolean {
    const complexTopics = [
      'ly hôn', 'talaq', 'thừa kế', 'mirath', 'hợp đồng', 'kinh doanh',
      'y tế', 'phẫu thuật', 'hiến tạng', 'tranh chấp', 'tài sản'
    ];
    
    return complexTopics.some(topic => question.includes(topic));
  }

  private calculateConfidence(question: string, type: string): number {
    const category = this.islamicCategories[type as keyof typeof this.islamicCategories];
    if (!category) return 0.5;
    
    const matchedKeywords = category.keywords.filter(keyword => 
      question.includes(keyword)
    ).length;
    
    return Math.min(0.9, 0.3 + (matchedKeywords * 0.15));
  }

  private identifyRelevantSources(type: string) {
    const baseSources = {
      quran: ['Al-Quran'],
      hadith: ['Sahih Bukhari', 'Sahih Muslim'],
      scholars: ['Ibn Kathir', 'Al-Tabari']
    };

    switch (type) {
      case 'aqidah':
        return {
          ...baseSources,
          scholars: [...baseSources.scholars, 'Al-Ash\'ari', 'Al-Maturidi']
        };
      case 'fiqh':
        return {
          ...baseSources,
          scholars: [...baseSources.scholars, 'Al-Shafi\'i', 'Al-Nawawi']
        };
      case 'quran':
        return {
          ...baseSources,
          scholars: [...baseSources.scholars, 'Al-Qurtubi', 'Al-Baghawi']
        };
      default:
        return baseSources;
    }
  }

  // Generate enhanced prompt for backend
  public generateEnhancedPrompt(question: string, analysis: MasterIslamicAnalysis): string {
    return `
🎓 PHÂN TÍCH CHUYÊN MÔN:
- Loại câu hỏi: ${analysis.questionType}
- Madhab ưu tiên: ${analysis.madhab} (chính tại Việt Nam)
- Mức độ phức tạp: ${analysis.complexityLevel}
- Cần tham khảo ulama: ${analysis.scholarConsultationNeeded ? 'Có' : 'Không'}
- Độ tin cậy: ${(analysis.confidence * 100).toFixed(0)}%

🇻🇳 BỐI CẢNH VIỆT NAM:
- Xã hội đa tôn giáo
- Pháp luật Việt Nam
- Văn hóa địa phương
- Cộng đồng Muslim thiểu số

📚 NGUỒN THAM KHẢO ƯU TIÊN:
- Quran: ${analysis.sources.quran.join(', ')}
- Hadith: ${analysis.sources.hadith.join(', ')}
- Ulama: ${analysis.sources.scholars.join(', ')}

CÂU HỎI: ${question}
`;
  }

  // Process AI response for enhanced display
  public processResponse(response: any): MasterIslamicResponse {
    const analysis = response.islamicAnalysis || this.analyzeQuestion(response.originalQuestion || '');
    
    return {
      response: response.response,
      analysis: analysis,
      scholarly_references: {
        classical: response.references?.filter((r: any) => r.type === 'classical') || [],
        contemporary: response.references?.filter((r: any) => r.type === 'contemporary') || [],
        vietnamese: response.references?.filter((r: any) => r.type === 'vietnamese') || []
      },
      practical_guidance: this.extractPracticalGuidance(response.response),
      warnings: response.scholarConsultationNeeded ? [
        '⚠️ Vấn đề này cần tham khảo thêm ulama địa phương để có hướng dẫn cụ thể.',
        ...this.getVietnameseContextWarnings(analysis.questionType)
      ] : undefined
    };
  }

  // Get Vietnamese context-specific warnings
  private getVietnameseContextWarnings(questionType: string): string[] {
    const warnings: string[] = [];
    
    // Use vietnameseContext for specific guidance
    if (questionType === 'fiqh') {
      warnings.push(`📋 ${this.vietnameseContext.legal_framework.status}`);
      warnings.push(`🤝 Cần ${this.vietnameseContext.cultural_considerations.interfaith_harmony.toLowerCase()}`);
    }
    
    if (questionType === 'aqidah') {
      warnings.push(`🏛️ Tôn trọng ${this.vietnameseContext.cultural_considerations.majority_religion}`);
    }
    
    // Add practical challenges if relevant
    if (['fiqh', 'akhlaq'].includes(questionType)) {
      const relevantChallenges = this.vietnameseContext.practical_challenges.slice(0, 2);
      warnings.push(`💡 Lưu ý: ${relevantChallenges.join(', ')}`);
    }
    
    return warnings;
  }

  private extractPracticalGuidance(response: string): string[] {
    // Extract practical guidance from response
    const guidanceMarkers = ['💡', '📝', '🔧', 'Hướng dẫn:', 'Thực hành:'];
    const lines = response.split('\n');
    
    return lines.filter(line => 
      guidanceMarkers.some(marker => line.includes(marker))
    ).map(line => line.trim());
  }

  // Get Vietnamese Islamic context information
  public getVietnameseIslamicContext(): typeof this.vietnameseContext {
    return this.vietnameseContext;
  }

  // Get practical challenges for Vietnamese Muslims
  public getPracticalChallenges(): string[] {
    return this.vietnameseContext.practical_challenges;
  }

  // Get legal framework information
  public getLegalFramework(): typeof this.vietnameseContext.legal_framework {
    return this.vietnameseContext.legal_framework;
  }

  // Get cultural considerations
  public getCulturalConsiderations(): typeof this.vietnameseContext.cultural_considerations {
    return this.vietnameseContext.cultural_considerations;
  }
}

export default MasterIslamicEngine;
