import { PrismaClient } from '@prisma/client'
import { PrismaLibSQL } from '@prisma/adapter-libsql'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

const createPrismaClient = () => {
  // On utilise TURSO_DATABASE_URL si elle existe, sinon DATABASE_URL (qui sera file:...)
  const url = process.env.TURSO_DATABASE_URL || process.env.DATABASE_URL || 'file:./prisma/dev.db';
  const authToken = process.env.TURSO_AUTH_TOKEN;

  console.log('--- Prisma Initialization ---');
  console.log('Using URL:', url);

  const config = {
    url: url,
    authToken: authToken,
  };

  const adapter = new PrismaLibSQL(config);
  return new PrismaClient({ adapter });
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
