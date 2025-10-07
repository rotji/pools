const http = require('http');

function testEndpoint(path) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'localhost',
      port: 3001,
      path: path,
      method: 'GET'
    };

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          console.log(`✅ GET ${path}`);
          console.log(`Status: ${res.statusCode}`);
          console.log(`Response:`, json);
          console.log('---\n');
          resolve(json);
        } catch (e) {
          console.log(`❌ GET ${path} - Invalid JSON`);
          console.log(data);
          reject(e);
        }
      });
    });

    req.on('error', (err) => {
      console.log(`❌ GET ${path}`);
      console.log(`Error:`, err.message);
      console.log('---\n');
      reject(err);
    });

    req.end();
  });
}

async function runTests() {
  console.log('Testing Backend API endpoints...\n');
  
  try {
    await testEndpoint('/api/health');
    await testEndpoint('/api/groups');
    await testEndpoint('/api/users');
    console.log('✅ All tests completed!');
  } catch (error) {
    console.log('❌ Some tests failed');
  }
}

runTests();