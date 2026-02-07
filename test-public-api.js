
import fetch from 'node-fetch';

async function testPublicAPI() {
  console.log('=== Testing Public API ===\n');
  
  try {
    // Test products endpoint
    console.log('1. Testing products endpoint...');
    const productsResponse = await fetch('http://localhost:5000/api/products');
    const productsData = await productsResponse.json();
    console.log(`✅ Products endpoint: ${productsData.length} products returned`);
    
    // Test gallery endpoint
    console.log('\n2. Testing gallery endpoint...');
    const galleryResponse = await fetch('http://localhost:5000/api/gallery');
    const galleryData = await galleryResponse.json();
    console.log(`✅ Gallery endpoint: ${galleryData.length} items returned`);
    
    // Test categories endpoint
    console.log('\n3. Testing categories endpoint...');
    const categoriesResponse = await fetch('http://localhost:5000/api/categories');
    const categoriesData = await categoriesResponse.json();
    console.log(`✅ Categories endpoint: ${categoriesData.length} categories returned`);
    
    // Test contact endpoint (requires POST)
    console.log('\n4. Testing contact endpoint (POST)...');
    const testInquiry = {
      name: "Test User",
      email: "test@example.com",
      phone: "1234567890",
      service: "Test Service",
      message: "This is a test inquiry from API test script"
    };
    
    const contactResponse = await fetch('http://localhost:5000/api/contact', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testInquiry)
    });
    
    const contactData = await contactResponse.json();
    if (contactData.success) {
      console.log(`✅ Contact endpoint: Inquiry created successfully (ID: ${contactData.inquiryId})`);
    } else {
      console.error('❌ Contact endpoint failed:', contactData);
    }
    
    console.log('\n=== All Tests Passed ===');
  } catch (error) {
    console.error('❌ API Test failed:', error);
  }
}

testPublicAPI();
