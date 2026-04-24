const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
require('dotenv').config();

const healthRoutes = require('./routes/healthRoutes');
const authRoutes = require('./routes/authRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');
const resumeRoutes = require('./routes/resumeRoutes');
const quizRoutes = require('./routes/quizRoutes');

const app = express();

// CORS setup for local + deployed frontend URLs.
const allowedOrigins = (process.env.FRONTEND_URLS || '')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);

const corsOptions = {
  origin: (origin, callback) => {
    // Allow tools/server-to-server calls without Origin header.
    if (!origin) {
      return callback(null, true);
    }

    // If FRONTEND_URLS is not configured yet, allow all (dev-friendly default).
    if (allowedOrigins.length === 0 || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    return callback(new Error('CORS blocked for this origin.'));
  },
  credentials: true,
};

// Core middleware
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Log API requests in development mode.
if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
}

// Base route for health checks.
app.use('/api/health', healthRoutes);

// Authentication routes (signup, login, current user).
app.use('/api/auth', authRoutes);

// Protected dashboard routes.
app.use('/api/dashboard', dashboardRoutes);

// Protected resume analyzer routes.
app.use('/api/resume', resumeRoutes);

// Protected quiz system routes.
app.use('/api/quiz', quizRoutes);

module.exports = app;
