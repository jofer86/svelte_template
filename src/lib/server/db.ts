import { PrismaClient } from '@prisma/client';
import { dev } from '$app/environment';

// Use global `prisma` in development to prevent multiple instances in hot reloading
const prisma = global.prisma || new PrismaClient();

if (dev) {
  global.prisma = prisma;
}

export { prisma };