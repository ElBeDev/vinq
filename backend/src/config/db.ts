import mongoose from 'mongoose';
import { logger } from '../utils/logger';

export const connectDB = async (): Promise<void> => {
  try {
    const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/vinq-crm';
    
    const conn = await mongoose.connect(mongoUri);

    logger.info(`✅ MongoDB Connected: ${conn.connection.host}`);
    logger.info(`📦 Database: ${conn.connection.name}`);
  } catch (error) {
    logger.error('❌ MongoDB Connection Error:', error);
    process.exit(1);
  }
};

// Mongoose events
mongoose.connection.on('connected', () => {
  logger.info('🔌 Mongoose connected to MongoDB');
});

mongoose.connection.on('error', (err) => {
  logger.error('🔥 Mongoose connection error:', err);
});

mongoose.connection.on('disconnected', () => {
  logger.warn('⚠️ Mongoose disconnected from MongoDB');
});

// Graceful shutdown
process.on('SIGINT', async () => {
  await mongoose.connection.close();
  logger.info('👋 MongoDB connection closed through app termination');
  process.exit(0);
});
