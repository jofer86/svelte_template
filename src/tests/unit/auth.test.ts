import { describe, it, expect, vi, beforeEach } from 'vitest';
import { validateUser, createUser } from '$lib/server/auth';
import { prisma } from '$lib/server/db';
import bcrypt from 'bcryptjs';

vi.mock('$lib/server/db', () => ({
  prisma: {
    user: {
      findUnique: vi.fn(),
      create: vi.fn()
    }
  }
}));

vi.mock('bcryptjs', () => ({
  default: {
    hash: vi.fn(),
    compare: vi.fn()
  }
}));

describe('Auth utilities', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('validateUser', () => {
    it('should return null for non-existent user', async () => {
      vi.mocked(prisma.user.findUnique).mockResolvedValue(null);

      const result = await validateUser('test@example.com', 'password');
      expect(result).toBeNull();
    });

    it('should return null for invalid password', async () => {
      vi.mocked(prisma.user.findUnique).mockResolvedValue({
        id: '1',
        email: 'test@example.com',
        hashedPassword: 'hashed',
        role: 'USER',
        createdAt: new Date(),
        updatedAt: new Date()
      });
      vi.mocked(bcrypt.compare).mockResolvedValue(false);

      const result = await validateUser('test@example.com', 'wrong-password');
      expect(result).toBeNull();
    });

    it('should return user for valid credentials', async () => {
      const user = {
        id: '1',
        email: 'test@example.com',
        hashedPassword: 'hashed',
        role: 'USER',
        createdAt: new Date(),
        updatedAt: new Date()
      };
      vi.mocked(prisma.user.findUnique).mockResolvedValue(user);
      vi.mocked(bcrypt.compare).mockResolvedValue(true);

      const result = await validateUser('test@example.com', 'password');
      expect(result).toEqual(user);
    });
  });

  describe('createUser', () => {
    it('should create a new user with hashed password', async () => {
      const hashedPassword = 'hashed-password';
      vi.mocked(bcrypt.hash).mockResolvedValue(hashedPassword);

      const newUser = {
        id: '1',
        email: 'test@example.com',
        hashedPassword,
        role: 'USER',
        createdAt: new Date(),
        updatedAt: new Date()
      };
      vi.mocked(prisma.user.create).mockResolvedValue(newUser);

      const result = await createUser('test@example.com', 'password');
      expect(result).toEqual(newUser);
      expect(bcrypt.hash).toHaveBeenCalledWith('password', 10);
      expect(prisma.user.create).toHaveBeenCalledWith({
        data: {
          email: 'test@example.com',
          hashedPassword,
          role: 'USER'
        }
      });
    });
  });
});