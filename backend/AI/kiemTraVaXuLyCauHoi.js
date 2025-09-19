// kiemTraVaXuLyCauHoi.js - Module kiểm tra và xử lý câu hỏi cho Mira  AI

// Khởi tạo các Map để lưu trữ dữ liệu
const rateLimitMap = new Map();
const userInteractionStats = new Map();

// Enhanced rate limiting with user behavior analysis
export function checkRateLimit(identifier, maxRequests = 15, windowMs = 60000) {
  const now = Date.now();
  const windowStart = now - windowMs;
  
  if (!rateLimitMap.has(identifier)) {
    rateLimitMap.set(identifier, []);
  }
  
  const requests = rateLimitMap.get(identifier);
  const validRequests = requests.filter(time => time > windowStart);
  rateLimitMap.set(identifier, validRequests);
  
  // Track user interaction patterns
  if (!userInteractionStats.has(identifier)) {
    userInteractionStats.set(identifier, {
      totalRequests: 0,
      firstSeen: now,
      lastSeen: now,
      avgResponseTime: 0,
      topics: new Set()
    });
  }
  
  const stats = userInteractionStats.get(identifier);
  stats.totalRequests++;
  stats.lastSeen = now;
  
  if (validRequests.length >= maxRequests) {
    return false;
  }
  
  validRequests.push(now);
  rateLimitMap.set(identifier, validRequests);
  return true;
}

// Enhanced context detection with emotional and cultural analysis
export function detectQuestionContext(question) {
  const contexts = {
    // Worship and Religious Practices
    worship: /(?:cầu nguyện|salah|namaz|wudu|ablution|tẩy uế|hành lễ|thờ phượng|ibadah|nguyện|dua|dhikr|thánh ca)/i,
    quran: /(?:qur'an|quran|kinh|thánh kinh|ayah|surah|chương|đọc|học|thuộc|tụng)/i,
    hadith: /(?:hadith|hadis|sunnah|bukhari|muslim|tirmidhi|abudawud|ibnmajah|nasai|malik|ahmad)/i,
    
    // Islamic Knowledge
    fiqh: /(?:halal|haram|luật|quy định|giáo luật|fiqh|hukum|ibadah|thờ phượng|salah|namaz|wudu|tẩy uế|thực hành)/i,
    faith: /(?:iman|đức tin|tín ngưỡng|niềm tin|allah|thần|thiên sứ|ngày phán xét|thiên đàng|địa ngục|jannah|jahannam)/i,
    aqeedah: /(?:aqeedah|đức tin|tín ngưỡng|niềm tin|allah|thần|thiên sứ|ngày phán xét|thiên đàng|địa ngục|tawhid|shirk)/i,
    
    // Social and Personal Life
    social: /(?:gia đình|vợ chồng|con cái|xã hội|cộng đồng|muslim|bạn bè|láng giềng|quan hệ|hôn nhân|ly hôn|nuôi dạy)/i,
    personal: /(?:tôi|mình|em|anh|chị|cá nhân|riêng|bản thân|tâm sự|lo lắng|băn khoăn|không chắc)/i,
    family: /(?:gia đình|vợ chồng|con cái|hôn nhân|ly hôn|nuôi dạy|cha mẹ|ông bà|anh chị em|họ hàng)/i,
    
    // Cultural and Contemporary
    culture: /(?:văn hóa|truyền thống|phong tục|tập quán|lễ hội|tết|ramadan|eid|mawlid|isra|mi'raj)/i,
    contemporary: /(?:hiện đại|công nghệ|internet|mạng xã hội|điện thoại|máy tính|trực tuyến|online|digital|số hóa)/i,
    vietnamese: /(?:việt nam|việt|hà nội|sài gòn|hồ chí minh|đà nẵng|huế|cần thơ|hải phòng|đồng nai|bình dương)/i,
    
    // Emotional and Psychological
    emotional: /(?:lo lắng|băn khoăn|không chắc|muốn|hy vọng|mong|cần|giúp|buồn|vui|sợ|lo|thắc mắc)/i,
    psychological: /(?:tâm lý|tinh thần|tâm hồn|an tâm|bình an|thanh thản|hạnh phúc|buồn phiền|lo âu|trầm cảm)/i,
    
    // Learning and Education
    education: /(?:học|dạy|giáo dục|trường|lớp|khóa|bài|kiến thức|hiểu biết|tìm hiểu|nghiên cứu|học hỏi)/i,
    language: /(?:tiếng việt|tiếng ả rập|tiếng anh|ngôn ngữ|dịch|phiên âm|phát âm|đọc|viết|nói|nghe)/i,
    
    // Time and Urgency
    urgency: /(?:gấp|ngay|khẩn cấp|nhanh|vội|sớm|muộn|kịp|trễ|hết hạn|deadline|thời hạn)/i,
    time: /(?:thời gian|giờ|phút|ngày|tháng|năm|mùa|kỳ|đợt|giai đoạn|thời điểm|thời kỳ)/i,
    
    // Complexity and Understanding
    complexity: /(?:phức tạp|khó|không hiểu|phân vân|bối rối|rắc rối|phức tạp|đơn giản|dễ|khó khăn|thử thách)/i,
    understanding: /(?:hiểu|biết|rõ|không rõ|mơ hồ|lờ mờ|rõ ràng|chắc chắn|không chắc|nghi ngờ|thắc mắc)/i
  };
  
  const detectedContexts = [];
  let emotionalState = 'neutral';
  let urgencyLevel = 'normal';
  let complexityLevel = 'medium';
  let culturalContext = 'general';
  let learningStyle = 'balanced';
  
  // Enhanced emotional state detection
  if (/(?:lo lắng|băn khoăn|không chắc|sợ|lo|buồn|phiền|khó chịu)/i.test(question)) {
    emotionalState = 'concerned';
  } else if (/(?:vui|hạnh phúc|vui mừng|phấn khởi|hào hứng|thích thú)/i.test(question)) {
    emotionalState = 'positive';
  } else if (/(?:giận|bực|khó chịu|không hài lòng|thất vọng)/i.test(question)) {
    emotionalState = 'negative';
  }
  
  // Enhanced urgency detection
  if (/(?:gấp|ngay|khẩn cấp|nhanh|vội|sớm|kịp|deadline)/i.test(question)) {
    urgencyLevel = 'high';
  } else if (/(?:khi nào|bao giờ|lúc nào|thời điểm|thời gian)/i.test(question)) {
    urgencyLevel = 'medium';
  }
  
  // Enhanced complexity detection
  if (/(?:phức tạp|khó|không hiểu|phân vân|bối rối|rắc rối)/i.test(question)) {
    complexityLevel = 'high';
  } else if (/(?:đơn giản|dễ|cơ bản|đầu tiên|bắt đầu)/i.test(question)) {
    complexityLevel = 'low';
  }
  
  // Enhanced cultural context detection
  if (/(?:việt nam|việt|hà nội|sài gòn|hồ chí minh)/i.test(question)) {
    culturalContext = 'vietnamese';
  } else if (/(?:islam|hồi giáo|muslim|đạo hồi)/i.test(question)) {
    culturalContext = 'islamic';
  }
  
  // Enhanced learning style detection
  if (/(?:chi tiết|kỹ lưỡng|đầy đủ|toàn diện|sâu sắc)/i.test(question)) {
    learningStyle = 'detailed';
  } else if (/(?:ngắn gọn|đơn giản|dễ hiểu|cơ bản|tổng quan)/i.test(question)) {
    learningStyle = 'simple';
  }
  
  // Detect all relevant contexts
  for (const [context, pattern] of Object.entries(contexts)) {
    if (pattern.test(question)) {
      detectedContexts.push(context);
    }
  }
  
  // Add Vietnamese cultural context if detected
  if (culturalContext === 'vietnamese') {
    detectedContexts.push('vietnamese');
  }
  
  return {
    contexts: detectedContexts,
    emotionalState,
    urgencyLevel,
    complexityLevel,
    culturalContext,
    learningStyle,
    // Add additional analysis
    isPersonalQuestion: detectedContexts.includes('personal'),
    isUrgentQuestion: urgencyLevel === 'high',
    isComplexQuestion: complexityLevel === 'high',
    requiresDetailedAnswer: learningStyle === 'detailed',
    hasCulturalContext: culturalContext !== 'general'
  };
}

// Enhanced input validation with cultural sensitivity and security
export function validateInput(userQuestion, clientIP, userContext = {}) {
  // Basic validation
  if (!userQuestion || typeof userQuestion !== 'string') {
    return { 
      isValid: false, 
      error: 'Vui lòng nhập câu hỏi hợp lệ về Hồi giáo',
      suggestion: 'Bạn có thể hỏi về các chủ đề như: cầu nguyện, đức tin, gia đình, hoặc các vấn đề đương đại',
      severity: 'low'
    };
  }
  
  const trimmedQuestion = userQuestion.trim();
  
  if (trimmedQuestion.length === 0) {
    return { 
      isValid: false, 
      error: 'Câu hỏi không được để trống',
      suggestion: 'Hãy đặt câu hỏi cụ thể để nhận được câu trả lời hữu ích nhất',
      severity: 'low'
    };
  }
  
  // Length validation with different tiers
  if (trimmedQuestion.length > 2000) {
    return { 
      isValid: false, 
      error: 'Câu hỏi quá dài (tối đa 2000 ký tự)',
      suggestion: 'Hãy chia nhỏ câu hỏi thành các phần để dễ hiểu hơn',
      severity: 'medium'
    };
  }
  
  if (trimmedQuestion.length > 1000) {
    // Warning but still valid
    console.warn('Long question detected:', trimmedQuestion.length, 'characters');
  }
  
  // Security validation
  const securityPatterns = [
    /(?:script|javascript|eval|function|onclick|onerror)/i,
    /(?:<script|<iframe|<object|<embed)/i,
    /(?:sql|select|insert|update|delete|drop|union)\s*(?:from|into|table)/i,
    /(?:\.\.\/|\.\.\\|file:\/\/|ftp:\/\/)/i
  ];
  
  for (const pattern of securityPatterns) {
    if (pattern.test(trimmedQuestion)) {
      return { 
        isValid: false, 
        error: 'Câu hỏi chứa nội dung không an toàn',
        suggestion: 'Vui lòng đặt câu hỏi bình thường về Hồi giáo',
        severity: 'high',
        flagged: true
      };
    }
  }
  
  // Enhanced inappropriate content detection
  const inappropriatePatterns = [
    // Disrespectful language
    {
      pattern: /(?:chửi|mắng|tục tĩu|bậy bạ|thô tục|không tôn trọng|đm|vcl|cc|vkl)/i,
      message: 'Vui lòng sử dụng ngôn ngữ lịch sự và tôn trọng'
    },
    // Anti-Islamic content
    {
      pattern: /(?:phản đối|chống|từ chối|bài xích|ghét)\s*(?:islam|hồi giáo|muslim|mụt lim)/i,
      message: 'Vui lòng đặt câu hỏi một cách thiện chí và tôn trọng'
    },
    // Discriminatory language
    {
      pattern: /(?:xúc phạm|miệt thị|kỳ thị|phân biệt|coi thường)\s*(?:islam|hồi giáo|muslim|mụt lim|giáo dân)/i,
      message: 'Mira AI khuyến khích sự tôn trọng và hiểu biết lẫn nhau'
    },
    // Blasphemous content
    {
      pattern: /(?:báng bổ|phạm thượng|thiếu tôn trọng|chửi|mắng)\s*(?:allah|chúa|thần|thiên sứ|muhammad|nabi)/i,
      message: 'Vui lòng thể hiện sự tôn trọng đối với những điều thiêng liêng'
    },
    // Extremist content detection
    {
      pattern: /(?:khủng bố|cực đoan|bạo lực|jihad sai lệch|tấn công)/i,
      message: 'Chúng tôi không thảo luận về các chủ đề cực đoan hoặc bạo lực'
    }
  ];
  
  for (const item of inappropriatePatterns) {
    if (item.pattern.test(trimmedQuestion)) {
      return { 
        isValid: false, 
        error: item.message,
        suggestion: 'Mira AI luôn sẵn sàng giúp bạn tìm hiểu về Hồi giáo một cách tôn trọng và chân thành',
        severity: 'high',
        flagged: true
      };
    }
  }
  
  // Spam detection
  const spamPatterns = [
    /(.)\1{10,}/g, // Repeated characters
    /(?:mua|bán|quảng cáo|marketing|seo|link|website|click here)/i,
    /(?:http|www\.|\.com|\.net|\.org)/i
  ];
  
  for (const pattern of spamPatterns) {
    if (pattern.test(trimmedQuestion)) {
      return {
        isValid: false,
        error: 'Câu hỏi có dấu hiệu spam hoặc quảng cáo',
        suggestion: 'Vui lòng đặt câu hỏi chân thành về Hồi giáo',
        severity: 'medium'
      };
    }
  }
  
  // Cultural sensitivity analysis
  const culturalPatterns = {
    positive: /(?:tôn trọng|kính trọng|yêu mến|quý mến|thiện chí|hiểu biết|học hỏi|tìm hiểu)/i,
    negative: /(?:kỳ thị|phân biệt|miệt thị|coi thường|khinh thường|ghét bỏ)/i,
    questioning: /(?:tại sao|vì sao|có phải|có đúng|thật sự|thực tế)/i,
    seeking: /(?:làm thế nào|hướng dẫn|chỉ dẫn|giúp đỡ|tư vấn)/i
  };
  
  // Determine user intent and tone
  let culturalTone = 'neutral';
  let userIntent = 'general';
  
  if (culturalPatterns.positive.test(trimmedQuestion)) {
    culturalTone = 'positive';
  } else if (culturalPatterns.negative.test(trimmedQuestion)) {
    return {
      isValid: false,
      error: 'Vui lòng thể hiện sự tôn trọng đối với tôn giáo và văn hóa',
      suggestion: 'Mira  AI khuyến khích sự hiểu biết và tôn trọng lẫn nhau giữa các tôn giáo và văn hóa',
      severity: 'medium'
    };
  }
  
  if (culturalPatterns.questioning.test(trimmedQuestion)) {
    userIntent = 'questioning';
  } else if (culturalPatterns.seeking.test(trimmedQuestion)) {
    userIntent = 'seeking_guidance';
  }
  
  // Topic categorization for better response handling
  const topicCategories = {
    worship: /(?:cầu nguyện|salah|namaz|thánh lễ|kinh koran|quran|thờ phượng)/i,
    faith: /(?:đức tin|iman|tin tưởng|niềm tin|allah|chúa trời)/i,
    family: /(?:gia đình|vợ chồng|con cái|hôn nhân|ly hôn)/i,
    social: /(?:xã hội|cộng đồng|hàng xóm|bạn bè|quan hệ)/i,
    finance: /(?:tài chính|tiền bạc|riba|lãi suất|zakat|từ thiện)/i,
    culture: /(?:văn hóa|truyền thống|lễ hội|eid|ramadan)/i,
    contemporary: /(?:hiện đại|đương đại|công nghệ|internet|social media)/i
  };
  
  let detectedTopics = [];
  for (const [topic, pattern] of Object.entries(topicCategories)) {
    if (pattern.test(trimmedQuestion)) {
      detectedTopics.push(topic);
    }
  }
  
  // Rate limiting check (if applicable)
  if (clientIP && isRateLimited(clientIP)) {
    return {
      isValid: false,
      error: 'Bạn đã đặt quá nhiều câu hỏi trong thời gian ngắn',
      suggestion: 'Vui lòng chờ một chút trước khi đặt câu hỏi tiếp theo',
      severity: 'medium'
    };
  }
  
  return { 
    isValid: true,
    culturalTone,
    userIntent,
    detectedTopics,
    questionLength: trimmedQuestion.length,
    processedQuestion: trimmedQuestion,
    metadata: {
      timestamp: new Date().toISOString(),
      clientIP: clientIP ? hashIP(clientIP) : null, // Hash for privacy
      userContext
    }
  };
}

// Helper function for rate limiting
function isRateLimited(clientIP) {
  // Implement rate limiting logic here
  // This could use Redis, memory cache, or database
  return false; // Placeholder
}

// Helper function to hash IP for privacy
function hashIP(ip) {
  // Simple hash function for privacy
  return btoa(ip).slice(0, 8);
}

// Enhanced response based on validation result
export function generateResponse(validationResult, originalQuestion) {
  if (!validationResult.isValid) {
    let response = `Assalamu alaykum,\n\n${validationResult.error}\n\n${validationResult.suggestion}`;
    
    if (validationResult.severity === 'high') {
      response += '\n\nNếu bạn cần hỗ trợ, vui lòng liên hệ với quản trị viên.';
    }
    
    response += '\n\nBarakallahu feeki wa ahlan wa sahlan.';
    return response;
  }
  
  // Customize response based on user intent and cultural tone
  let responsePrefix = 'Assalamu alaykum wa rahmatullahi wa barakatuh,\n\n';
  
  if (validationResult.culturalTone === 'positive') {
    responsePrefix += 'Cảm ơn bạn đã đặt câu hỏi với thái độ tôn trọng. ';
  }
  
  if (validationResult.userIntent === 'seeking_guidance') {
    responsePrefix += 'Tôi rất vui được hỗ trợ bạn tìm hiểu về Hồi giáo. ';
  }
  
  return {
    prefix: responsePrefix,
    topics: validationResult.detectedTopics,
    intent: validationResult.userIntent,
    shouldProceed: true
  };
}

// Export các utility functions
export { rateLimitMap, userInteractionStats };