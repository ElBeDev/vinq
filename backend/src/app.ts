import express, { Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import { errorHandler, notFound } from './middlewares/errorHandler';
import { apiLimiter } from './middlewares/rateLimit';

// Load environment variables
dotenv.config();

// Initialize express app
const app: Application = express();

// Middlewares
app.use(helmet()); // Security headers
app.use(cors({
  origin: (origin, callback) => {
    const allowedOrigins = [
      process.env.CLIENT_URL || 'http://localhost:5173',
      'http://localhost:5173',
      /\.vercel\.app$/, // Allow all Vercel preview deployments
    ];
    
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    const isAllowed = allowedOrigins.some(allowed => {
      if (typeof allowed === 'string') {
        return allowed === origin;
      }
      return allowed.test(origin);
    });
    
    if (isAllowed) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
}));
app.use(express.json()); // Parse JSON bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies
app.use(cookieParser()); // Parse cookies
app.use(apiLimiter); // Rate limiting

// Health check route
app.get('/health', (_req, res) => {
  res.status(200).json({
    success: true,
    message: 'VinQ CRM API is running',
    timestamp: new Date().toISOString(),
  });
});

app.get('/api/health', (_req, res) => {
  res.status(200).json({
    success: true,
    message: 'VinQ CRM API is running',
    timestamp: new Date().toISOString(),
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

// Error handling
app.use(notFound);
app.use(errorHandler);

// Export for both ES modules and CommonJS
export default app;
module.exports = app;
