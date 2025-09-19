// Data Populator - Populate empty collections with initial data
// Developed by ABDOL HAMID for Muslim Việt

import { IslamicKnowledge, Analytics, UserStats } from './database.js';

// Islamic Knowledge Base Data
const islamicKnowledgeData = [
  {
    topic: "riba",
    title: "Hukm về Riba (Lãi suất) trong Islam",
    content: `Riba (lãi suất) là một trong những tội lớn được cấm nghiêm trong Islam. Allah SWT phán trong Quran: "Allah đã cho phép mua bán và cấm riba" (Al-Baqarah: 275).

Các loại Riba chính:
1. Riba al-Fadl: Trao đổi cùng loại hàng hóa với số lượng khác nhau
2. Riba al-Nasi'ah: Hoãn thanh toán trong giao dịch trao đổi

Trong bối cảnh hiện đại, riba bao gồm:
- Lãi suất ngân hàng
- Lãi suất thẻ tín dụng
- Các khoản vay có lãi suất

Đối với Muslim tại Việt Nam:
- Tìm hiểu Islamic Banking alternatives
- Sử dụng các hình thức tài chính halal
- Tham khảo ulama về các trường hợp cụ thể`,
    references: [
      { source: "Quran", citation: "2:275", type: "quran" },
      { source: "Quran", citation: "2:278-279", type: "quran" },
      { source: "Sahih Bukhari", citation: "2085", type: "hadith" }
    ],
    tags: ["fiqh", "muamalat", "banking", "riba", "finance"],
    language: "vi",
    isVerified: true,
    verifiedBy: "ABDOL HAMID",
    usage: { viewCount: 0, helpfulCount: 0 }
  },
  {
    topic: "salah",
    title: "Hướng dẫn Salah (Cầu nguyện) tại Việt Nam",
    content: `Salah là trụ cột thứ hai của Islam và là nghĩa vụ bắt buộc đối với mọi Muslim.

Thời gian Salah tại Việt Nam:
1. Fajr: Trước bình minh
2. Dhuhr: Sau mặt trời lên cao nhất
3. Asr: Chiều tà
4. Maghrib: Sau hoàng hôn
5. Isha: Tối

Hướng Qibla tại Việt Nam: Tây Nam (khoảng 295°)

Thách thức tại Việt Nam:
- Tìm nơi cầu nguyện tại công sở
- Xin phép nghỉ cho Salah Jumu'ah
- Giải thích với đồng nghiệp về thời gian cầu nguyện

Giải pháp:
- Sử dụng app tính giờ cầu nguyện
- Chuẩn bị thảm cầu nguyện di động
- Tìm hiểu quy định công ty về tôn giáo`,
    references: [
      { source: "Quran", citation: "2:238", type: "quran" },
      { source: "Sahih Bukhari", citation: "527", type: "hadith" }
    ],
    tags: ["ibadah", "salah", "prayer", "vietnam", "workplace"],
    language: "vi",
    isVerified: true,
    verifiedBy: "ABDOL HAMID",
    usage: { viewCount: 0, helpfulCount: 0 }
  },
  {
    topic: "halal_food",
    title: "Thức ăn Halal tại Việt Nam",
    content: `Tìm kiếm thức ăn halal là thách thức lớn cho Muslim tại Việt Nam.

Nguyên tắc Halal:
- Không thịt heo
- Động vật được giết theo Islamic way
- Không rượu và chất say
- Không lẫn với haram food

Tại Việt Nam:
1. Nhà hàng Halal certified
2. Khu phố Muslim (như Chợ Lớn)
3. Tự nấu ăn tại nhà
4. Seafood và vegetarian options

Lưu ý:
- Kiểm tra ingredients carefully
- Hỏi về cách chế biến
- Tránh cross-contamination
- Khi nghi ngờ, tránh xa (warā')`,
    references: [
      { source: "Quran", citation: "2:168", type: "quran" },
      { source: "Quran", citation: "5:3", type: "quran" }
    ],
    tags: ["halal", "food", "vietnam", "daily_life"],
    language: "vi",
    isVerified: true,
    verifiedBy: "ABDOL HAMID",
    usage: { viewCount: 0, helpfulCount: 0 }
  },
  {
    topic: "marriage",
    title: "Hôn nhân trong Islam - Hướng dẫn cho Muslim Việt Nam",
    content: `Hôn nhân (Nikah) là một nửa của đức tin trong Islam.

Điều kiện Nikah:
1. Wali (người bảo hộ) cho cô dâu
2. Hai nhân chứng Muslim
3. Mahr (của hồi môn)
4. Ijab wa Qabul (lời tuyên thệ)

Tại Việt Nam:
- Đăng ký kết hôn theo pháp luật VN
- Tổ chức Nikah theo Islamic way
- Tôn trọng phong tục địa phương
- Hòa hợp với gia đình hai bên

Interfaith Marriage:
- Nam Muslim có thể cưới Ahl al-Kitab
- Nữ Muslim chỉ cưới Muslim
- Cần tham khảo ulama về trường hợp cụ thể`,
    references: [
      { source: "Quran", citation: "4:21", type: "quran" },
      { source: "Sahih Bukhari", citation: "5066", type: "hadith" }
    ],
    tags: ["marriage", "nikah", "family", "vietnam", "interfaith"],
    language: "vi",
    isVerified: true,
    verifiedBy: "ABDOL HAMID",
    usage: { viewCount: 0, helpfulCount: 0 }
  }
];

// Populate Islamic Knowledge Base
export async function populateIslamicKnowledge() {
  try {
    console.log('📚 Populating Islamic Knowledge Base...');
    
    for (const knowledge of islamicKnowledgeData) {
      const existing = await IslamicKnowledge.findOne({ topic: knowledge.topic });
      
      if (!existing) {
        await IslamicKnowledge.create(knowledge);
        console.log(`✅ Added knowledge: ${knowledge.title}`);
      } else {
        console.log(`⏭️  Knowledge exists: ${knowledge.title}`);
      }
    }
    
    console.log('✅ Islamic Knowledge Base populated successfully');
  } catch (error) {
    console.error('❌ Error populating Islamic Knowledge:', error);
  }
}

// Create initial analytics entry
export async function createInitialAnalytics() {
  try {
    console.log('📊 Creating initial analytics...');
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const existing = await Analytics.findOne({ date: today });
    
    if (!existing) {
      await Analytics.create({
        date: today,
        metrics: {
          totalQuestions: 0,
          uniqueUsers: 0,
          avgResponseTime: 0,
          topTopics: [],
          satisfactionAvg: 0,
          errorRate: 0
        },
        performance: {
          serverUptime: 0,
          memoryUsage: 0,
          cacheHitRate: 0
        }
      });
      console.log('✅ Initial analytics created');
    } else {
      console.log('⏭️  Analytics entry exists for today');
    }
  } catch (error) {
    console.error('❌ Error creating analytics:', error);
  }
}

// Update daily analytics
export async function updateDailyAnalytics() {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // Get today's questions
    const { IslamicQuestion } = await import('./database.js');
    const todayQuestions = await IslamicQuestion.find({
      createdAt: { $gte: today }
    });
    
    // Calculate metrics
    const totalQuestions = todayQuestions.length;
    const uniqueUsers = new Set(todayQuestions.map(q => q.userIP)).size;
    const avgResponseTime = totalQuestions > 0 
      ? todayQuestions.reduce((sum, q) => sum + (q.responseTime || 0), 0) / totalQuestions 
      : 0;
    
    // Topic analysis
    const topicCounts = {};
    todayQuestions.forEach(q => {
      if (q.context?.detectedTopics) {
        q.context.detectedTopics.forEach(topic => {
          topicCounts[topic] = (topicCounts[topic] || 0) + 1;
        });
      }
    });
    
    const topTopics = Object.entries(topicCounts)
      .map(([topic, count]) => ({ topic, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);
    
    // Update analytics
    await Analytics.findOneAndUpdate(
      { date: today },
      {
        $set: {
          'metrics.totalQuestions': totalQuestions,
          'metrics.uniqueUsers': uniqueUsers,
          'metrics.avgResponseTime': Math.round(avgResponseTime),
          'metrics.topTopics': topTopics,
          'performance.serverUptime': process.uptime(),
          'performance.memoryUsage': process.memoryUsage().heapUsed / 1024 / 1024 // MB
        }
      },
      { upsert: true }
    );
    
    console.log(`📊 Analytics updated: ${totalQuestions} questions, ${uniqueUsers} users`);
  } catch (error) {
    console.error('❌ Error updating analytics:', error);
  }
}

// Update user stats
export async function updateUserStatsData(identifier, questionData) {
  try {
    const stats = await UserStats.findOneAndUpdate(
      { identifier },
      {
        $inc: { 
          totalQuestions: 1,
          totalResponseTime: questionData.responseTime || 0
        },
        $set: { 
          lastSeen: new Date(),
          avgResponseTime: 0 // Will be calculated below
        },
        $setOnInsert: { 
          firstSeen: new Date(),
          topicsInterested: [],
          emotionHistory: [],
          satisfactionRatings: []
        }
      },
      { upsert: true, new: true }
    );
    
    // Calculate average response time
    if (stats.totalQuestions > 0) {
      stats.avgResponseTime = Math.round(stats.totalResponseTime / stats.totalQuestions);
      await stats.save();
    }
    
    // Update topics interested
    if (questionData.context?.detectedTopics) {
      for (const topic of questionData.context.detectedTopics) {
        const existingTopic = stats.topicsInterested.find(t => t.topic === topic);
        if (existingTopic) {
          existingTopic.count += 1;
        } else {
          stats.topicsInterested.push({ topic, count: 1 });
        }
      }
      await stats.save();
    }
    
    console.log(`👤 User stats updated for: ${identifier}`);
  } catch (error) {
    console.error('❌ Error updating user stats:', error);
  }
}

// Initialize all data
export async function initializeAllData() {
  console.log('🚀 Initializing database with sample data...');
  
  await populateIslamicKnowledge();
  await createInitialAnalytics();
  
  console.log('✅ All data initialized successfully');
}

// Run analytics update every hour
export function startAnalyticsScheduler() {
  // Update analytics every hour
  setInterval(updateDailyAnalytics, 60 * 60 * 1000);
  
  // Initial update
  updateDailyAnalytics();
  
  console.log('⏰ Analytics scheduler started (updates every hour)');
}
