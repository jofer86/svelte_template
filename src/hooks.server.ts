import { redirect, type Handle } from '@sveltejs/kit';
import { sequence } from '@sveltejs/kit/hooks';
import { rateLimit } from '$lib/server/rate-limiter';
import { error } from '@sveltejs/kit';
import { getSession } from '$lib/server/auth';

const handleAuth: Handle = async ({ event, resolve }) => {
  const session = await getSession(event.cookies);

  if (session) {
    event.locals.user = {
      userId: session.user.id,
      email: session.user.email,
      role: session.user.role
    };
  } else {
    event.locals.user = null;
  }

  // If the request is to a protected route and user is not authenticated
  const protectedRoute = event.url.pathname.startsWith('/(protected)');
  if (protectedRoute && !session) {
    throw redirect(302, '/login');
  }

  return resolve(event);
};

const handleRateLimit: Handle = async ({ event, resolve }) => {
  // Only rate limit API routes
  if (event.url.pathname.startsWith('/api')) {
    const ip = event.getClientAddress();
    if (!rateLimit(ip)) {
      throw error(429, 'Too Many Requests');
    }
  }
  return await resolve(event);
};

const handleError: Handle = async ({ event, resolve }) => {
  try {
    return await resolve(event);
  } catch (e) {
    console.error(`Error handling request: ${event.url.pathname}`, e);
    throw e;
  }
};

export const handle = sequence(handleAuth, handleRateLimit, handleError);