import { json, error } from '@sveltejs/kit';
import { prisma } from '$lib/server/db';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ locals }) => {
  if (!locals.user) {
    throw error(401, 'Unauthorized');
  }

  try {
    const profile = await prisma.profile.findUnique({
      where: { userId: locals.user.userId },
      include: { user: true }
    });

    if (!profile) {
      throw error(404, 'Profile not found');
    }

    return json({
      name: profile.name,
      avatar: profile.avatar,
      email: profile.user.email
    });
  } catch (e) {
    console.error('Profile fetch error:', e);
    throw error(500, 'Internal server error');
  }
};

export const PUT: RequestHandler = async ({ request, locals }) => {
  if (!locals.user) {
    throw error(401, 'Unauthorized');
  }

  const data = await request.json();
  const { name, avatar } = data;

  try {
    const profile = await prisma.profile.upsert({
      where: { userId: locals.user.userId },
      update: { name, avatar },
      create: {
        userId: locals.user.userId,
        name,
        avatar
      }
    });

    return json(profile);
  } catch (e) {
    console.error('Profile update error:', e);
    throw error(500, 'Internal server error');
  }
};