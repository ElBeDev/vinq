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
  // Always use Neon adapter in serverless
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    logger.error('DATABASE_URL is not defined');
    throw new Error('DATABASE_URL is not defined');
  }
  
  const pool = new Pool({ connectionString });
  const adapter = new PrismaNeon(pool as any);
  
  return new PrismaClient({
    adapter: adapter as any,
    log: ['error'],
  });
};

declare global {
  // eslint-disable-next-line no-var
  var prismaGlobal: undefined | ReturnType<typeof prismaClientSingleton>;
}

// Lazy initialization - only create when accessed
function getPrismaClient() {
  if (!globalThis.prismaGlobal) {
    globalThis.prismaGlobal = prismaClientSingleton();
  }
  return globalThis.prismaGlobal;
}

const prisma = new Proxy({} as PrismaClient, {
  get(_target, prop) {
    return getPrismaClient()[prop as keyof PrismaClient];
  }
});

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
