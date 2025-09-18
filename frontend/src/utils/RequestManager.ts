// Professional Request Manager with Rate Limiting, Circuit Breaker, and Exponential Backoff
import { devLog } from './performance';

interface QueuedRequest {
  id: string;
  request: () => Promise<any>;
  resolve: (value: any) => void;
  reject: (error: any) => void;
  retryCount: number;
  priority: 'high' | 'normal' | 'low';
  timestamp: number;
}

interface CircuitBreakerState {
  failures: number;
  lastFailureTime: number;
  state: 'closed' | 'open' | 'half-open';
}

class RequestManager {
  private queue: QueuedRequest[] = [];
  private processing = false;
  private requestCount = 0;
  private windowStart = Date.now();
  private circuitBreaker: CircuitBreakerState = {
    failures: 0,
    lastFailureTime: 0,
    state: 'closed'
  };

  // Configuration
  private readonly MAX_REQUESTS_PER_MINUTE = 15;
  // private readonly MAX_CONCURRENT_REQUESTS = 3; // Reserved for future use
  private readonly CIRCUIT_BREAKER_THRESHOLD = 5;
  private readonly CIRCUIT_BREAKER_TIMEOUT = 30000; // 30 seconds
  private readonly MAX_RETRIES = 3;

  private activeRequests = new Set<string>();
  // private requestHistory = new Map<string, number>(); // Reserved for analytics

  /**
   * Add request to queue with deduplication
   */
  async enqueue<T>(
    requestId: string,
    requestFn: () => Promise<T>,
    priority: 'high' | 'normal' | 'low' = 'normal'
  ): Promise<T> {
    // Check circuit breaker
    if (this.circuitBreaker.state === 'open') {
      const timeSinceLastFailure = Date.now() - this.circuitBreaker.lastFailureTime;
      if (timeSinceLastFailure < this.CIRCUIT_BREAKER_TIMEOUT) {
        throw new Error('Circuit breaker is open. Service temporarily unavailable.');
      } else {
        this.circuitBreaker.state = 'half-open';
      }
    }

    // Deduplication - if same request is already in queue or processing
    if (this.activeRequests.has(requestId)) {
      devLog.warn(`🔄 Request ${requestId} already in progress. Skipping duplicate.`);
      throw new Error('Duplicate request detected');
    }

    // Rate limiting check
    if (!this.canMakeRequest()) {
      throw new Error('Rate limit exceeded. Please wait before making more requests.');
    }

    return new Promise<T>((resolve, reject) => {
      const queuedRequest: QueuedRequest = {
        id: requestId,
        request: requestFn,
        resolve,
        reject,
        retryCount: 0,
        priority,
        timestamp: Date.now()
      };

      // Insert based on priority
      this.insertByPriority(queuedRequest);
      this.activeRequests.add(requestId);
      
      devLog.log();
      
      // Start processing if not already running
      if (!this.processing) {
        this.processQueue();
      }
    });
  }

  /**
   * Check if we can make a request based on rate limiting
   */
  private canMakeRequest(): boolean {
    const now = Date.now();
    const timeWindow = 60000; // 1 minute

    // Reset counter if window has passed
    if (now - this.windowStart > timeWindow) {
      this.requestCount = 0;
      this.windowStart = now;
    }

    return this.requestCount < this.MAX_REQUESTS_PER_MINUTE;
  }

  /**
   * Insert request into queue based on priority
   */
  private insertByPriority(request: QueuedRequest): void {
    const priorityOrder = { high: 0, normal: 1, low: 2 };
    
    let insertIndex = this.queue.length;
    for (let i = 0; i < this.queue.length; i++) {
      if (priorityOrder[request.priority] < priorityOrder[this.queue[i].priority]) {
        insertIndex = i;
        break;
      }
    }
    
    this.queue.splice(insertIndex, 0, request);
  }

  /**
   * Process the request queue
   */
  private async processQueue(): Promise<void> {
    if (this.processing || this.queue.length === 0) {
      return;
    }

    this.processing = true;
    devLog.log(`🔄 Processing queue (${this.queue.length} requests)`);

    while (this.queue.length > 0) {
      const request = this.queue.shift()!;
      
      try {
        await this.executeRequest(request);
      } catch (error) {
        devLog.error(`❌ Request ${request.id} failed:`, error);
      }

      // Small delay between requests to avoid overwhelming server
      await this.delay(200);
    }

    this.processing = false;
    devLog.log('✅ Queue processing completed');
  }

  /**
   * Execute a single request with retry logic
   */
  private async executeRequest(request: QueuedRequest): Promise<void> {
    try {
      // Increment request count for rate limiting
      this.requestCount++;
      
      devLog.log(`🚀 Executing request: ${request.id} (Attempt ${request.retryCount + 1})`);
      
      const result = await request.request();
      
      // Success - reset circuit breaker if it was in half-open state
      if (this.circuitBreaker.state === 'half-open') {
        this.circuitBreaker.state = 'closed';
        this.circuitBreaker.failures = 0;
        devLog.log('🔧 Circuit breaker reset to closed state');
      }
      
      request.resolve(result);
      this.activeRequests.delete(request.id);
      
    } catch (error: any) {
      if (error.status === 429) {
        devLog.warn('Rate limit reached');
        // toast.warning('Đang đồng bộ quá nhanh. Vui lòng chờ một chút.', {
        //   duration: 2000
        // });
        request.reject(new Error('Rate limit exceeded. Please wait before making more requests.'));
        this.activeRequests.delete(request.id);
        return;
      }
      await this.handleRequestError(request, error);
    }
  }

  /**
   * Handle request errors with exponential backoff and circuit breaker
   */
  private async handleRequestError(request: QueuedRequest, error: any): Promise<void> {
    // Better 429 error detection
    const is429Error = error.message?.includes('429') || 
                      error.message?.includes('Too Many Requests') ||
                      error.status === 429;
    const is5xxError = error.status >= 500 && error.status < 600;

    devLog.error(`🔍 Error analysis for ${request.id}:`, {
      message: error.message,
      status: error.status,
      is429Error,
      is5xxError,
      retryCount: request.retryCount
    });

    // Update circuit breaker for server errors
    if (is5xxError || is429Error) {
      this.circuitBreaker.failures++;
      this.circuitBreaker.lastFailureTime = Date.now();
      
      if (this.circuitBreaker.failures >= this.CIRCUIT_BREAKER_THRESHOLD) {
        this.circuitBreaker.state = 'open';
        devLog.warn('🚨 Circuit breaker opened due to repeated failures');
      }
    }

    // For 429 errors, don't retry - just fail immediately to prevent spam
    if (is429Error) {
      devLog.warn(`🛑 Rate limit hit for ${request.id} - failing immediately to prevent spam`);
      request.reject(new Error('Rate limit exceeded. Please wait before making more requests.'));
      this.activeRequests.delete(request.id);
      return;
    }

    // Retry logic with exponential backoff (only for 5xx errors, not 429)
    if (request.retryCount < this.MAX_RETRIES && is5xxError) {
      request.retryCount++;
      
      // Exponential backoff: 2s, 4s, 8s...
      const backoffDelay = Math.min(2000 * Math.pow(2, request.retryCount - 1), 15000);
      
      devLog.warn(`⏳ Retrying request ${request.id} in ${backoffDelay}ms (Attempt ${request.retryCount}/${this.MAX_RETRIES})`);
      
      // Re-queue with delay
      setTimeout(() => {
        this.queue.unshift(request); // Add to front of queue for retry
        if (!this.processing) {
          this.processQueue();
        }
      }, backoffDelay);
      
    } else {
      // Max retries reached or non-retryable error
      devLog.error(`💥 Request ${request.id} failed permanently:`, error);
      request.reject(error);
      this.activeRequests.delete(request.id);
    }
  }

  /**
   * Utility function for delays
   */
  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Get current queue status
   */
  getStatus() {
    return {
      queueLength: this.queue.length,
      activeRequests: this.activeRequests.size,
      requestCount: this.requestCount,
      circuitBreakerState: this.circuitBreaker.state,
      processing: this.processing
    };
  }

  /**
   * Clear all pending requests (emergency stop)
   */
  clearQueue(): void {
    this.queue.forEach(request => {
      request.reject(new Error('Request cancelled - queue cleared'));
      this.activeRequests.delete(request.id);
    });
    this.queue = [];
    this.processing = false;
    devLog.warn('🧹 Request queue cleared');
  }
}

// Singleton instance
export const requestManager = new RequestManager();

// Convenience function for making managed requests
export async function makeRequest<T>(
  requestId: string,
  requestFn: () => Promise<T>,
  priority: 'high' | 'normal' | 'low' = 'normal'
): Promise<T> {
  return requestManager.enqueue(requestId, requestFn, priority);
}

export default RequestManager;
