import { useState } from 'react';

export default function Debug() {
  const [testResult, setTestResult] = useState('');
  const [loading, setLoading] = useState(false);

  const testBackendConnection = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api');
      const data = await res.text();
      setTestResult(`Backend connection: ${res.status} - ${data}`);
    } catch (error) {
      setTestResult(`Backend connection error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const testSignup = async () => {
    setLoading(true);
    try {
      const testUser = {
        username: `test${Math.floor(Math.random() * 10000)}`,
        email: `test${Math.floor(Math.random() * 10000)}@test.com`,
        password: 'password123',
        mobile: '1234567890'
      };
      
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(testUser),
      });
      
      const data = await res.json();
      setTestResult(`Signup test: ${res.status} - ${JSON.stringify(data)}`);
    } catch (error) {
      setTestResult(`Signup test error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const testSignin = async () => {
    setLoading(true);
    try {
      const testUser = {
        email: 'test@test.com',
        password: 'password123',
      };
      
      const res = await fetch('/api/auth/signin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(testUser),
      });
      
      const data = await res.json();
      setTestResult(`Signin test: ${res.status} - ${JSON.stringify(data)}`);
    } catch (error) {
      setTestResult(`Signin test error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 max-w-md mx-auto bg-white shadow-md rounded-lg">
      <h1 className="text-2xl font-bold mb-6">Debug Page</h1>
      
      <div className="space-y-4">
        <button
          onClick={testBackendConnection}
          disabled={loading}
          className="w-full py-2 px-4 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-blue-300"
        >
          {loading ? 'Testing...' : 'Test Backend Connection'}
        </button>
        
        <button
          onClick={testSignup}
          disabled={loading}
          className="w-full py-2 px-4 bg-green-500 text-white rounded hover:bg-green-600 disabled:bg-green-300"
        >
          {loading ? 'Testing...' : 'Test Signup'}
        </button>
        
        <button
          onClick={testSignin}
          disabled={loading}
          className="w-full py-2 px-4 bg-purple-500 text-white rounded hover:bg-purple-600 disabled:bg-purple-300"
        >
          {loading ? 'Testing...' : 'Test Signin'}
        </button>
      </div>
      
      {testResult && (
        <div className="mt-6 p-4 bg-gray-100 rounded-md overflow-auto max-h-60">
          <pre className="text-sm whitespace-pre-wrap">{testResult}</pre>
        </div>
      )}
    </div>
  );
} 