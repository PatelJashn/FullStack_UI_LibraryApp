import fetch from 'node-fetch';

// Replace with your actual Render backend URL
const RENDER_URL = 'https://your-backend-name.onrender.com';

async function testRenderMongoDB() {
  console.log('🔍 Testing MongoDB connection on Render...');
  console.log(`🌐 Backend URL: ${RENDER_URL}`);
  
  try {
    // Test 1: Health endpoint
    console.log('\n📊 Testing health endpoint...');
    const healthResponse = await fetch(`${RENDER_URL}/health`);
    const healthData = await healthResponse.json();
    
    console.log('✅ Health endpoint response:');
    console.log(JSON.stringify(healthData, null, 2));
    
    if (healthData.mongodb === 'Connected') {
      console.log('🎉 MongoDB is CONNECTED and working!');
    } else {
      console.log('❌ MongoDB is NOT connected');
      console.log('💡 Check your MONGO_URI environment variable in Render');
    }
    
    // Test 2: Components API
    console.log('\n📦 Testing components API...');
    const componentsResponse = await fetch(`${RENDER_URL}/api/ui-components`);
    const componentsData = await componentsResponse.json();
    
    console.log(`✅ Components API response: ${componentsData.components?.length || 0} components found`);
    
    // Test 3: Server status
    console.log('\n🖥️ Testing server status...');
    const serverResponse = await fetch(`${RENDER_URL}/`);
    const serverText = await serverResponse.text();
    
    console.log(`✅ Server response: ${serverText}`);
    
  } catch (error) {
    console.error('❌ Error testing Render backend:', error.message);
    console.log('💡 Make sure your Render backend URL is correct');
  }
}

// Run the test
testRenderMongoDB();
