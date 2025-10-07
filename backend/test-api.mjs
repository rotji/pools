// Simple API test script
console.log('Testing Backend API endpoints...\n');

const baseURL = 'http://localhost:3001';

async function testEndpoint(endpoint, method = 'GET', body = null) {
  try {
    const options = {
      method,
      headers: {
        'Content-Type': 'application/json'
      }
    };
    
    if (body) {
      options.body = JSON.stringify(body);
    }

    const response = await fetch(`${baseURL}${endpoint}`, options);
    const data = await response.json();
    
    console.log(`✅ ${method} ${endpoint}`);
    console.log(`Status: ${response.status}`);
    console.log(`Response:`, data);
    console.log('---\n');
  } catch (error) {
    console.log(`❌ ${method} ${endpoint}`);
    console.log(`Error:`, error.message);
    console.log('---\n');
  }
}

async function runTests() {
  // Test health endpoint
  await testEndpoint('/api/health');
  
  // Test groups endpoint
  await testEndpoint('/api/groups');
  
  // Test users endpoint
  await testEndpoint('/api/users');
  
  // Test creating a user
  await testEndpoint('/api/users', 'POST', {
    walletAddress: 'SP2J6ZY48GV1EZ5V2V5RB9MP66SW86PYKKNRV9EJ7',
    displayName: 'Test User'
  });
}

runTests();