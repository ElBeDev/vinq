import express, { Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import { connectDB } from './config/db';
import { logger } from './utils/logger';
import { errorHandler, notFound } from './middlewares/errorHandler';
import { apiLimiter } from './middlewares/rateLimit';

// Load environment variables
dotenv.config();

// Initialize express app
const app: Application = express();

// Connect to database (con reconexión automática para serverless)
let dbConnected = false;
const ensureDbConnection = async () => {
  if (!dbConnected) {
    await connectDB();
    dbConnected = true;
  }
};

// Middleware para asegurar conexión DB en cada request (importante para serverless)
app.use(async (_req, _res, next) => {
  await ensureDbConnection();
  next();
});

// Middlewares
app.use(helmet()); // Security headers
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true,
}));
app.use(express.json()); // Parse JSON bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies
app.use(cookieParser()); // Parse cookies
app.use(apiLimiter); // Rate limiting

// Health check route
app.get('/api/health', (_req, res) => {
  res.status(200).json({
    success: true,
    message: 'VinQ CRM API is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
  });
});

// API Routes
app.get('/api/v1', (_req, res) => {
  res.status(200).json({
    success: true,
    message: 'Welcome to VinQ CRM API v1',
    version: '2.0.0',
    documentation: '/api/v1/docs',
  });
});

// Import routes
import authRoutes from './routes/auth.routes';
import dashboardRoutes from './routes/dashboard.routes';
import leadRoutes from './routes/lead.routes';
import contactRoutes from './routes/contact.routes';
import accountRoutes from './routes/account.routes';

// Use routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/dashboard', dashboardRoutes);
app.use('/api/v1/leads', leadRoutes);
app.use('/api/v1/contacts', contactRoutes);
app.use('/api/v1/accounts', accountRoutes);
// app.use('/api/v1/users', userRoutes);
// etc...

// Error handling
app.use(notFound);
app.use(errorHandler);

// Start server (solo en desarrollo local)
if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 5000;
  
  app.listen(PORT, () => {
    logger.info(`🚀 Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
    logger.info(`📡 API available at: http://localhost:${PORT}/api/v1`);
    logger.info(`💚 Health check: http://localhost:${PORT}/api/health`);
  });

  // Handle unhandled promise rejections
  process.on('unhandledRejection', (err: Error) => {
    logger.error('🔥 Unhandled Promise Rejection:', err);
    // Close server & exit process
    process.exit(1);
  });
}

// Export for Vercel serverless functions
export default app;
