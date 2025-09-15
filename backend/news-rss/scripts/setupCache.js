// scripts/setupCache.js
// Script để setup và monitor cache system

const axios = require('axios');

class CacheSetupManager {
  constructor(baseUrl = 'http://localhost:8080') {
    this.baseUrl = baseUrl;
    this.isProduction = process.env.NODE_ENV === 'production';
    
    if (this.isProduction) {
      this.baseUrl = 'https://rss-news-production.up.railway.app'; 
    }
  }

  async setupCache() {
    console.log('🚀 Bắt đầu setup enhanced cache system...\n');
    
    try {
      // 1. Kiểm tra server health
      console.log('1. Kiểm tra server health...');
      const healthResponse = await this.checkHealth();
      console.log(`✅ Server healthy: ${healthResponse.message}\n`);

      // 2. Kiểm tra cache performance hiện tại
      console.log('2. Kiểm tra cache performance...');
      const perfResponse = await this.checkCachePerformance();
      console.log(`📊 Cache status: ${perfResponse.performance.status}`);
      console.log(`   Main cache ready: ${perfResponse.performance.mainCache.percentage}%`);
      console.log(`   Backup cache ready: ${perfResponse.performance.backupCache.percentage}%\n`);

      // 3. Thực hiện super wake-up nếu cache performance kém
      if (perfResponse.performance.status !== 'optimal') {
        console.log('3. Thực hiện super wake-up để cải thiện performance...');
        const wakeupResponse = await this.superWakeUp();
        console.log(`✅ Super wake-up completed: ${wakeupResponse.message}\n`);
      } else {
        console.log('3. Cache đã optimal, bỏ qua super wake-up\n');
      }

      // 4. Khởi động background refresh
      console.log('4. Khởi động background refresh...');
      const bgResponse = await this.startBackgroundRefresh();
      console.log(`✅ Background refresh: ${bgResponse.message}\n`);

      // 5. Kiểm tra lại performance sau setup
      console.log('5. Kiểm tra performance sau setup...');
      const finalPerfResponse = await this.checkCachePerformance();
      console.log(`📊 Final cache status: ${finalPerfResponse.performance.status}`);
      console.log(`   Main cache ready: ${finalPerfResponse.performance.mainCache.percentage}%`);
      console.log(`   Backup cache ready: ${finalPerfResponse.performance.backupCache.percentage}%\n`);

      console.log('🎉 Enhanced cache setup hoàn thành thành công!');
      
      return {
        success: true,
        finalStatus: finalPerfResponse.performance.status,
        setupTime: new Date().toISOString()
      };

    } catch (error) {
      console.error('❌ Lỗi khi setup cache:', error.message);
      return {
        success: false,
        error: error.message
      };
    }
  }

  async checkHealth() {
    const response = await axios.get(`${this.baseUrl}/health`, {
      timeout: 10000
    });
    return response.data;
  }

  async checkCachePerformance() {
    const response = await axios.get(`${this.baseUrl}/cache-performance`, {
      timeout: 10000
    });
    return response.data;
  }

  async superWakeUp() {
    const response = await axios.get(`${this.baseUrl}/super-wake-up`, {
      timeout: 30000 // Timeout cao hơn cho super wake-up
    });
    return response.data;
  }

  async startBackgroundRefresh() {
    const response = await axios.post(`${this.baseUrl}/api/background-refresh`, {
      action: 'start'
    }, {
      timeout: 10000
    });
    return response.data;
  }

  async getCacheStats() {
    const response = await axios.get(`${this.baseUrl}/api/cache-status`, {
      timeout: 10000
    });
    return response.data;
  }

  async forceRefreshKey(cacheKey) {
    const response = await axios.post(`${this.baseUrl}/api/refresh-key/${cacheKey}`, {}, {
      timeout: 15000
    });
    return response.data;
  }

  async monitorCache(duration = 60000) {
    console.log(`📊 Bắt đầu monitor cache trong ${duration/1000}s...\n`);
    
    const startTime = Date.now();
    let monitorCount = 0;
    
    const monitorInterval = setInterval(async () => {
      try {
        monitorCount++;
        const perfData = await this.checkCachePerformance();
        const status = perfData.performance.status;
        const mainPercentage = perfData.performance.mainCache.percentage;
        
        console.log(`[${monitorCount}] ${new Date().toISOString().substr(11,8)} - Status: ${status} (${mainPercentage}%)`);
        
        if (Date.now() - startTime >= duration) {
          clearInterval(monitorInterval);
          console.log('\n📊 Monitor cache hoàn thành');
        }
        
      } catch (error) {
        console.error(`❌ Monitor error: ${error.message}`);
      }
    }, 5000); // Kiểm tra mỗi 5s
  }

  async testCacheSpeed() {
    console.log('⚡ Testing cache speed...\n');
    
    const testEndpoints = [
      '/api/rss?limit=20&page=1',
      '/api/rss?limit=15&source=aljazeera',
      '/api/rss?limit=15&source=aboutislam',
      '/api/rss?limit=10&page=1'
    ];
    
    const results = [];
    
    for (const endpoint of testEndpoints) {
      const startTime = Date.now();
      
      try {
        const response = await axios.get(`${this.baseUrl}${endpoint}`, {
          timeout: 10000
        });
        
        const responseTime = Date.now() - startTime;
        const isCached = response.data.cacheInfo ? true : false;
        
        results.push({
          endpoint,
          responseTime,
          isCached,
          status: 'success',
          dataCount: response.data.news?.length || 0
        });
        
        console.log(`✅ ${endpoint}: ${responseTime}ms (cached: ${isCached})`);
        
      } catch (error) {
        results.push({
          endpoint,
          responseTime: Date.now() - startTime,
          status: 'failed',
          error: error.message
        });
        
        console.log(`❌ ${endpoint}: FAILED - ${error.message}`);
      }
      
      // Nghỉ ngắn giữa các test
      await new Promise(resolve => setTimeout(resolve, 500));
    }
    
    const avgResponseTime = results
      .filter(r => r.status === 'success')
      .reduce((sum, r) => sum + r.responseTime, 0) / results.filter(r => r.status === 'success').length;
    
    const cacheHitRate = results
      .filter(r => r.status === 'success' && r.isCached).length / results.filter(r => r.status === 'success').length * 100;
    
    console.log(`\n📊 Test Results:`);
    console.log(`   Average Response Time: ${Math.round(avgResponseTime)}ms`);
    console.log(`   Cache Hit Rate: ${Math.round(cacheHitRate)}%`);
    console.log(`   Success Rate: ${results.filter(r => r.status === 'success').length}/${results.length}`);
    
    return results;
  }
}

// CLI Usage
if (require.main === module) {
  const command = process.argv[2];
  const manager = new CacheSetupManager();
  
  switch (command) {
    case 'setup':
      manager.setupCache();
      break;
      
    case 'monitor':
      const duration = parseInt(process.argv[3]) || 60000;
      manager.monitorCache(duration);
      break;
      
    case 'test':
      manager.testCacheSpeed();
      break;
      
    case 'stats':
      manager.getCacheStats().then(data => {
        console.log(JSON.stringify(data, null, 2));
      });
      break;
      
    default:
      console.log(`
🚀 Enhanced Cache Setup Manager

Commands:
  setup              - Setup complete cache system
  monitor [duration] - Monitor cache for duration (default 60s)
  test              - Test cache speed
  stats             - Show cache statistics

Examples:
  node scripts/setupCache.js setup
  node scripts/setupCache.js monitor 30000
  node scripts/setupCache.js test
      `);
  }
}

module.exports = CacheSetupManager;