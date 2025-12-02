// @ts-ignore - Prisma Client is generated at runtime
import { PrismaClient } from '@prisma/client';
import { logger } from '../utils/logger';

// Singleton Prisma Client
const prismaClientSingleton = () => {
  return new PrismaClient({
    log: process.env.NODE_ENV === 'development' 
      ? ['query', 'error', 'warn'] 
      : ['error'],
  });
};

declare global {
  // eslint-disable-next-line no-var
  var prismaGlobal: undefined | ReturnType<typeof prismaClientSingleton>;
}

const prisma = globalThis.prismaGlobal ?? prismaClientSingleton();

if (process.env.NODE_ENV !== 'production') {
  globalThis.prismaGlobal = prisma;
}

export const connectDB = async (): Promise<void> => {
  try {
    await prisma.$connect();
    logger.info('✅ PostgreSQL Connected via Prisma');
    logger.info(`📦 Database: ${process.env.DATABASE_URL?.split('@')[1]?.split('/')[1] || 'vinq_crm'}`);
  } catch (error) {
    logger.error('❌ PostgreSQL Connection Error:', error);
    // Don't exit in serverless environment
    if (process.env.NODE_ENV !== 'production') {
      process.exit(1);
    }
  }
};

// Graceful shutdown (only for non-serverless)
if (process.env.NODE_ENV !== 'production') {
  process.on('SIGINT', async () => {
    await prisma.$disconnect();
    logger.info('👋 PostgreSQL connection closed through app termination');
    process.exit(0);
  });

  process.on('SIGTERM', async () => {
    await prisma.$disconnect();
    logger.info('👋 PostgreSQL connection closed through app termination');
    process.exit(0);
  });
}

export default prisma;
