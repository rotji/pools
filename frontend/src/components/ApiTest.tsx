/**
 * Simple API Test Component
 * Basic component to test frontend-backend integration
 */

import React, { useState } from 'react';

const ApiTest: React.FC = () => {
  const [status, setStatus] = useState<string>('Ready to test');
  const [results, setResults] = useState<string[]>([]);

  const addResult = (message: string) => {
    setResults(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`]);
  };

  const testBasicFetch = async () => {
    setStatus('Testing...');
    try {
      const response = await fetch('http://localhost:3003/health');
      const data = await response.json();
      addResult(`✅ Health check successful: ${JSON.stringify(data)}`);
      setStatus('Test completed');
    } catch (error) {
      addResult(`❌ Health check failed: ${error}`);
      setStatus('Test failed');
    }
  };

  const testApiEndpoint = async () => {
    setStatus('Testing API...');
    try {
      const response = await fetch('http://localhost:3003/api/v1/health');
      const data = await response.json();
      addResult(`✅ API Health check successful: ${JSON.stringify(data)}`);
      setStatus('API test completed');
    } catch (error) {
      addResult(`❌ API Health check failed: ${error}`);
      setStatus('API test failed');
    }
  };

  const testGroups = async () => {
    setStatus('Testing Groups API...');
    try {
      const response = await fetch('http://localhost:3003/api/v1/groups');
      const data = await response.json();
      addResult(`✅ Groups endpoint: Found ${data.data?.groups?.length || 0} groups`);
    } catch (error) {
      addResult(`❌ Groups test failed: ${error}`);
    }
  };

  return (
    <div style={{ 
      padding: '20px', 
      maxWidth: '800px', 
      margin: '0 auto',
      backgroundColor: '#f0f8ff',
      minHeight: '100vh'
    }}>
      <h1 style={{ 
        color: 'white',
        textAlign: 'center',
        backgroundColor: '#007bff',
        padding: '20px',
        borderRadius: '8px',
        marginBottom: '20px'
      }}>
        🔌 API Integration Test
      </h1>
      
      <div style={{ 
        backgroundColor: 'white',
        padding: '15px',
        borderRadius: '8px',
        marginBottom: '20px',
        border: '2px solid #007bff'
      }}>
        <h2>Status: {status}</h2>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <button onClick={testBasicFetch} style={{ margin: '5px', padding: '8px 16px' }}>
          Test Health
        </button>
        <button onClick={testApiEndpoint} style={{ margin: '5px', padding: '8px 16px' }}>
          Test API Health
        </button>
        <button onClick={testGroups} style={{ margin: '5px', padding: '8px 16px' }}>
          Test Groups
        </button>
        <button onClick={() => setResults([])} style={{ margin: '5px', padding: '8px 16px' }}>
          Clear Results
        </button>
      </div>

      <h3>Results:</h3>
      <div style={{ 
        height: '300px', 
        overflow: 'auto', 
        border: '1px solid #ccc', 
        padding: '10px',
        backgroundColor: '#f9f9f9'
      }}>
        {results.map((result, index) => (
          <div key={index} style={{ marginBottom: '5px', fontFamily: 'monospace', fontSize: '14px' }}>
            {result}
          </div>
        ))}
        {results.length === 0 && (
          <div style={{ color: '#666', fontStyle: 'italic' }}>
            Click a test button to see results...
          </div>
        )}
      </div>

      <div style={{ marginTop: '20px', fontSize: '12px', color: '#666' }}>
        <p>Backend should be running on: http://localhost:3003</p>
        <p>Frontend running on: http://localhost:5173</p>
      </div>
    </div>
  );
};

export default ApiTest;