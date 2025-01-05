import { prisma } from '$lib/server/db';
import bcrypt from 'bcryptjs';
import { dev } from '$app/environment';
import { redirect, type Cookies } from '@sveltejs/kit';
import crypto from 'crypto';

const EXPIRES_IN = 60 * 60 * 24 * 30; // 30 days
const RESET_TOKEN_EXPIRES_IN = 60 * 60; // 1 hour
const SESSION_COOKIE_NAME = 'session';

export async function createUser(email: string, password: string) {
  const hashedPassword = await bcrypt.hash(password, 10);

  return prisma.user.create({
    data: {
      email,
      hashedPassword,
      role: 'USER'
    }
  });
}

export async function validateUser(email: string, password: string) {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return null;

  const validPassword = await bcrypt.compare(password, user.hashedPassword);
  if (!validPassword) return null;

  return user;
}

export async function createSession(userId: string, cookies: Cookies) {
  const session = await prisma.session.create({
    data: {
      userId,
      expiresAt: new Date(Date.now() + EXPIRES_IN * 1000)
    }
  });

  cookies.set(SESSION_COOKIE_NAME, session.id, {
    path: '/',
    httpOnly: true,
    sameSite: 'lax',
    secure: !dev,
    maxAge: EXPIRES_IN
  });

  return session;
}

export async function getSession(cookies: Cookies) {
  const sessionId = cookies.get(SESSION_COOKIE_NAME);
  if (!sessionId) return null;

  const session = await prisma.session.findUnique({
    where: { id: sessionId },
    include: { user: true }
  });

  if (!session) return null;
  if (session.expiresAt < new Date()) {
    await prisma.session.delete({ where: { id: sessionId } });
    return null;
  }

  return session;
}

export async function invalidateSession(cookies: Cookies) {
  const sessionId = cookies.get(SESSION_COOKIE_NAME);
  if (sessionId) {
    await prisma.session.delete({ where: { id: sessionId } });
  }
  cookies.delete(SESSION_COOKIE_NAME, { path: '/' });
}

export function ensureAuth(locals: App.Locals) {
  if (!locals.user) {
    throw redirect(302, '/login');
  }
  return locals.user;
}

export function ensureGuest(locals: App.Locals) {
  if (locals.user) {
    throw redirect(302, '/dashboard');
  }
}

export async function createPasswordResetToken(email: string) {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return null;

  // Generate a secure random token
  const token = crypto.randomBytes(32).toString('hex');
  const expiresAt = new Date(Date.now() + RESET_TOKEN_EXPIRES_IN * 1000);

  // Create password reset record
  const passwordReset = await prisma.passwordReset.create({
    data: {
      userId: user.id,
      token,
      expiresAt
    }
  });

  return { token, email };
}

export async function validatePasswordResetToken(token: string) {
  const passwordReset = await prisma.passwordReset.findUnique({
    where: { token },
    include: { user: true }
  });

  if (!passwordReset) return null;
  if (passwordReset.usedAt) return null;
  if (passwordReset.expiresAt < new Date()) return null;

  return passwordReset;
}

export async function resetPassword(token: string, newPassword: string) {
  const passwordReset = await validatePasswordResetToken(token);
  if (!passwordReset) return false;

  const hashedPassword = await bcrypt.hash(newPassword, 10);

  // Update password and mark token as used in a transaction
  await prisma.$transaction([
    prisma.user.update({
      where: { id: passwordReset.userId },
      data: { hashedPassword }
    }),
    prisma.passwordReset.update({
      where: { id: passwordReset.id },
      data: { usedAt: new Date() }
    }),
    // Invalidate all sessions for security
    prisma.session.deleteMany({
      where: { userId: passwordReset.userId }
    })
  ]);

  return true;
}