import { connectDB } from './config/db';
import { logger } from './utils/logger';
import app from './app';

// Connect to database
connectDB();

// Start server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  logger.info(`🚀 Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
  logger.info(`📡 API available at: http://localhost:${PORT}/api/v1`);
  logger.info(`💚 Health check: http://localhost:${PORT}/health`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err: Error) => {
  logger.error('🔥 Unhandled Promise Rejection:', err);
  // Close server & exit process
  process.exit(1);
});
