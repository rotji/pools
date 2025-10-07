import express from 'express';

const router = express.Router();

// Health check endpoint
router.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'API is running',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

// Database health check (mock for now)
router.get('/db', (req, res) => {
  res.json({
    success: true,
    message: 'Database connection healthy',
    timestamp: new Date().toISOString()
  });
});

export default router;