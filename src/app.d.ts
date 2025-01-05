/// <reference types="lucia" />
import type { PrismaClient } from '@prisma/client';

declare global {
	namespace App {
		interface Locals {
			user: {
				userId: string;
				email: string;
				role: string;
			} | null;
		}
		interface PageData {
			user: {
				userId: string;
				email: string;
				role: string;
			} | null;
		}
	}
}

// Used in prisma singleton pattern
declare global {
	// eslint-disable-next-line no-var
	var prisma: PrismaClient | undefined;
}

export {};
