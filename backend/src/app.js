const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');

const authRoutes = require('./routes/authRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const productRoutes = require('./routes/productRoutes');
const orderRoutes = require('./routes/orderRoutes');
const reviewRoutes = require('./routes/reviewRoutes');
const { notFound, errorHandler } = require('./middleware/errorMiddleware');

const app = express();

// Security HTTP headers (configured to allow SPA assets and external images)
app.use(
  helmet({
    contentSecurityPolicy: false,
    crossOriginEmbedderPolicy: false
  })
);

// Enable CORS for frontend Vite (5173) and other development clients
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  'http://127.0.0.1:5173',
  'http://127.0.0.1:3000'
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin) || origin.startsWith('http://localhost:') || origin.startsWith('http://127.0.0.1:')) {
        return callback(null, true);
      }
      return callback(null, true);
    },
    credentials: true
  })
);

// Rate limiting (100 requests per 15 minutes per IP)
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  message: {
    success: false,
    message: 'Too many requests from this IP, please try again in 15 minutes'
  }
});
app.use('/api', limiter);

// Request logging in development
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Body parsers
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Health Check API
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'VibeWear Backend API is healthy and operational',
    timestamp: new Date().toISOString()
  });
});

// Interactive Visual Database & Backend Inspector
const {
  renderDatabaseDashboard,
  getDatabaseOverviewJson,
  createTestOrder
} = require('./controllers/dbViewerController');

app.get('/database', renderDatabaseDashboard);
app.get('/db-status', renderDatabaseDashboard);
app.get('/api/v1/db-overview', getDatabaseOverviewJson);
app.post('/api/v1/create-test-order', createTestOrder);

// API Routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/categories', categoryRoutes);
app.use('/api/v1/products', productRoutes);
app.use('/api/v1/orders', orderRoutes);
app.use('/api/v1/reviews', reviewRoutes);

// Serve static frontend build if dist exists (All-in-one Single Port Serving)
const path = require('path');
const frontendDist = path.join(__dirname, '../../frontend/dist');
app.use(express.static(frontendDist));

// Catch-all route to serve React index.html for client-side routing
app.use((req, res, next) => {
  if (req.method !== 'GET') return next();
  if (
    req.path.startsWith('/api') ||
    req.path.startsWith('/database') ||
    req.path.startsWith('/db-status')
  ) {
    return next();
  }
  const indexPath = path.join(frontendDist, 'index.html');
  res.sendFile(indexPath, (err) => {
    if (err) next();
  });
});

// 404 Handler & Global Error Handler
app.use(notFound);
app.use(errorHandler);

module.exports = app;
