// Simple health check test
console.log('🧪 Testing health endpoint...');

try {
    const response = await fetch('http://localhost:3005/api/health');
    const data = await response.json();
    console.log('✅ Health check successful!');
    console.log('📊 Response:', JSON.stringify(data, null, 2));
} catch (error) {
    console.log('❌ Health check failed:', error.message);
}