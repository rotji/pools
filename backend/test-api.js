// Quick API test
fetch('http://localhost:3001/api/health')
  .then(res => res.json())
  .then(data => console.log('Health Check:', data))
  .catch(err => console.error('Error:', err));

fetch('http://localhost:3001/api/groups')
  .then(res => res.json()) 
  .then(data => console.log('Groups:', data))
  .catch(err => console.error('Error:', err));