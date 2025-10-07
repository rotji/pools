// Quick API Test Script
// Run: node test-api-connection.js

const http = require('http');

function testAPI() {
  const options = {
    hostname: 'localhost',
    port: 3003,
    path: '/health',
    method: 'GET'
  };

  const req = http.request(options, (res) => {
    console.log(`Status: ${res.statusCode}`);
    console.log(`Headers: ${JSON.stringify(res.headers)}`);
    
    let data = '';
    res.on('data', (chunk) => {
      data += chunk;
    });
    
    res.on('end', () => {
      console.log('Response Body:', data);
      
      // Test API v1 endpoint
      testGroupsAPI();
    });
  });

  req.on('error', (e) => {
    console.error(`Problem with request: ${e.message}`);
  });

  req.end();
}

function testGroupsAPI() {
  const options = {
    hostname: 'localhost',
    port: 3003,
    path: '/api/v1/groups',
    method: 'GET'
  };

  const req = http.request(options, (res) => {
    console.log(`\nGroups API Status: ${res.statusCode}`);
    
    let data = '';
    res.on('data', (chunk) => {
      data += chunk;
    });
    
    res.on('end', () => {
      console.log('Groups Response:', data);
    });
  });

  req.on('error', (e) => {
    console.error(`Problem with groups request: ${e.message}`);
  });

  req.end();
}

console.log('Testing API connection...');
testAPI();