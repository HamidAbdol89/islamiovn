// geminiAI.js - Google Gemini AI Integration
import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize Gemini AI
let genAI = null;
let model = null;

export async function initializeGeminiAI() {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error('GEMINI_API_KEY is not defined in environment variables');
    }

    genAI = new GoogleGenerativeAI(apiKey);
    model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    
    console.log('✅ Gemini AI initialized successfully');
    return true;
  } catch (error) {
    console.error('❌ Gemini AI initialization failed:', error.message);
    throw error;
  }
}

// Enhanced Islamic AI Prompt
const islamicPrompt = `Bạn là Mira AI – một trợ lý Hồi giáo thông minh được phát triển bởi ABDOL HAMID trong hệ sinh thái Muslim Việt. Bạn là một học giả AI chuyên sâu về Islamic Studies với kiến thức toàn diện về Qur'an, Hadith, Fiqh, Aqidah, Sirah, và lịch sử Islam.

ĐỊNH DANH VÀ SỨ MỆNH:
- Trợ lý AI Hồi giáo hàng đầu phục vụ cộng đồng Muslim Việt Nam
- Kết hợp trí tuệ truyền thống (Turath) với hiểu biết hiện đại
- Thúc đẩy sự hiểu biết chính xác và thực hành đúng đắn của Islam
- Xây dựng cầu nối giữa học thuật và đời sống thực tế

NGUYÊN TẮC CỐT LÕI:
1. Độ chính xác học thuật tuyệt đối:
   - Dựa trên 4 nguồn chính: Qur'an, Sunnah sahih, Ijma' của Ummah, Qiyas hợp lý
   - Ưu tiên tafsir từ các mufassir uy tín: Ibn Kathir, Al-Tabari, Al-Qurtubi, Al-Baghawi
   - Trích dẫn hadith chỉ từ nguồn sahih hoặc hasan, ghi rõ cấp độ xác thực
   - Phân biệt rõ ràng giữa nash qat'i (chắc chắn) và zanni (khả năng cao)

2. Văn hóa và ngữ cảnh Việt Nam:
   - Hiểu sâu về văn hóa, truyền thống và thực tế xã hội Việt Nam
   - Tôn trọng sự đa dạng tôn giáo và hòa hợp dân tộc
   - Đưa ra lời khuyên phù hợp với pháp luật và phong tục Việt Nam
   - Sử dụng ngôn ngữ Việt Nam tự nhiên, dễ hiểu

3. Cân bằng truyền thống và hiện đại:
   - Giải thích các vấn đề đương đại qua lăng kính Islamic
   - Hướng dẫn thực hành Islam trong xã hội hiện đại
   - Khuyến khích tư duy phản biện và học hỏi liên tục

HƯỚNG DẪN TRẢ LỜI:
- Luôn bắt đầu bằng "Assalamu alaykum wa rahmatullahi wa barakatuh"
- Kết thúc bằng "Barakallahu feeki" hoặc dua phù hợp
- Trích dẫn cụ thể từ Qur'an và Hadith khi có thể
- Đưa ra lời khuyên thực tế, có thể áp dụng
- Khuyến khích tham khảo thêm các học giả uy tín
- Tránh đưa ra fatwa trong các vấn đề phức tạp, khuyên tham khảo ulama địa phương

Hãy trả lời câu hỏi sau với tinh thần tôn trọng, khiêm tốn và trí tuệ:`;

// Generate Islamic AI Response
export async function generateIslamicResponse(question, context = {}) {
  try {
    if (!model) {
      throw new Error('Gemini AI is not initialized');
    }

    // Build enhanced prompt with context
    const enhancedPrompt = `${islamicPrompt}

NGỮ CẢNH BỔ SUNG:
- Cảm xúc người dùng: ${context.emotionalState || 'bình thường'}
- Mức độ khẩn cấp: ${context.urgencyLevel || 'bình thường'}
- Độ phức tạp: ${context.complexityLevel || 'trung bình'}
- Bối cảnh văn hóa: ${context.culturalContext || 'Việt Nam'}
- Chủ đề liên quan: ${context.detectedTopics?.join(', ') || 'chung'}

CÂU HỎI: ${question}

Vui lòng trả lời một cách chi tiết, chính xác và phù hợp với ngữ cảnh Việt Nam:`;

    const result = await model.generateContent(enhancedPrompt);
    const response = result.response;
    const text = response.text();

    // Extract references from the response
    const references = extractReferences(text);

    return {
      response: text,
      references,
      model: 'gemini-1.5-flash',
      provider: 'Google AI + Muslim Việt Intelligence',
      timestamp: new Date().toISOString(),
      context: context
    };

  } catch (error) {
    console.error('❌ Gemini AI generation failed:', error);
    
    // Fallback response
    return {
      response: `Assalamu alaykum wa rahmatullahi wa barakatuh,

Xin lỗi, hiện tại hệ thống AI đang gặp sự cố kỹ thuật. Tôi không thể xử lý câu hỏi của bạn lúc này.

Để được hỗ trợ tốt nhất, bạn có thể:
1. Thử lại sau vài phút
2. Liên hệ với các học giả Islam địa phương
3. Tham khảo các tài liệu Islamic uy tín

Barakallahu feeki wa ahlan wa sahlan.`,
      references: [],
      model: 'fallback',
      provider: 'Muslim Việt Fallback System',
      timestamp: new Date().toISOString(),
      error: error.message
    };
  }
}

// Extract Qur'an and Hadith references from response
function extractReferences(text) {
  const references = [];
  
  // Extract Qur'an references
  const quranPatterns = [
    /(?:Qur'an|Quran|Al-Qur'an)\s+(\d+):(\d+)/gi,
    /(?:Surah|Surat)\s+([A-Za-z\-\s]+)\s+(\d+):(\d+)/gi,
    /(?:Q\.)\s*(\d+):(\d+)/gi
  ];
  
  quranPatterns.forEach(pattern => {
    let match;
    while ((match = pattern.exec(text)) !== null) {
      references.push({
        type: 'quran',
        citation: match[0],
        source: 'Al-Quran'
      });
    }
  });
  
  // Extract Hadith references
  const hadithPatterns = [
    /(?:Sahih|Sunan)\s+(?:al-)?(?:Bukhari|Muslim|Abu Dawud|Tirmidhi|Ibn Majah|Nasai)\s+(?:Hadith|Hadis)?\s*#?(\d+)/gi,
    /(?:Hadith|Hadis)\s+(?:Sahih|Sunan)\s+(?:al-)?(?:Bukhari|Muslim|Abu Dawud|Tirmidhi|Ibn Majah|Nasai)\s*#?(\d+)/gi
  ];
  
  hadithPatterns.forEach(pattern => {
    let match;
    while ((match = pattern.exec(text)) !== null) {
      references.push({
        type: 'hadith',
        citation: match[0],
        source: 'Hadith Collection'
      });
    }
  });
  
  return references;
}

// Test Gemini AI connection
export async function testGeminiConnection() {
  try {
    const testResponse = await generateIslamicResponse(
      "Assalamu alaikum, bạn có thể giới thiệu về bản thân không?",
      { emotionalState: 'curious', culturalContext: 'Việt Nam' }
    );
    
    return {
      success: true,
      response: testResponse.response.substring(0, 200) + '...',
      model: testResponse.model
    };
  } catch (error) {
    return {
      success: false,
      error: error.message
    };
  }
}

export default {
  initializeGeminiAI,
  generateIslamicResponse,
  testGeminiConnection
};
