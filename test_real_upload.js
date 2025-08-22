const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');
const path = require('path');

const BASE_URL = 'https://kunpitch-backend-new-b63bd38838f8.herokuapp.com';

async function testRealUpload() {
  console.log('🧪 Testing Real Image Upload...\n');

  try {
    // Create a simple test image (1x1 pixel PNG)
    const testImageBuffer = Buffer.from([
      0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A, 0x00, 0x00, 0x00, 0x0D,
      0x49, 0x48, 0x44, 0x52, 0x00, 0x00, 0x00, 0x01, 0x00, 0x00, 0x00, 0x01,
      0x08, 0x02, 0x00, 0x00, 0x00, 0x90, 0x77, 0x53, 0xDE, 0x00, 0x00, 0x00,
      0x0C, 0x49, 0x44, 0x41, 0x54, 0x08, 0xD7, 0x63, 0xF8, 0x00, 0x00, 0x00,
      0x01, 0x00, 0x01, 0x5C, 0xC2, 0x5D, 0xB4, 0x00, 0x00, 0x00, 0x00, 0x49,
      0x45, 0x4E, 0x44, 0xAE, 0x42, 0x60, 0x82
    ]);

    console.log('1. Testing Single Image Upload...');
    
    // Create FormData
    const formData = new FormData();
    formData.append('image', testImageBuffer, {
      filename: 'test-image.png',
      contentType: 'image/png'
    });

    // Upload the image
    const uploadResponse = await axios.post(`${BASE_URL}/api/upload/single`, formData, {
      headers: formData.getHeaders()
    });

    const uploadData = uploadResponse.data;
    
    if (uploadResponse.status === 200 && uploadData.success) {
      console.log('✅ Single Image Upload: PASSED');
      console.log(`   Message: ${uploadData.message}`);
      console.log(`   URL: ${uploadData.data.url}`);
      console.log(`   Public ID: ${uploadData.data.public_id}`);
      console.log(`   Format: ${uploadData.data.format}`);
      console.log(`   Size: ${uploadData.data.width}x${uploadData.data.height}`);
      
      // Test deletion
      console.log('\n2. Testing Image Deletion...');
      const deleteResponse = await axios.delete(`${BASE_URL}/api/upload/${uploadData.data.public_id}`);
      
      const deleteData = deleteResponse.data;
      
      if (deleteResponse.status === 200 && deleteData.success) {
        console.log('✅ Image Deletion: PASSED');
        console.log(`   Message: ${deleteData.message}`);
      } else {
        console.log('❌ Image Deletion: FAILED');
        console.log(`   Status: ${deleteResponse.status}`);
        console.log(`   Error: ${deleteData.message || 'Unknown error'}`);
      }
      
    } else {
      console.log('❌ Single Image Upload: FAILED');
      console.log(`   Status: ${uploadResponse.status}`);
      console.log(`   Error: ${uploadData.message || 'Unknown error'}`);
      if (uploadData.error) {
        console.log(`   Details: ${uploadData.error}`);
      }
    }

    console.log('\n📊 Test Summary:');
    console.log('================');
    console.log(`Upload: ${uploadResponse.status === 200 && uploadData.success ? '✅ PASS' : '❌ FAIL'}`);

  } catch (error) {
    console.error('❌ Test failed with error:', error.message);
    console.error('Stack trace:', error.stack);
  }
}

// Run the test
testRealUpload();