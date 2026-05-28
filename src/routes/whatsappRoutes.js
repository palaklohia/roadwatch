// src/routes/whatsappRoutes.js
const express = require('express');
const router = express.Router();

// Webhook verification (Meta requires this)
router.get('/webhook', (req, res) => {
  const mode = req.query['hub.mode'];
  const token = req.query['hub.verify_token'];
  const challenge = req.query['hub.challenge'];

  const VERIFY_TOKEN = process.env.WHATSAPP_VERIFY_TOKEN || 'your_verify_token';

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

// Receive messages from WhatsApp
router.post('/webhook', async (req, res) => {
  try {
    const body = req.body;

    // Check if this is a message event
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

        // Handle different message types
        if (message.type === 'text') {
          const text = message.text.body;
          console.log(`Text: ${text}`);
          
          // TODO: Parse complaint from text
          // TODO: Store in database
          // TODO: Send response to user
        }

        if (message.type === 'image') {
          const imageId = message.image.id;
          console.log(`Image ID: ${imageId}`);
          
          // TODO: Download image
          // TODO: Store URL in database
          // TODO: Send AI analysis
        }
      }

      // Return 200 OK to WhatsApp (acknowledge receipt)
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