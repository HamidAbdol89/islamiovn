// Using built-in fetch (Node.js 18+)

async function testCORS() {
  const baseURL = process.env.BACKEND_URL || 'http://localhost:3000';
  const frontendOrigin = 'https://muslimviet.vercel.app';
  
  console.log('Testing CORS configuration...');
  console.log('Backend URL:', baseURL);
  console.log('Frontend Origin:', frontendOrigin);
  
  try {
    // Test preflight request
    console.log('\n1. Testing preflight request...');
    const preflightResponse = await fetch(`${baseURL}/api/auth/google`, {
      method: 'OPTIONS',
      headers: {
        'Origin': frontendOrigin,
        'Access-Control-Request-Method': 'POST',
        'Access-Control-Request-Headers': 'Content-Type,Authorization'
      }
    });
    
    console.log('Preflight status:', preflightResponse.status);
    console.log('Preflight headers:', {
      'Access-Control-Allow-Origin': preflightResponse.headers.get('Access-Control-Allow-Origin'),
      'Access-Control-Allow-Methods': preflightResponse.headers.get('Access-Control-Allow-Methods'),
      'Access-Control-Allow-Headers': preflightResponse.headers.get('Access-Control-Allow-Headers'),
      'Access-Control-Allow-Credentials': preflightResponse.headers.get('Access-Control-Allow-Credentials')
    });
    
    // Test actual POST request (will fail without valid token, but should not fail on CORS)
    console.log('\n2. Testing actual POST request...');
    const postResponse = await fetch(`${baseURL}/api/auth/google`, {
      method: 'POST',
      headers: {
        'Origin': frontendOrigin,
        'Content-Type': 'application/json',
        'Authorization': 'Bearer invalid-token-for-testing'
      },
      body: JSON.stringify({})
    });
    
    console.log('POST status:', postResponse.status);
    console.log('POST CORS headers:', {
      'Access-Control-Allow-Origin': postResponse.headers.get('Access-Control-Allow-Origin'),
      'Access-Control-Allow-Credentials': postResponse.headers.get('Access-Control-Allow-Credentials')
    });
    
    const responseText = await postResponse.text();
    console.log('Response body:', responseText.substring(0, 200) + '...');
    
  } catch (error) {
    console.error('Test failed:', error.message);
  }
}

testCORS();
