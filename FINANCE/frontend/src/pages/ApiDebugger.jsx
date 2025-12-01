import React, { useState, useEffect } from 'react';
import { AlertCircle, CheckCircle, XCircle, RefreshCw } from 'lucide-react';

const ApiDebugger = () => {
  const [tests, setTests] = useState([]);
  const [loading, setLoading] = useState(false);

  const runTests = async () => {
    setLoading(true);
    const newTests = [];

    // Test 1: Backend connectivity
    try {
      const response = await fetch('/backend-api/test_connection.php');
      const data = await response.json();
      newTests.push({
        name: 'Backend Connection',
        status: response.ok ? 'success' : 'error',
        message: data.message || response.statusText,
        details: data
      });
    } catch (error) {
      newTests.push({
        name: 'Backend Connection',
        status: 'error',
        message: error.message,
      });
    }

    // Test 2: Employees endpoint
    try {
      const response = await fetch('/backend-api/employees/get_employees.php');
      const data = await response.json();
      newTests.push({
        name: 'Employees API',
        status: response.ok ? 'success' : 'error',
        message: `Status: ${response.status}`,
        details: data
      });
    } catch (error) {
      newTests.push({
        name: 'Employees API',
        status: 'error',
        message: error.message,
      });
    }

    // Test 3: Dashboard Sales Metrics
    try {
      const response = await fetch('/backend-api/dashboard/sales_metrics.php');
      const data = await response.json();
      newTests.push({
        name: 'Dashboard Sales Metrics',
        status: response.ok ? 'success' : 'error',
        message: `Status: ${response.status}`,
        details: data
      });
    } catch (error) {
      newTests.push({
        name: 'Dashboard Sales Metrics',
        status: 'error',
        message: error.message,
      });
    }

    // Test 4: Invoices endpoint
    try {
      const response = await fetch('/backend-api/invoices/get_invoices.php');
      const data = await response.json();
      newTests.push({
        name: 'Invoices API',
        status: response.ok ? 'success' : 'error',
        message: `Status: ${response.status}`,
        details: data
      });
    } catch (error) {
      newTests.push({
        name: 'Invoices API',
        status: 'error',
        message: error.message,
      });
    }

    // Test 5: Payments endpoint
    try {
      const response = await fetch('/backend-api/payments/get_payments.php');
      const data = await response.json();
      newTests.push({
        name: 'Payments API',
        status: response.ok ? 'success' : 'error',
        message: `Status: ${response.status}`,
        details: data
      });
    } catch (error) {
      newTests.push({
        name: 'Payments API',
        status: 'error',
        message: error.message,
      });
    }

    setTests(newTests);
    setLoading(false);
  };

  useEffect(() => {
    runTests();
  }, []);

  const getStatusIcon = (status) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'error':
        return <XCircle className="h-5 w-5 text-red-500" />;
      default:
        return <AlertCircle className="h-5 w-5 text-yellow-500" />;
    }
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">API Debugger</h1>
          <p className="text-gray-600">Test your backend API connectivity and endpoints</p>
        </div>

        <button
          onClick={runTests}
          disabled={loading}
          className="mb-6 inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
        >
          <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
          {loading ? 'Testing...' : 'Run Tests'}
        </button>

        <div className="space-y-4">
          {tests.map((test, idx) => (
            <div key={idx} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0">
                  {getStatusIcon(test.status)}
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900">{test.name}</h3>
                  <p className="text-sm text-gray-600 mt-1">{test.message}</p>
                  
                  {test.details && (
                    <div className="mt-4 bg-gray-50 rounded p-3 text-xs font-mono overflow-auto max-h-48">
                      <pre>{JSON.stringify(test.details, null, 2)}</pre>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {tests.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">Click "Run Tests" to check API connectivity</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ApiDebugger;
