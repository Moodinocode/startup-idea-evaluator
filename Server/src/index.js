const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const config = require('./config/config');
const ideaRoutes = require('./routes/ideaRoutes');

const app = express();

// Behind Vercel/any proxy, trust the forwarded IP so the rate limiter keys on
// the real client rather than the proxy.
app.set('trust proxy', 1);

// Middleware
app.use(cors());
app.use(express.json({ limit: '64kb' }));
app.use(morgan('dev'));

// Every evaluation costs an OpenAI call, so cap how often one client can ask.
const evaluateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'Too many evaluation requests. Please try again later.' }
});

// Routes
app.use('/api', evaluateLimiter, ideaRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Start server
app.listen(config.port, () => {
  console.log(`Server is running on port ${config.port} in ${config.nodeEnv} mode`);
}); 