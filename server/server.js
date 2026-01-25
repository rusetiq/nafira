import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import authRoutes from './routes/auth.js';
import mealRoutes from './routes/meals.js';
import userRoutes from './routes/user.js';
import demoRoutes from './routes/demo.js';
import childrenRoutes from './routes/children.js';
import sustainabilityRoutes from './routes/sustainability.js';
import menuRoutes from './routes/menu.js';
import { initDatabase } from './config/database.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const PORT = process.env.PORT || 5000;
const HOST = '0.0.0.0';
const app = express();

// Trust Railway's load balancer
app.set('trust proxy', 1);

initDatabase();

// CORS: when using cookies/credentials, Access-Control-Allow-Origin cannot be "*".
// Configure allowed origins via env:
// - CORS_ORIGIN="http://localhost:3000,http://127.0.0.1:3000"
// - or set REACT_APP_API_URL on frontend and mirror it here.
const allowedOrigins = (
  process.env.CORS_ORIGIN ||
  // Default to same-origin on the single-server setup (frontend + API on :5000)
  'http://localhost:5000,http://127.0.0.1:5000'
)
  .split(',')
  .map(s => s.trim())
  .filter(Boolean);

const corsOptions = {
  origin(origin, cb) {
    // Allow non-browser clients (no Origin header) like curl/postman.
    if (!origin) return cb(null, true);
    if (allowedOrigins.includes(origin)) return cb(null, true);
    return cb(new Error(`CORS blocked origin: ${origin}`));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Origin', 'X-Requested-With', 'Content-Type', 'Accept', 'Authorization'],
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions));

app.use(
  helmet({
    crossOriginResourcePolicy: false
  })
);

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100
});

app.use("/api/", (req, res, next) => {
  if (req.method === "OPTIONS") return next();
  limiter(req, res, next);
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const uploadPath = process.env.UPLOAD_PATH || path.join(__dirname, 'uploads');
app.use('/api/uploads', express.static(uploadPath));

app.use('/api/auth', authRoutes);
app.use('/api/meals', mealRoutes);
app.use('/api/user', userRoutes);
app.use('/api/demo', demoRoutes);
app.use('/api/children', childrenRoutes);
app.use('/api/sustainability', sustainabilityRoutes);
app.use('/api/menu', menuRoutes);

app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

if (process.env.NODE_ENV === 'production') {
  const buildPath = path.join(__dirname, '../build');
  app.use(express.static(buildPath));
  app.get('*', (req, res) => {
    res.sendFile(path.join(buildPath, 'index.html'));
  });
}

app.use((err, req, res, next) => {
  console.error(err);
  if (err.name === 'MulterError') {
    return res.status(400).json({ error: err.message });
  }
  res.status(err.status || 500).json({
    error: err.message || 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

app.listen(PORT, HOST, () => {
  console.log(`Server running on http://${HOST}:${PORT}`);
});

export default app;