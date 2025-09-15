// Debug script để test đồng bộ dữ liệu
// Chạy script này trong browser console

console.log('🔍 Testing Data Sync...');

// Test 1: Kiểm tra local storage
function testLocalStorage() {
    console.log('\n📦 Testing Local Storage...');
    
    const bookmarks = JSON.parse(localStorage.getItem('muslimviet_bookmarks') || '[]');
    const favorites = JSON.parse(localStorage.getItem('muslimviet_favorites') || '[]');
    
    console.log(`Bookmarks: ${bookmarks.length}`);
    console.log(`Favorites: ${favorites.length}`);
    
    if (bookmarks.length > 0) {
        console.log('Sample bookmark:', bookmarks[0]);
    }
    
    if (favorites.length > 0) {
        console.log('Sample favorite:', favorites[0]);
    }
    
    return { bookmarks, favorites };
}

// Test 2: Kiểm tra auth state
function testAuthState() {
    console.log('\n🔐 Testing Auth State...');
    
    const jwtToken = localStorage.getItem('muslimviet_jwt_token');
    const googleToken = localStorage.getItem('muslimviet_google_token');
    
    console.log(`JWT Token: ${jwtToken ? 'exists' : 'missing'}`);
    console.log(`Google Token: ${googleToken ? 'exists' : 'missing'}`);
    
    return { jwtToken, googleToken };
}

// Test 3: Tạo dữ liệu test
function createTestData() {
    console.log('\n➕ Creating Test Data...');
    
    const testBookmark = {
        id: `test_bookmark_${Date.now()}`,
        type: 'hadith',
        itemId: '999',
        title: 'Test Hadith Bookmark',
        content: 'This is a test hadith bookmark for sync testing',
        category: 'Test Category',
        isPublic: false,
        createdAt: new Date().toISOString()
    };
    
    const testFavorite = {
        id: `test_favorite_${Date.now()}`,
        type: 'hadith',
        itemId: '888',
        title: 'Test Hadith Favorite',
        content: 'This is a test hadith favorite for sync testing',
        isPublic: false,
        createdAt: new Date().toISOString()
    };
    
    // Add to local storage
    const bookmarks = JSON.parse(localStorage.getItem('muslimviet_bookmarks') || '[]');
    const favorites = JSON.parse(localStorage.getItem('muslimviet_favorites') || '[]');
    
    bookmarks.push(testBookmark);
    favorites.push(testFavorite);
    
    localStorage.setItem('muslimviet_bookmarks', JSON.stringify(bookmarks));
    localStorage.setItem('muslimviet_favorites', JSON.stringify(favorites));
    
    console.log('✅ Test data created');
    console.log('Bookmarks:', bookmarks.length);
    console.log('Favorites:', favorites.length);
    
    return { testBookmark, testFavorite };
}

// Test 4: Simulate sync
async function simulateSync() {
    console.log('\n🔄 Simulating Sync...');
    
    const bookmarks = JSON.parse(localStorage.getItem('muslimviet_bookmarks') || '[]');
    const favorites = JSON.parse(localStorage.getItem('muslimviet_favorites') || '[]');
    
    console.log(`Syncing ${bookmarks.length} bookmarks and ${favorites.length} favorites...`);
    
    // Simulate API calls
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Clear local data after sync
    localStorage.setItem('muslimviet_bookmarks', '[]');
    localStorage.setItem('muslimviet_favorites', '[]');
    
    console.log('✅ Sync completed - local data cleared');
}

// Test 5: Kiểm tra React Query cache
function testReactQueryCache() {
    console.log('\n🗄️ Testing React Query Cache...');
    
    // Check if React Query DevTools is available
    if (window.__REACT_QUERY_DEVTOOLS_GLOBAL_HOOK__) {
        console.log('React Query DevTools detected');
    } else {
        console.log('React Query DevTools not detected');
    }
    
    // Check for query cache in window
    if (window.queryClient) {
        console.log('Query client found in window');
        const cache = window.queryClient.getQueryCache();
        console.log('Cache size:', cache.getAll().length);
    } else {
        console.log('Query client not found in window');
    }
}

// Test 6: Kiểm tra network requests
function testNetworkRequests() {
    console.log('\n🌐 Testing Network Requests...');
    
    // Override fetch to log requests
    const originalFetch = window.fetch;
    window.fetch = function(...args) {
        console.log('🌐 Fetch request:', args[0]);
        return originalFetch.apply(this, args);
    };
    
    console.log('✅ Fetch interceptor installed');
}

// Main test function
async function runAllTests() {
    console.log('🚀 Starting Data Sync Tests...\n');
    
    try {
        // Test 1: Local storage
        const localData = testLocalStorage();
        
        // Test 2: Auth state
        const authState = testAuthState();
        
        // Test 3: Create test data
        const testData = createTestData();
        
        // Test 4: Simulate sync
        await simulateSync();
        
        // Test 5: React Query cache
        testReactQueryCache();
        
        // Test 6: Network requests
        testNetworkRequests();
        
        console.log('\n✅ All tests completed!');
        console.log('\n📋 Summary:');
        console.log(`- Local bookmarks: ${localData.bookmarks.length}`);
        console.log(`- Local favorites: ${localData.favorites.length}`);
        console.log(`- JWT token: ${authState.jwtToken ? 'exists' : 'missing'}`);
        console.log(`- Google token: ${authState.googleToken ? 'exists' : 'missing'}`);
        
    } catch (error) {
        console.error('❌ Test failed:', error);
    }
}

// Export functions for manual testing
window.testDataSync = {
    testLocalStorage,
    testAuthState,
    createTestData,
    simulateSync,
    testReactQueryCache,
    testNetworkRequests,
    runAllTests
};

console.log('🔧 Test functions available:');
console.log('- testDataSync.runAllTests() - Run all tests');
console.log('- testDataSync.testLocalStorage() - Test local storage');
console.log('- testDataSync.createTestData() - Create test data');
console.log('- testDataSync.simulateSync() - Simulate sync');

// Auto-run tests
runAllTests();
