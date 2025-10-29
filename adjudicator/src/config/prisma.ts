import { PrismaClient } from '../../../backend/generated/prismaClient';

export const prisma = new PrismaClient();

export type PrismaTransaction = Parameters<typeof prisma.$transaction>[0];
