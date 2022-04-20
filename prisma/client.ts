import { PrismaClient } from '@prisma/client';

let prisma;

type PrismaGlobalThis = typeof global & { prisma: PrismaClient | undefined };

if (process.env.NODE_ENV === 'production') {
	prisma = new PrismaClient();
} else {
	if (!(global as PrismaGlobalThis).prisma) {
		(global as PrismaGlobalThis).prisma = new PrismaClient();
	}

	prisma = (global as PrismaGlobalThis).prisma;
}

export default prisma as PrismaClient;
