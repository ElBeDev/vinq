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
  // Get DATABASE_URL at runtime
  const connectionString = process.env.DATABASE_URL;
  
  console.log('=== Prisma Initialization ===');
  console.log('DATABASE_URL exists:', !!connectionString);
  console.log('DATABASE_URL length:', connectionString?.length || 0);
  console.log('Environment:', process.env.VERCEL ? 'Vercel' : 'Local');
  
  if (!connectionString) {
    const error = new Error('DATABASE_URL is not defined');
    logger.error('DATABASE_URL is not defined');
    console.error('DATABASE_URL is not defined');
    throw error;
  }
  
  console.log('Creating Neon Pool with connection string...');
  const pool = new Pool({ connectionString });
  const adapter = new PrismaNeon(pool as any);
  
  console.log('Creating PrismaClient with Neon adapter...');
  return new PrismaClient({
    adapter: adapter as any,
    log: ['error', 'warn'],
  });
};

declare global {
  // eslint-disable-next-line no-var
  var prismaGlobal: undefined | ReturnType<typeof prismaClientSingleton>;
}

// Lazy initialization - only create when accessed
function getPrismaClient() {
  if (!globalThis.prismaGlobal) {
    console.log('First access - initializing Prisma Client...');
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
