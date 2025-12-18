// testAPI.js - Script để test các API endpoints
const axios = require('axios');

const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:5000/api';
let adminToken = '';

// Colors for console
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
};

const log = {
  success: (msg) => console.log(`${colors.green}✅ ${msg}${colors.reset}`),
  error: (msg) => console.log(`${colors.red}❌ ${msg}${colors.reset}`),
  info: (msg) => console.log(`${colors.blue}ℹ️  ${msg}${colors.reset}`),
  warn: (msg) => console.log(`${colors.yellow}⚠️  ${msg}${colors.reset}`),
};

// Test functions
async function testHealthCheck() {
  try {
    log.info('Testing Health Check...');
    const response = await axios.get('http://localhost:5000/');
    if (response.status === 200) {
      log.success('Health Check: OK');
      return true;
    }
  } catch (error) {
    log.error(`Health Check failed: ${error.message}`);
    return false;
  }
}

async function testStoneTypes() {
  try {
    log.info('Testing Stone Types API...');
    const response = await axios.get(`${API_BASE_URL}/stone-types`);
    if (response.status === 200 && response.data.success) {
      log.success(`Stone Types: OK (${response.data.data?.length || 0} types)`);
      return true;
    }
  } catch (error) {
    log.error(`Stone Types failed: ${error.message}`);
    return false;
  }
}

async function testWallPositions() {
  try {
    log.info('Testing Wall Positions API...');
    const response = await axios.get(`${API_BASE_URL}/wall-positions`);
    if (response.status === 200 && response.data.success) {
      log.success(`Wall Positions: OK (${response.data.data?.length || 0} positions)`);
      return true;
    }
  } catch (error) {
    log.error(`Wall Positions failed: ${error.message}`);
    return false;
  }
}

async function testInteriorImages() {
  try {
    log.info('Testing Interior Images API...');
    const response = await axios.get(`${API_BASE_URL}/interior-images`);
    if (response.status === 200 && response.data.success) {
      log.success(`Interior Images: OK (${response.data.data?.length || 0} images)`);
      return true;
    }
  } catch (error) {
    log.error(`Interior Images failed: ${error.message}`);
    return false;
  }
}

async function testSearch() {
  try {
    log.info('Testing Search API...');
    const response = await axios.get(`${API_BASE_URL}/search?q=thạch anh`);
    if (response.status === 200 && response.data.success) {
      log.success(`Search: OK (${response.data.data?.length || 0} results)`);
      return true;
    }
  } catch (error) {
    log.error(`Search failed: ${error.message}`);
    return false;
  }
}

async function testAdminLogin() {
  try {
    log.info('Testing Admin Login...');
    const response = await axios.post(`${API_BASE_URL}/admin/login`, {
      email: 'admin@tndgranite.com',
      password: 'admin123'
    });
    if (response.status === 200 && response.data.success && response.data.token) {
      adminToken = response.data.token;
      log.success('Admin Login: OK');
      return true;
    }
  } catch (error) {
    log.error(`Admin Login failed: ${error.response?.data?.message || error.message}`);
    log.warn('Make sure admin account exists. Run: npm run seed');
    return false;
  }
}

async function testAdminMe() {
  if (!adminToken) {
    log.warn('Skipping Admin Me test (no token)');
    return false;
  }
  try {
    log.info('Testing Admin Me API...');
    const response = await axios.get(`${API_BASE_URL}/admin/me`, {
      headers: { Authorization: `Bearer ${adminToken}` }
    });
    if (response.status === 200 && response.data.success) {
      log.success(`Admin Me: OK (${response.data.data?.email})`);
      return true;
    }
  } catch (error) {
    log.error(`Admin Me failed: ${error.response?.data?.message || error.message}`);
    return false;
  }
}

async function testAdminImages() {
  if (!adminToken) {
    log.warn('Skipping Admin Images test (no token)');
    return false;
  }
  try {
    log.info('Testing Admin Images API...');
    const response = await axios.get(`${API_BASE_URL}/admin/images`, {
      headers: { Authorization: `Bearer ${adminToken}` }
    });
    if (response.status === 200 && response.data.success) {
      log.success(`Admin Images: OK (${response.data.data?.length || 0} images)`);
      return true;
    }
  } catch (error) {
    log.error(`Admin Images failed: ${error.response?.data?.message || error.message}`);
    return false;
  }
}

async function testUnauthorizedAccess() {
  try {
    log.info('Testing Unauthorized Access...');
    try {
      await axios.get(`${API_BASE_URL}/admin/images`);
      log.error('Unauthorized Access: FAILED (should return 401)');
      return false;
    } catch (error) {
      if (error.response?.status === 401) {
        log.success('Unauthorized Access: OK (401 as expected)');
        return true;
      }
      log.error(`Unauthorized Access: Unexpected error - ${error.message}`);
      return false;
    }
  } catch (error) {
    log.error(`Unauthorized Access test failed: ${error.message}`);
    return false;
  }
}

// Main test runner
async function runTests() {
  console.log('\n' + '='.repeat(50));
  console.log('🧪 API TEST SUITE - TND Granite Backend');
  console.log('='.repeat(50) + '\n');

  const results = {
    passed: 0,
    failed: 0,
    skipped: 0,
  };

  // Public API Tests
  const publicTests = [
    { name: 'Health Check', fn: testHealthCheck },
    { name: 'Stone Types', fn: testStoneTypes },
    { name: 'Wall Positions', fn: testWallPositions },
    { name: 'Interior Images', fn: testInteriorImages },
    { name: 'Search', fn: testSearch },
  ];

  console.log('📋 Testing Public APIs...\n');
  for (const test of publicTests) {
    const result = await test.fn();
    if (result) results.passed++;
    else results.failed++;
    await new Promise(resolve => setTimeout(resolve, 500)); // Small delay
  }

  console.log('\n📋 Testing Admin APIs...\n');
  
  // Admin Login (required for other admin tests)
  const loginResult = await testAdminLogin();
  if (loginResult) {
    results.passed++;
  } else {
    results.failed++;
    results.skipped += 2; // Skip admin tests if login fails
  }

  if (loginResult) {
    const adminTests = [
      { name: 'Admin Me', fn: testAdminMe },
      { name: 'Admin Images', fn: testAdminImages },
    ];

    for (const test of adminTests) {
      const result = await test.fn();
      if (result) results.passed++;
      else results.failed++;
      await new Promise(resolve => setTimeout(resolve, 500));
    }
  }

  // Security Test
  console.log('\n🔒 Testing Security...\n');
  const securityResult = await testUnauthorizedAccess();
  if (securityResult) results.passed++;
  else results.failed++;

  // Summary
  console.log('\n' + '='.repeat(50));
  console.log('📊 TEST SUMMARY');
  console.log('='.repeat(50));
  console.log(`✅ Passed: ${results.passed}`);
  console.log(`❌ Failed: ${results.failed}`);
  console.log(`⏭️  Skipped: ${results.skipped}`);
  console.log(`📈 Total: ${results.passed + results.failed + results.skipped}`);
  console.log('='.repeat(50) + '\n');

  if (results.failed === 0) {
    log.success('🎉 All tests passed!');
    process.exit(0);
  } else {
    log.error('⚠️  Some tests failed. Please check the errors above.');
    process.exit(1);
  }
}

// Run tests
runTests().catch(error => {
  log.error(`Test runner error: ${error.message}`);
  process.exit(1);
});

