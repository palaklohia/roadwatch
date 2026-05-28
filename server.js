require('dotenv').config();
const express = require('express');
const cors = require('cors');
const pool = require('./src/config/database');
const complaintRoutes = require('./src/routes/complaintRoutes');
const whatsappRoutes = require('./src/routes/whatsappRoutes');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Use routes
app.use('/api/complaints', complaintRoutes);
app.use('/api/whatsapp', whatsappRoutes);

// Health check route
app.get('/health', async (req, res) => {
  try {
    const connection = await pool.getConnection();
    await connection.ping();
    connection.release();
    res.json({ 
      server: 'running ✅',
      database: 'connected ✅'
    });
  } catch (error) {
    res.status(500).json({ 
      server: 'running ✅',
      database: 'ERROR ❌',
      error: error.message 
    });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📍 Health check: http://localhost:${PORT}/health`);
});