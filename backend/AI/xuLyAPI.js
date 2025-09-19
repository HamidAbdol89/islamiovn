// xuLyAPI.js - Xử lý API và xây dựng response

import { generateIslamicResponse } from './geminiAI.js';
import { saveQuestion, updateUserStats, getIslamicKnowledge } from './database.js';

/**
 * Process API request with enhanced Islamic AI capabilities
 */
export async function processAPIRequest({
  question,
  context,
  userContext,
  clientIP,
  islamicKnowledgeBase,
  learningSystem,
  memorySystem
}) {
  try {
    console.log('🔄 Processing API request...');
    
    // Get relevant Islamic references from knowledge base
    const relevantReferences = islamicKnowledgeBase.getRelevantReferences(
      context.contexts,
      userContext
    );
    
    // Get knowledge from database
    const dbKnowledge = await getIslamicKnowledge(context.contexts?.[0] || 'general');
    
    // Get contemporary guidance if applicable
    const contemporaryIssues = islamicKnowledgeBase.detectContemporaryIssues(question);
    const contemporaryGuidance = contemporaryIssues.map(issue => 
      islamicKnowledgeBase.getContemporaryGuidance(issue, userContext)
    ).filter(Boolean);
    
    // Build enhanced context for AI
    const enhancedContext = {
      ...context,
      relevantReferences,
      contemporaryGuidance,
      userContext,
      vietnameseContext: userContext.vietnameseContext || 'general',
      dbKnowledge: dbKnowledge ? {
        title: dbKnowledge.title,
        content: dbKnowledge.content.substring(0, 500), // Limit context size
        references: dbKnowledge.references
      } : null
    };
    
    // Generate AI response using Gemini AI
    const aiResponse = await generateIslamicResponse(question, enhancedContext);
    
    // Prepare response data for saving
    const responseData = {
      question,
      response: aiResponse.response,
      context: enhancedContext,
      references: aiResponse.references || relevantReferences,
      userIP: clientIP,
      responseTime: Date.now() - (context.startTime || Date.now())
    };
    
    // Save to database (async, don't wait)
    saveQuestion(responseData).catch(error => {
      console.error('Failed to save question to database:', error);
    });
    
    // Update user stats (async, don't wait)
    updateUserStats(clientIP, responseData).catch(error => {
      console.error('Failed to update user stats:', error);
    });
    
    return {
      response: aiResponse.response,
      references: aiResponse.references || relevantReferences,
      context: enhancedContext,
      contemporaryGuidance,
      model: aiResponse.model,
      provider: aiResponse.provider
    };
    
  } catch (error) {
    console.error('❌ Error processing API request:', error);
    throw error;
  }
}

/**
 * Gọi Gemini API với context nâng cao
 */
export async function callEnhancedGeminiAPI(userQuestion, context, deepLearningResult, clientIP, callGeminiAPI, learningSystem) {
  const enhancedContext = {
    ...context,
    deepLearning: deepLearningResult.insights,
    userEmotion: deepLearningResult.emotion.primary,
    urgencyLevel: deepLearningResult.emotion.isUrgent ? 'high' : 'normal',
    userPersonality: deepLearningResult.personality?.dominantTraits || [],
    previousInteractions: deepLearningResult.isActive ? 
      learningSystem.getUserHistory(clientIP) : []
  };
  
  return await callGeminiAPI(userQuestion, enhancedContext, clientIP);
}

/**
 * Xây dựng response data nâng cao
 */
export function buildEnhancedResponse(aiResponse, deepLearningResult, startTime, userQuestion) {
  return {
    reply: aiResponse.reply,
    contexts: aiResponse.contexts,
    timestamp: new Date().toISOString(),
    model: 'gemini-1.5-flash-enhanced',
    provider: 'Google AI + Mira Intelligence + Deep Learning',
    creator: 'ABDOL HAMID - Mira',
    responseTime: Date.now() - startTime,
    originalQuestion: userQuestion,
    usageStats: aiResponse.usageMetadata,
    intelligence: {
      emotionalState: aiResponse.contextAnalysis?.emotionalState || deepLearningResult.emotion.primary,
      urgencyLevel: aiResponse.contextAnalysis?.urgencyLevel || (deepLearningResult.emotion.isUrgent ? 'high' : 'normal'),
      complexityLevel: aiResponse.contextAnalysis?.complexityLevel,
      references: aiResponse.references,
      deepLearning: {
        enabled: deepLearningResult.isActive,
        emotionAnalysis: deepLearningResult.emotion,
        semanticFeatures: deepLearningResult.semantics ? deepLearningResult.semantics.slice(0, 3) : null,
        userPersonality: deepLearningResult.personality,
        confidence: deepLearningResult.emotion.confidence,
        modelVersion: '1.0.0'
      }
    }
  };
}

// updateUserStats function moved to database.js

/**
 * Xử lý lỗi nâng cao
 */
export function handleEnhancedError(error, req, res, learningSystem) {
  console.error('\n❌ Enhanced Islam AI Error:', {
    name: error.name,
    message: error.message,
    stack: error.stack,
    code: error.code,
    timestamp: new Date().toISOString(),
    deepLearningActive: learningSystem.modelInitialized
  });
  
  // Lỗi API Key
  if (error.message.includes('GEMINI_API_KEY')) {
    return res.status(500).json({
      error: 'Hệ thống AI đang gặp sự cố với khóa API.',
      code: 'MISSING_API_KEY',
      suggestion: 'ABDOL HAMID đang khắc phục vấn đề này. Vui lòng thử lại sau.',
      deepLearning: {
        status: learningSystem.modelInitialized ? 'active' : 'inactive',
        fallbackAvailable: true
      }
    });
  }
  
  // Lỗi rate limit
  if (error.message.includes('rate limit') || error.message.includes('quota')) {
    return res.status(429).json({
      error: 'Mira AI đã đạt giới hạn sử dụng hôm nay.',
      code: 'QUOTA_EXCEEDED',
      suggestion: 'Thử lại vào ngày mai hoặc liên hệ ABDOL HAMID để nâng cấp',
      deepLearning: {
        status: learningSystem.modelInitialized ? 'active' : 'inactive',
        offlineMode: 'Một số tính năng thông minh vẫn hoạt động offline'
      }
    });
  }
  
  // Lỗi chung
  return res.status(500).json({
    error: 'Mira AI đang gặp sự cố kỹ thuật. Vui lòng thử lại sau.',
    code: 'INTERNAL_ERROR',
    timestamp: new Date().toISOString(),
    creator: 'ABDOL HAMID sẽ sớm khắc phục vấn đề này 🔧',
    deepLearning: {
      status: learningSystem.modelInitialized ? 'active_with_error' : 'inactive',
      fallbackMode: 'Hệ thống đang chạy ở chế độ dự phòng'
    }
  });
}