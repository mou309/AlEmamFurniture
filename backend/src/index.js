require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

const authRoutes = require('./routes/auth');
const furnitureRoutes = require('./routes/furniture');
const ordersRoutes = require('./routes/orders');
const virtualRoomRoutes = require('./routes/virtualRoom');
const portfolioRoutes = require('./routes/portfolio');
const designRequestRoutes = require('./routes/designRequests');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(helmet());
app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:3000', credentials: true }));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

const limiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 200 });
app.use('/api', limiter);

app.use('/api/auth', authRoutes);
app.use('/api/furniture', furnitureRoutes);
app.use('/api/orders', ordersRoutes);
app.use('/api/virtual-room', virtualRoomRoutes);
app.use('/api/portfolio', portfolioRoutes);
app.use('/api/design-requests', designRequestRoutes);

// Serve uploaded images
app.use('/uploads', express.static(require('path').join(__dirname, '../uploads')));

app.get('/api/health', (req, res) => res.json({ status: 'ok', timestamp: new Date() }));

// Catch unhandled promise rejections from routes (e.g. DB not connected)
app.use((err, req, res, next) => {
  const isDbError = err.code === 'ECONNREFUSED' || err.message?.includes('connect');
  if (isDbError) {
    console.warn('[DB] Not connected:', err.message);
    return res.status(503).json({ error: 'Database not available. Configure PostgreSQL in .env' });
  }
  console.error(err.stack);
  res.status(500).json({ error: 'Internal server error' });
});

// Catch unhandled rejections globally so nodemon doesn't crash
process.on('unhandledRejection', (reason) => {
  if (reason?.code === 'ECONNREFUSED') {
    console.warn('[DB] Connection refused — is PostgreSQL running?');
  } else {
    console.error('Unhandled rejection:', reason);
  }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
