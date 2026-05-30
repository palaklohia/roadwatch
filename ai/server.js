import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { classifyHazard } from './classifier.js';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'Classifier running ✅' });
});

// Classify endpoint
app.post('/api/classify', async (req, res) => {
  try {
    const { imageUrl } = req.body;
    const result = await classifyHazard(imageUrl, 'Road hazard classification');
    res.json(result.data || result);
  } catch (error) {
    console.error('❌ Classification error:', error);
    res.status(500).json({ error: error.message });
  }
});

app.listen(3000, () => {
  console.log('🚀 Classifier server on http://localhost:3000');
});
