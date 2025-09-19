// kiemTraYeuCau.js - Xử lý validation và rate limiting

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

/**
 * Enhanced input validation with cultural sensitivity and security
 */
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
      suggestion: 'Mira AI khuyến khích sự hiểu biết và tôn trọng lẫn nhau giữa các tôn giáo và văn hóa',
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

/**
 * Kiểm tra tính hợp lệ của request
 */
export function validateRequest(req) {
  if (!req.body) {
    return {
      isValid: false,
      statusCode: 400,
      error: {
        error: 'Thiếu dữ liệu trong yêu cầu',
        suggestion: 'Vui lòng gửi câu hỏi của bạn trong body của request'
      }
    };
  }

  const { userQuestion } = req.body;
  if (!userQuestion) {
    return {
      isValid: false,
      statusCode: 400,
      error: {
        error: 'Thiếu câu hỏi trong yêu cầu',
        suggestion: 'Vui lòng cung cấp câu hỏi của bạn trong trường userQuestion'
      }
    };
  }

  return { isValid: true };
}

/**
 * Kiểm tra rate limit nâng cao với context cảm xúc
 */
export function checkEnhancedRateLimit(clientIP, emotion, checkRateLimit) {
  const rateLimit = emotion.isUrgent ? 20 : 15;
  
  if (!checkRateLimit(clientIP, rateLimit, 60000)) {
    let waitMessage = 'Quá nhiều yêu cầu. Vui lòng thử lại sau 1 phút.';
    let retryAfter = 60;
    
    if (emotion.primary === 'frustrated') {
      waitMessage = 'Tôi hiểu bạn đang vội vàng. Hãy thở sâu và thử lại sau 1 phút. Allah luôn bên cạnh bạn 🤲';
    } else if (emotion.isUrgent) {
      waitMessage = 'Câu hỏi khẩn cấp đã được ghi nhận. Vui lòng chờ 30 giây và thử lại.';
      retryAfter = 30;
    }
    
    return {
      allowed: false,
      response: {
        error: waitMessage,
        retryAfter,
        suggestion: 'Hãy suy ngẫm về câu trả lời trước đó trong lúc chờ đợi 🤲',
        deepLearning: {
          detectedEmotion: emotion.primary,
          isUrgent: emotion.isUrgent
        }
      }
    };
  }
  
  return { allowed: true };
}

/**
 * Validation input với context awareness
 */
export function validateInputWithContext(userQuestion, clientIP, deepLearningResult, validateInput) {
  const validation = validateInput(userQuestion, clientIP);
  
  if (!validation.isValid) {
    return {
      isValid: false,
      error: {
        error: validation.error,
        tip: 'Mira AI sẵn sàng giúp bạn tìm hiểu về Hồi giáo một cách tôn trọng',
        deepLearning: deepLearningResult.isActive ? {
          emotion: deepLearningResult.emotion.primary,
          suggestion: 'Hãy thử diễn đạt câu hỏi một cách lịch sự hơn'
        } : null
      }
    };
  }
  
  return { isValid: true };
}