const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

/**
 * GET /api/health
 *
 * A lightweight health-check endpoint.
 * Used to verify that the server is running and MongoDB is connected.
 * Deployment platforms (Render, Railway) can ping this to confirm the
 * service is healthy before routing traffic to it.
 */
router.get('/', (req, res) => {
  const dbStatus = mongoose.connection.readyState;

  // readyState values: 0 = disconnected, 1 = connected, 2 = connecting
  const dbStatusMap = {
    0: 'disconnected',
    1: 'connected',
    2: 'connecting',
  };

  res.status(200).json({
    success: true,
    message: 'Server is running',
    data: {
      server: 'ok',
      database: dbStatusMap[dbStatus] || 'unknown',
      timestamp: new Date().toISOString(),
    },
  });
});

module.exports = router;
