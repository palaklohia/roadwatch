// src/routes/whatsappRoutes.js
const express = require('express');
const router = express.Router();
const axios = require('axios');
const pool = require('../config/database');

// Store user states
const userStates = new Map();

// Webhook verification
router.get('/webhook', (req, res) => {
  const mode = req.query['hub.mode'];
  const token = req.query['hub.verify_token'];
  const challenge = req.query['hub.challenge'];

  const VERIFY_TOKEN = process.env.WHATSAPP_VERIFY_TOKEN || 'webhook_verify_token_12345';

  if (mode && token) {
    if (mode === 'subscribe' && token === VERIFY_TOKEN) {
      console.log('✅ Webhook verified');
      res.status(200).send(challenge);
    } else {
      res.sendStatus(403);
    }
  } else {
    res.sendStatus(400);
  }
});

// Send message to WhatsApp
async function sendWhatsAppMessage(phoneNumber, message) {
  try {
    const response = await axios.post(
      `https://graph.instagram.com/v18.0/${process.env.WHATSAPP_PHONE_NUMBER_ID}/messages`,
      {
        messaging_product: 'whatsapp',
        to: phoneNumber,
        type: 'text',
        text: { body: message }
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.WHATSAPP_ACCESS_TOKEN}`
        }
      }
    );
    console.log(`✅ Message sent to ${phoneNumber}`);
    return response.data;
  } catch (error) {
    console.error('❌ Error sending message:', error.response?.data || error.message);
  }
}

// Get user state
function getUserState(phoneNumber) {
  if (!userStates.has(phoneNumber)) {
    userStates.set(phoneNumber, {
      step: 'START',
      data: {}
    });
  }
  return userStates.get(phoneNumber);
}

// Update user state
function updateUserState(phoneNumber, step, data = {}) {
  const state = getUserState(phoneNumber);
  state.step = step;
  state.data = { ...state.data, ...data };
  userStates.set(phoneNumber, state);
}

// Receive messages
router.post('/webhook', async (req, res) => {
  try {
    const body = req.body;

    if (body.object) {
      if (
        body.entry &&
        body.entry[0].changes &&
        body.entry[0].changes[0].value.messages &&
        body.entry[0].changes[0].value.messages[0]
      ) {
        const message = body.entry[0].changes[0].value.messages[0];
        const senderPhone = body.entry[0].changes[0].value.contacts[0].wa_id;
        const senderName = body.entry[0].changes[0].value.contacts[0].profile.name;

        console.log(`\n📱 Message from ${senderName} (${senderPhone}):`);
        console.log(`Message type: ${message.type}`);

        // Get user input
        let userInput = '';
        if (message.type === 'text') {
          userInput = message.text.body.toLowerCase().trim();
          console.log(`Text: ${userInput}`);
        }

        // Handle conversation
        const userState = getUserState(senderPhone);
        console.log(`Current step: ${userState.step}`);

        // STEP 1: Start
        if (userState.step === 'START') {
          updateUserState(senderPhone, 'LOCATION', { reporter_name: senderName });
          await sendWhatsAppMessage(
            senderPhone,
            `👋 Hi ${senderName}!\n\nWelcome to RoadWatch 🛣️\n\n📍 Please share the location of the issue:\n\nExample: "Main Road, Sector 5, Delhi"`
          );
        }

        // STEP 2: Location
        else if (userState.step === 'LOCATION') {
          updateUserState(senderPhone, 'COMPLAINT_TYPE', { location: userInput });
          await sendWhatsAppMessage(
            senderPhone,
            `✅ Location saved: ${userInput}\n\n🔍 What type of issue is it?\n\n1️⃣ Pothole\n2️⃣ Waterlogging\n3️⃣ Broken Streetlight\n4️⃣ Fallen Tree\n5️⃣ Accident\n6️⃣ Roadkill\n7️⃣ Missing Sign\n8️⃣ Other`
          );
        }

        // STEP 3: Complaint Type
        else if (userState.step === 'COMPLAINT_TYPE') {
          const typeMap = {
            '1': 1, '2': 2, '3': 3, '4': 4, '5': 5, '6': 6, '7': 7, '8': 10
          };
          const categoryId = typeMap[userInput.charAt(0)];

          if (categoryId) {
            const [category] = await pool.query('SELECT name FROM complaint_categories WHERE id = ?', [categoryId]);
            updateUserState(senderPhone, 'DESCRIPTION', { category_id: categoryId });
            await sendWhatsAppMessage(
              senderPhone,
              `✅ Selected: ${category[0]?.name}\n\n📝 Now describe the issue in detail.\n\nExample: "Large pothole on main road, danger to vehicles"`
            );
          } else {
            await sendWhatsAppMessage(senderPhone, '❌ Please reply with 1-8');
          }
        }

        // STEP 4: Description
        else if (userState.step === 'DESCRIPTION') {
          updateUserState(senderPhone, 'SEVERITY', { description: userInput });
          await sendWhatsAppMessage(
            senderPhone,
            `✅ Description saved.\n\n⚠️ How severe is the issue?\n\n1️⃣ Minor\n2️⃣ Moderate\n3️⃣ Severe\n4️⃣ Critical`
          );
        }

        // STEP 5: Severity
        else if (userState.step === 'SEVERITY') {
          const severity = parseInt(userInput.charAt(0)) || 2;

          if (severity >= 1 && severity <= 4) {
            updateUserState(senderPhone, 'CONFIRMATION', { severity });

            // Save to database
            const [result] = await pool.query(
              `INSERT INTO complaints (
                category_id, description, location, severity, 
                reporter_name, reporter_phone, status
              ) VALUES (?, ?, ?, ?, ?, ?, 'pending')`,
              [
                userState.data.category_id,
                userState.data.description,
                userState.data.location,
                severity,
                userState.data.reporter_name,
                senderPhone
              ]
            );

            const complaintId = result.insertId;

            await sendWhatsAppMessage(
              senderPhone,
              `✅ Your complaint has been filed!\n\n📋 Complaint ID: #${complaintId}\n\n🚀 We'll review it and notify authorities shortly.\n\nThank you for keeping our roads safe! 🛣️`
            );

            // Clear state
            userStates.delete(senderPhone);
          } else {
            await sendWhatsAppMessage(senderPhone, '❌ Please reply with 1, 2, 3, or 4');
          }
        }
      }

      res.sendStatus(200);
    } else {
      res.sendStatus(404);
    }
  } catch (error) {
    console.error('Error:', error);
    res.sendStatus(500);
  }
});

module.exports = router;