// @ts-ignore - Prisma Client is generated at runtime
import { PrismaClient } from '@prisma/client';
import { neonConfig, Pool } from '@neondatabase/serverless';
import { PrismaNeon } from '@prisma/adapter-neon';
import ws from 'ws';
import { logger } from '../utils/logger';

// Configure Neon for serverless
neonConfig.webSocketConstructor = ws;

// Singleton Prisma Client with Neon adapter
const prismaClientSingleton = () => {
  // In serverless/edge environments, use Neon adapter
  if (process.env.VERCEL || process.env.NODE_ENV === 'production') {
    const connectionString = process.env.DATABASE_URL;
    if (!connectionString) {
      throw new Error('DATABASE_URL is not defined');
    }
    
    const pool = new Pool({ connectionString });
    const adapter = new PrismaNeon(pool);
    
    return new PrismaClient({
      adapter: adapter as any,
      log: ['error'],
    });
  }
  
  // In development, use standard client
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
