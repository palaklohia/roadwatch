import './followupService.js';
import express from 'express';
import axios from 'axios';
import cors from 'cors';
import dotenv from 'dotenv';


dotenv.config({ path: '../.env' });

const app = express();
app.use(cors());
app.use(express.json());

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'Server running ✅' });
});

// Classify and route
app.post('/api/classify-and-route', async (req, res) => {
  try {
    const { complaintId, photoUrl, location } = req.body;

    // Call Groq classifier
    console.log('📸 Calling classifier...');
    const response = await axios.post('http://localhost:3000/api/classify', {
      imageUrl: photoUrl
    });

    const classification = response.data;
    console.log('✅ Classification:', classification);

    res.json({
      success: true,
      complaintId,
      classification,
      message: '✅ Success'
    });
  } catch (error) {
    console.error('❌ Error:', error.message);
    res.status(500).json({ error: error.message });
  }
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server on http://localhost:${PORT}`);
});