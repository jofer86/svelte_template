import { invalidateSession } from '$lib/server/auth';
import { redirect } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ cookies }) => {
  await invalidateSession(cookies);
  throw redirect(302, '/login');
};