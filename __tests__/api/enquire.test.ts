/**
 * Enquiry API Tests
 * Tests for /api/enquire endpoint
 * Run with: npm test -- enquire.test.ts
 */

const API_URL = 'http://localhost:3002/api/enquire';

interface TestCase {
  name: string;
  data: any;
  expectedStatus: number;
  shouldSucceed: boolean;
  description?: string;
}

const testCases: TestCase[] = [
  // ✅ Success Cases
  {
    name: 'Valid enquiry with all fields',
    data: {
      name: 'Rajesh Kumar',
      email: 'rajesh@example.com',
      phone: '+91-9800000001',
      interest: 'Plotted Development',
      message: 'I am interested in a 2-acre plot in STAAR CITY.',
    },
    expectedStatus: 201,
    shouldSucceed: true,
    description: 'Complete enquiry with all required and optional fields',
  },
  {
    name: 'Valid enquiry without message',
    data: {
      name: 'Priya Sharma',
      email: 'priya.sharma@business.com',
      phone: '9876543210',
      interest: 'Investment Opportunity',
      message: '',
    },
    expectedStatus: 201,
    shouldSucceed: true,
    description: 'Valid enquiry without optional message field',
  },
  {
    name: 'Valid enquiry with different interest',
    data: {
      name: 'Amit Patel',
      email: 'amit@company.in',
      phone: '(+91) 98-0000-0002',
      interest: 'Site Visit',
      message: 'Would like to visit the project site this weekend.',
    },
    expectedStatus: 201,
    shouldSucceed: true,
    description: 'Valid enquiry with different interest option',
  },

  // ❌ Validation Failures
  {
    name: 'Missing name',
    data: {
      name: '',
      email: 'test@example.com',
      phone: '9876543210',
      interest: 'Plotted Development',
      message: 'Test message',
    },
    expectedStatus: 422,
    shouldSucceed: false,
    description: 'Should reject enquiry with empty name',
  },
  {
    name: 'Missing email',
    data: {
      name: 'John Doe',
      email: '',
      phone: '9876543210',
      interest: 'Plotted Development',
      message: 'Test message',
    },
    expectedStatus: 422,
    shouldSucceed: false,
    description: 'Should reject enquiry with empty email',
  },
  {
    name: 'Missing phone',
    data: {
      name: 'John Doe',
      email: 'john@example.com',
      phone: '',
      interest: 'Plotted Development',
      message: 'Test message',
    },
    expectedStatus: 422,
    shouldSucceed: false,
    description: 'Should reject enquiry with empty phone',
  },
  {
    name: 'Invalid email format',
    data: {
      name: 'John Doe',
      email: 'invalid-email',
      phone: '9876543210',
      interest: 'Plotted Development',
      message: 'Test message',
    },
    expectedStatus: 422,
    shouldSucceed: false,
    description: 'Should reject invalid email format',
  },
  {
    name: 'Invalid email with no @',
    data: {
      name: 'John Doe',
      email: 'johnexample.com',
      phone: '9876543210',
      interest: 'Plotted Development',
      message: 'Test message',
    },
    expectedStatus: 422,
    shouldSucceed: false,
    description: 'Should reject email without @ symbol',
  },
  {
    name: 'Phone too short',
    data: {
      name: 'John Doe',
      email: 'john@example.com',
      phone: '12345',
      interest: 'Plotted Development',
      message: 'Test message',
    },
    expectedStatus: 422,
    shouldSucceed: false,
    description: 'Should reject phone with less than 10 digits',
  },
  {
    name: 'Name with only spaces',
    data: {
      name: '   ',
      email: 'john@example.com',
      phone: '9876543210',
      interest: 'Plotted Development',
      message: 'Test message',
    },
    expectedStatus: 422,
    shouldSucceed: false,
    description: 'Should reject name with only whitespace',
  },

  // ❌ Format Errors
  {
    name: 'Invalid JSON',
    data: '{invalid json}',
    expectedStatus: 400,
    shouldSucceed: false,
    description: 'Should reject invalid JSON format',
  },
  {
    name: 'Missing required fields',
    data: {
      name: 'John Doe',
      email: 'john@example.com',
    },
    expectedStatus: 422,
    shouldSucceed: false,
    description: 'Should reject when missing required fields',
  },
];

// Test runner
async function runTests() {
  console.log('\n🚀 Starting Enquiry API Tests...\n');
  console.log(`📍 Testing endpoint: ${API_URL}\n`);
  console.log('═'.repeat(80));

  let passed = 0;
  let failed = 0;

  for (const testCase of testCases) {
    try {
      let payload: string;

      if (typeof testCase.data === 'string') {
        payload = testCase.data;
      } else {
        payload = JSON.stringify(testCase.data);
      }

      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: payload,
      });

      const result = await response.json();
      const statusMatch = response.status === testCase.expectedStatus;
      const successMatch =
        testCase.shouldSucceed === (response.status >= 200 && response.status < 300);

      const testPassed = statusMatch && successMatch;

      if (testPassed) {
        console.log(`✅ PASS: ${testCase.name}`);
        if (testCase.description) {
          console.log(`   └─ ${testCase.description}`);
        }
        console.log(
          `   └─ Status: ${response.status}, Response: ${result.message || result.error || 'Success'}`
        );
        passed++;
      } else {
        console.log(`❌ FAIL: ${testCase.name}`);
        if (testCase.description) {
          console.log(`   └─ ${testCase.description}`);
        }
        console.log(`   └─ Expected Status: ${testCase.expectedStatus}, Got: ${response.status}`);
        console.log(`   └─ Response: ${JSON.stringify(result)}`);
        failed++;
      }
    } catch (error) {
      console.log(`❌ ERROR: ${testCase.name}`);
      console.log(
        `   └─ ${error instanceof Error ? error.message : 'Unknown error'}`
      );
      failed++;
    }

    console.log('─'.repeat(80));
  }

  console.log('\n📊 Test Results Summary:\n');
  console.log(`  Total Tests: ${passed + failed}`);
  console.log(`  ✅ Passed: ${passed}`);
  console.log(`  ❌ Failed: ${failed}`);
  console.log(`  Success Rate: ${(passed / (passed + failed) * 100).toFixed(1)}%\n`);

  if (failed === 0) {
    console.log('🎉 All tests passed!\n');
    process.exit(0);
  } else {
    console.log(`⚠️  ${failed} test(s) failed.\n`);
    process.exit(1);
  }
}

// Run tests if server is available
async function checkServerAndRun() {
  try {
    await fetch(API_URL, {
      method: 'OPTIONS',
    });
    runTests();
  } catch (error) {
    console.error('❌ Error: Cannot connect to API server');
    console.error('Make sure the dev server is running: npm run dev');
    process.exit(1);
  }
}

checkServerAndRun();
