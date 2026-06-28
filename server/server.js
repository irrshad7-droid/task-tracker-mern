// Load environment variables from .env file FIRST,
// before any other module reads process.env
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

const connectDB = require('./config/db');
const healthRoutes = require('./routes/healthRoutes');
const taskRoutes = require('./routes/taskRoutes');
const errorHandler = require('./middleware/errorHandler');

// ─── Connect to Database ─────────────────────────────────────────────────────
connectDB();

// ─── Create Express App ───────────────────────────────────────────────────────
const app = express();

// ─── Middleware ───────────────────────────────────────────────────────────────

// CORS: allows the React frontend (running on a different port) to make
// requests to this API. In production, CLIENT_URL is the Vercel URL.
app.use(
  cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
  })
);

// Morgan: logs every HTTP request to the console (method, path, status, time).
// 'dev' format is colorful and concise — great for development.
app.use(morgan('dev'));

// express.json(): parses incoming requests with a JSON body.
// Without this, req.body would be undefined on POST/PUT requests.
app.use(express.json());

// ─── Routes ───────────────────────────────────────────────────────────────────
app.use('/api/health', healthRoutes);
app.use('/api/tasks', taskRoutes);

// ─── 404 Handler ─────────────────────────────────────────────────────────────
// Catches any request that didn't match a route above
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.method} ${req.originalUrl}`,
  });
});

// ─── Global Error Handler ────────────────────────────────────────────────────
// Must be LAST — Express identifies this as an error handler because it
// has 4 parameters (err, req, res, next)
app.use(errorHandler);

// ─── Start Server ─────────────────────────────────────────────────────────────
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});
