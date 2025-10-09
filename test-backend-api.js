// Backend API Test Script
console.log('🧪 Testing Backend API Endpoints...\n');

const API_BASE = 'http://localhost:3005/api';

// Test data for registration
const testUser = {
    username: 'testuser',
    email: 'test@example.com',
    password: 'password123'
};

const testLogin = {
    email: 'test@example.com',
    password: 'password123'
};

async function testEndpoint(name, url, options = {}) {
    try {
        console.log(`🔍 Testing ${name}...`);
        const response = await fetch(url, {
            headers: {
                'Content-Type': 'application/json',
                ...options.headers
            },
            ...options
        });

        const data = await response.text();
        console.log(`✅ ${name}: ${response.status} ${response.statusText}`);
        console.log(`📄 Response: ${data}\n`);
        return { success: true, data, status: response.status };
    } catch (error) {
        console.log(`❌ ${name}: ${error.message}\n`);
        return { success: false, error: error.message };
    }
}

async function runTests() {
    console.log('🚀 Starting Backend API Tests\n');

    // 1. Test Health Check
    await testEndpoint('Health Check', `${API_BASE}/health`);

    // 2. Test Registration
    await testEndpoint('User Registration', `${API_BASE}/auth/register`, {
        method: 'POST',
        body: JSON.stringify(testUser)
    });

    // 3. Test Login
    const loginResult = await testEndpoint('User Login', `${API_BASE}/auth/login`, {
        method: 'POST',
        body: JSON.stringify(testLogin)
    });

    // 4. Test Profile (if login successful)
    if (loginResult.success && loginResult.status === 200) {
        try {
            const tokenMatch = loginResult.data.match(/"token":"([^"]+)"/);
            if (tokenMatch) {
                const token = tokenMatch[1];
                await testEndpoint('User Profile', `${API_BASE}/auth/profile`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
            }
        } catch (error) {
            console.log('⚠️ Could not extract token for profile test');
        }
    }

    // 5. Test Logout
    await testEndpoint('User Logout', `${API_BASE}/auth/logout`, {
        method: 'POST'
    });

    console.log('🎯 Backend API Testing Complete!');
}

// Run the tests
runTests().catch(console.error);