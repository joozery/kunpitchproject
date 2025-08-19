const fetch = require('node-fetch');

const BASE_URL = 'https://backendkunpitch-app-43efa3b2a3ab.herokuapp.com';

async function testUploadAPI() {
  console.log('🧪 Testing Upload API...\n');

  try {
    // Test 1: API Health Check
    console.log('1. Testing API Health Check...');
    const healthResponse = await fetch(`${BASE_URL}/api/health`);
    const healthData = await healthResponse.json();
    
    if (healthResponse.ok) {
      console.log('✅ API Health Check: PASSED');
      console.log(`   Status: ${healthData.status}`);
      console.log(`   Message: ${healthData.message}`);
    } else {
      console.log('❌ API Health Check: FAILED');
      console.log(`   Status: ${healthResponse.status}`);
    }

    // Test 2: Upload Test Endpoint
    console.log('\n2. Testing Upload Test Endpoint...');
    const uploadTestResponse = await fetch(`${BASE_URL}/api/upload/test`);
    const uploadTestData = await uploadTestResponse.json();
    
    if (uploadTestResponse.ok) {
      console.log('✅ Upload Test Endpoint: PASSED');
      console.log(`   Message: ${uploadTestData.message}`);
      console.log(`   Cloudinary Configured: ${uploadTestData.cloudinary.configured}`);
      console.log(`   Cloud Name: ${uploadTestData.cloudinary.cloud_name}`);
    } else {
      console.log('❌ Upload Test Endpoint: FAILED');
      console.log(`   Status: ${uploadTestResponse.status}`);
      console.log(`   Error: ${uploadTestData.message || 'Unknown error'}`);
    }

    // Test 3: Cloudinary Health Check
    console.log('\n3. Testing Cloudinary Health Check...');
    const cloudinaryResponse = await fetch(`${BASE_URL}/health/cloudinary`);
    const cloudinaryData = await cloudinaryResponse.json();
    
    if (cloudinaryResponse.ok) {
      console.log('✅ Cloudinary Health Check: PASSED');
      console.log(`   Status: ${cloudinaryData.cloudinary.status}`);
      console.log(`   Cloud Name: ${cloudinaryData.cloudinary.cloud_name}`);
      console.log(`   Has API Key: ${cloudinaryData.cloudinary.has_api_key}`);
      console.log(`   Has API Secret: ${cloudinaryData.cloudinary.has_api_secret}`);
    } else {
      console.log('❌ Cloudinary Health Check: FAILED');
      console.log(`   Status: ${cloudinaryResponse.status}`);
      console.log(`   Error: ${cloudinaryData.message || 'Unknown error'}`);
    }

    console.log('\n📊 Test Summary:');
    console.log('================');
    console.log(`API Health: ${healthResponse.ok ? '✅ PASS' : '❌ FAIL'}`);
    console.log(`Upload Test: ${uploadTestResponse.ok ? '✅ PASS' : '❌ FAIL'}`);
    console.log(`Cloudinary: ${cloudinaryResponse.ok ? '✅ PASS' : '❌ FAIL'}`);

  } catch (error) {
    console.error('❌ Test failed with error:', error.message);
    console.error('Stack trace:', error.stack);
  }
}

// Run the test
testUploadAPI();