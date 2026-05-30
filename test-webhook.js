// test-webhook.js
require('dotenv').config();
const axios = require('axios');

async function testWebhook() {
  console.log('🧪 Testing WhatsApp Webhook Setup...\n');

  // Check 1: Environment variables
  console.log('✅ Step 1: Checking Environment Variables');
  console.log(`   Phone Number ID: ${process.env.WHATSAPP_PHONE_NUMBER_ID}`);
  console.log(`   Business Account ID: ${process.env.WHATSAPP_BUSINESS_ACCOUNT_ID}`);
  console.log(`   Access Token: ${process.env.WHATSAPP_ACCESS_TOKEN.substring(0, 20)}...`);
  console.log(`   Verify Token: ${process.env.WHATSAPP_VERIFY_TOKEN}\n`);

  // Check 2: Local webhook
  console.log('✅ Step 2: Testing Local Webhook');
  try {
    const response = await axios.get(
      'http://localhost:5000/api/whatsapp/webhook?hub.mode=subscribe&hub.verify_token=webhook_verify_token_12345&hub.challenge=test_challenge_123'
    );
    console.log(`   Response: ${response.data}`);
    if (response.data === 'test_challenge_123') {
      console.log('   ✅ LOCAL WEBHOOK WORKS!\n');
    }
  } catch (error) {
    console.log(`   ❌ Error: ${error.message}\n`);
  }

  // Check 3: ngrok webhook
  console.log('✅ Step 3: Testing ngrok Webhook');
  try {
    const response = await axios.get(
      'https://turban-savor-sustainer.ngrok-free.dev/api/whatsapp/webhook?hub.mode=subscribe&hub.verify_token=webhook_verify_token_12345&hub.challenge=test_challenge_123'
    );
    console.log(`   Response: ${response.data}`);
    if (response.data === 'test_challenge_123') {
      console.log('   ✅ NGROK WEBHOOK WORKS!\n');
    }
  } catch (error) {
    console.log(`   ❌ Error: ${error.message}`);
    console.log(`   (Make sure ngrok is running)\n`);
  }

  console.log('🎯 All tests complete!');
  console.log('\n📝 Next steps:');
  console.log('1. Make sure Node server is running (npm start)');
  console.log('2. Make sure ngrok is running (ngrok http 5000)');
  console.log('3. Go to Meta Dashboard → WhatsApp → Configuration');
  console.log('4. Set Callback URL: https://turban-savor-sustainer.ngrok-free.dev/api/whatsapp/webhook');
  console.log('5. Set Verify Token: webhook_verify_token_12345');
  console.log('6. Click "Verify and save"');
}

testWebhook();